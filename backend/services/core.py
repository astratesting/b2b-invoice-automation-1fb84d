from __future__ import annotations
import json
import random
import uuid
from datetime import date, datetime, timedelta
from typing import Optional, List

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models import (
    Invoice, InvoiceLineItem, InvoiceStatus, Vendor,
    WorkflowLog, WorkflowAction, User,
    InvoiceCreate, InvoiceUpdate, WorkflowLogCreate, DashboardStats,
)


# ── AI Processing ─────────────────────────────────────────────────────────────

def _ai_process_invoice(invoice: Invoice) -> dict:
    """
    Simulates AI extraction + anomaly detection.
    In production, replace with Claude API / OCR pipeline call.
    """
    flags: list[str] = []
    confidence = round(random.uniform(0.72, 0.99), 4)

    # Flag large invoices
    if float(invoice.total_amount) > 50_000:
        flags.append("HIGH_VALUE: manual review recommended")

    # Flag missing due date
    if invoice.due_date is None:
        flags.append("MISSING_DUE_DATE")

    # Flag very short payment terms (<7 days)
    if invoice.due_date and invoice.issue_date:
        days = (invoice.due_date - invoice.issue_date).days
        if days < 7:
            flags.append(f"SHORT_PAYMENT_TERMS: {days} days")

    # Flag suspicious round amounts
    total = float(invoice.total_amount)
    if total > 1000 and total == int(total) and str(int(total)).endswith("000"):
        flags.append("ROUND_AMOUNT: verify accuracy")

    extracted = {
        "ai_invoice_number": invoice.invoice_number,
        "ai_vendor_name": None,
        "ai_total": float(invoice.total_amount),
        "ai_currency": invoice.currency,
        "processed_at": datetime.utcnow().isoformat(),
    }

    return {
        "confidence": confidence,
        "flags": flags,
        "extracted": extracted,
    }


# ── Invoice Service ───────────────────────────────────────────────────────────

async def create_invoice(db: AsyncSession, owner_id: str, data: InvoiceCreate) -> Invoice:
    invoice = Invoice(
        id=str(uuid.uuid4()),
        invoice_number=data.invoice_number,
        owner_id=owner_id,
        vendor_id=data.vendor_id,
        issue_date=data.issue_date,
        due_date=data.due_date,
        subtotal=data.subtotal,
        tax_amount=data.tax_amount,
        total_amount=data.total_amount,
        currency=data.currency,
        description=data.description,
        file_url=data.file_url,
        file_name=data.file_name,
        status=InvoiceStatus.processing,
    )
    db.add(invoice)
    await db.flush()  # get id before line items

    for li_data in data.line_items:
        li = InvoiceLineItem(
            invoice_id=invoice.id,
            description=li_data.description,
            quantity=li_data.quantity,
            unit_price=li_data.unit_price,
            amount=li_data.amount,
        )
        db.add(li)

    # AI processing
    ai_result = _ai_process_invoice(invoice)
    invoice.ai_confidence = ai_result["confidence"]
    invoice.ai_flags = json.dumps(ai_result["flags"])
    invoice.ai_extracted_data = json.dumps(ai_result["extracted"])
    invoice.status = InvoiceStatus.pending

    await db.commit()
    await db.refresh(invoice)
    return await get_invoice(db, invoice.id)


async def get_invoice(db: AsyncSession, invoice_id: str) -> Optional[Invoice]:
    result = await db.execute(
        select(Invoice)
        .options(selectinload(Invoice.line_items), selectinload(Invoice.workflow_logs))
        .where(Invoice.id == invoice_id)
    )
    return result.scalar_one_or_none()


async def list_invoices(
    db: AsyncSession,
    owner_id: str,
    status: Optional[InvoiceStatus] = None,
    skip: int = 0,
    limit: int = 50,
) -> List[Invoice]:
    q = (
        select(Invoice)
        .options(selectinload(Invoice.line_items))
        .where(Invoice.owner_id == owner_id)
    )
    if status:
        q = q.where(Invoice.status == status)
    q = q.order_by(Invoice.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(q)
    return list(result.scalars().all())


async def update_invoice(
    db: AsyncSession, invoice_id: str, owner_id: str, data: InvoiceUpdate
) -> Optional[Invoice]:
    invoice = await get_invoice(db, invoice_id)
    if not invoice or invoice.owner_id != owner_id:
        return None

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(invoice, field, value)

    await db.commit()
    return await get_invoice(db, invoice_id)


async def delete_invoice(db: AsyncSession, invoice_id: str, owner_id: str) -> bool:
    invoice = await get_invoice(db, invoice_id)
    if not invoice or invoice.owner_id != owner_id:
        return False
    await db.delete(invoice)
    await db.commit()
    return True


# ── Workflow Service ──────────────────────────────────────────────────────────

_ALLOWED_TRANSITIONS: dict[InvoiceStatus, list[InvoiceStatus]] = {
    InvoiceStatus.pending: [InvoiceStatus.approved, InvoiceStatus.rejected, InvoiceStatus.processing],
    InvoiceStatus.processing: [InvoiceStatus.pending, InvoiceStatus.rejected],
    InvoiceStatus.approved: [InvoiceStatus.paid, InvoiceStatus.rejected],
    InvoiceStatus.rejected: [InvoiceStatus.pending],
    InvoiceStatus.paid: [],
}

_ACTION_TO_STATUS: dict[WorkflowAction, InvoiceStatus] = {
    WorkflowAction.approve: InvoiceStatus.approved,
    WorkflowAction.reject: InvoiceStatus.rejected,
    WorkflowAction.request_changes: InvoiceStatus.pending,
    WorkflowAction.escalate: InvoiceStatus.processing,
}


async def apply_workflow_action(
    db: AsyncSession,
    invoice_id: str,
    actor_id: str,
    data: WorkflowLogCreate,
) -> Optional[WorkflowLog]:
    invoice = await get_invoice(db, invoice_id)
    if not invoice:
        return None

    new_status = _ACTION_TO_STATUS[data.action]
    allowed = _ALLOWED_TRANSITIONS.get(invoice.status, [])
    if new_status not in allowed:
        raise ValueError(
            f"Cannot transition from '{invoice.status}' to '{new_status}' via '{data.action}'"
        )

    log = WorkflowLog(
        invoice_id=invoice_id,
        actor_id=actor_id,
        action=data.action,
        note=data.note,
        previous_status=invoice.status.value,
        new_status=new_status.value,
    )
    invoice.status = new_status
    db.add(log)
    await db.commit()
    await db.refresh(log)
    return log


async def get_workflow_logs(db: AsyncSession, invoice_id: str) -> List[WorkflowLog]:
    result = await db.execute(
        select(WorkflowLog)
        .where(WorkflowLog.invoice_id == invoice_id)
        .order_by(WorkflowLog.created_at.asc())
    )
    return list(result.scalars().all())


# ── Vendor Service ────────────────────────────────────────────────────────────

async def create_vendor(db: AsyncSession, data) -> Vendor:
    vendor = Vendor(id=str(uuid.uuid4()), **data.model_dump())
    db.add(vendor)
    await db.commit()
    await db.refresh(vendor)
    return vendor


async def list_vendors(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Vendor]:
    result = await db.execute(select(Vendor).offset(skip).limit(limit))
    return list(result.scalars().all())


async def get_vendor(db: AsyncSession, vendor_id: str) -> Optional[Vendor]:
    result = await db.execute(select(Vendor).where(Vendor.id == vendor_id))
    return result.scalar_one_or_none()


# ── Dashboard Analytics ───────────────────────────────────────────────────────

async def get_dashboard_stats(db: AsyncSession, owner_id: str) -> DashboardStats:
    # Counts by status
    counts_q = await db.execute(
        select(Invoice.status, func.count(Invoice.id))
        .where(Invoice.owner_id == owner_id)
        .group_by(Invoice.status)
    )
    counts = {row[0]: row[1] for row in counts_q.all()}

    # Amount aggregates
    amounts_q = await db.execute(
        select(Invoice.status, func.coalesce(func.sum(Invoice.total_amount), 0))
        .where(Invoice.owner_id == owner_id)
        .group_by(Invoice.status)
    )
    amounts = {row[0]: float(row[1]) for row in amounts_q.all()}

    total_invoices = sum(counts.values())

    # Average processing time (issue → first approval/rejection)
    # Simplified: use avg days from created_at to updated_at for non-pending
    avg_q = await db.execute(
        select(
            func.avg(
                func.julianday(Invoice.updated_at) - func.julianday(Invoice.created_at)
            )
        ).where(
            and_(
                Invoice.owner_id == owner_id,
                Invoice.status.in_([InvoiceStatus.approved, InvoiceStatus.paid]),
            )
        )
    )
    avg_days_raw = avg_q.scalar()
    avg_days = round(float(avg_days_raw), 2) if avg_days_raw else 0.0

    recent = await list_invoices(db, owner_id, limit=5)

    return DashboardStats(
        total_invoices=total_invoices,
        pending_count=counts.get(InvoiceStatus.pending, 0),
        approved_count=counts.get(InvoiceStatus.approved, 0),
        rejected_count=counts.get(InvoiceStatus.rejected, 0),
        paid_count=counts.get(InvoiceStatus.paid, 0),
        total_amount_pending=amounts.get(InvoiceStatus.pending, 0.0),
        total_amount_paid=amounts.get(InvoiceStatus.paid, 0.0),
        avg_processing_days=avg_days,
        recent_invoices=recent,
    )
