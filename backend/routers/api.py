from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import (
    InvoiceCreate, InvoiceOut, InvoiceUpdate, InvoiceStatus,
    VendorCreate, VendorOut,
    WorkflowLogCreate, WorkflowLogOut,
    DashboardStats, User,
)
from routers.auth import get_current_user
from services import core

router = APIRouter(prefix="/api", tags=["api"])


# ── Dashboard ─────────────────────────────────────────────────────────────────

@router.get("/dashboard", response_model=DashboardStats)
async def dashboard(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await core.get_dashboard_stats(db, current_user.id)


# ── Invoices ──────────────────────────────────────────────────────────────────

@router.post("/invoices", response_model=InvoiceOut, status_code=201)
async def create_invoice(
    data: InvoiceCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await core.create_invoice(db, current_user.id, data)


@router.get("/invoices", response_model=List[InvoiceOut])
async def list_invoices(
    status: Optional[InvoiceStatus] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await core.list_invoices(db, current_user.id, status=status, skip=skip, limit=limit)


@router.get("/invoices/{invoice_id}", response_model=InvoiceOut)
async def get_invoice(
    invoice_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    invoice = await core.get_invoice(db, invoice_id)
    if not invoice or invoice.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice


@router.patch("/invoices/{invoice_id}", response_model=InvoiceOut)
async def update_invoice(
    invoice_id: str,
    data: InvoiceUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    invoice = await core.update_invoice(db, invoice_id, current_user.id, data)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice


@router.delete("/invoices/{invoice_id}", status_code=204)
async def delete_invoice(
    invoice_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    deleted = await core.delete_invoice(db, invoice_id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Invoice not found")


# ── Workflow ──────────────────────────────────────────────────────────────────

@router.post("/invoices/{invoice_id}/workflow", response_model=WorkflowLogOut, status_code=201)
async def apply_workflow(
    invoice_id: str,
    data: WorkflowLogCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Verify invoice belongs to user
    invoice = await core.get_invoice(db, invoice_id)
    if not invoice or invoice.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Invoice not found")

    try:
        log = await core.apply_workflow_action(db, invoice_id, current_user.id, data)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    return log


@router.get("/invoices/{invoice_id}/workflow", response_model=List[WorkflowLogOut])
async def get_workflow_logs(
    invoice_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    invoice = await core.get_invoice(db, invoice_id)
    if not invoice or invoice.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return await core.get_workflow_logs(db, invoice_id)


# ── Vendors ───────────────────────────────────────────────────────────────────

@router.post("/vendors", response_model=VendorOut, status_code=201)
async def create_vendor(
    data: VendorCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await core.create_vendor(db, data)


@router.get("/vendors", response_model=List[VendorOut])
async def list_vendors(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await core.list_vendors(db, skip=skip, limit=limit)


@router.get("/vendors/{vendor_id}", response_model=VendorOut)
async def get_vendor(
    vendor_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    vendor = await core.get_vendor(db, vendor_id)
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor
