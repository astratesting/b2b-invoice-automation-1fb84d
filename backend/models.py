from __future__ import annotations
import enum
from datetime import datetime, date
from typing import Optional, List
from decimal import Decimal

from sqlalchemy import (
    String, Text, Numeric, Date, DateTime, Enum as SAEnum,
    ForeignKey, Boolean, Integer, func
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pydantic import BaseModel, EmailStr, field_validator
import uuid

from database import Base


# ── Enums ────────────────────────────────────────────────────────────────────

class InvoiceStatus(str, enum.Enum):
    pending = "pending"
    processing = "processing"
    approved = "approved"
    rejected = "rejected"
    paid = "paid"


class WorkflowAction(str, enum.Enum):
    approve = "approve"
    reject = "reject"
    request_changes = "request_changes"
    escalate = "escalate"


# ── SQLAlchemy ORM ────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    company: Mapped[Optional[str]] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    invoices: Mapped[List["Invoice"]] = relationship("Invoice", back_populates="owner", cascade="all, delete-orphan")
    workflow_logs: Mapped[List["WorkflowLog"]] = relationship("WorkflowLog", back_populates="actor")


class Vendor(Base):
    __tablename__ = "vendors"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(255))
    phone: Mapped[Optional[str]] = mapped_column(String(50))
    address: Mapped[Optional[str]] = mapped_column(Text)
    tax_id: Mapped[Optional[str]] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    invoices: Mapped[List["Invoice"]] = relationship("Invoice", back_populates="vendor")


class Invoice(Base):
    __tablename__ = "invoices"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    invoice_number: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    owner_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    vendor_id: Mapped[Optional[str]] = mapped_column(ForeignKey("vendors.id"))

    # Invoice details
    issue_date: Mapped[date] = mapped_column(Date, nullable=False)
    due_date: Mapped[Optional[date]] = mapped_column(Date)
    subtotal: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    tax_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    total_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    description: Mapped[Optional[str]] = mapped_column(Text)

    # AI processing
    status: Mapped[InvoiceStatus] = mapped_column(SAEnum(InvoiceStatus), default=InvoiceStatus.pending)
    ai_confidence: Mapped[Optional[float]] = mapped_column(Numeric(5, 4))
    ai_extracted_data: Mapped[Optional[str]] = mapped_column(Text)  # JSON blob
    ai_flags: Mapped[Optional[str]] = mapped_column(Text)           # JSON array of flag strings

    # File
    file_url: Mapped[Optional[str]] = mapped_column(String(512))
    file_name: Mapped[Optional[str]] = mapped_column(String(255))

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    owner: Mapped["User"] = relationship("User", back_populates="invoices")
    vendor: Mapped[Optional["Vendor"]] = relationship("Vendor", back_populates="invoices")
    line_items: Mapped[List["InvoiceLineItem"]] = relationship("InvoiceLineItem", back_populates="invoice", cascade="all, delete-orphan")
    workflow_logs: Mapped[List["WorkflowLog"]] = relationship("WorkflowLog", back_populates="invoice", cascade="all, delete-orphan")


class InvoiceLineItem(Base):
    __tablename__ = "invoice_line_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    invoice_id: Mapped[str] = mapped_column(ForeignKey("invoices.id"), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    quantity: Mapped[Decimal] = mapped_column(Numeric(10, 3), default=1)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)

    invoice: Mapped["Invoice"] = relationship("Invoice", back_populates="line_items")


class WorkflowLog(Base):
    __tablename__ = "workflow_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    invoice_id: Mapped[str] = mapped_column(ForeignKey("invoices.id"), nullable=False)
    actor_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    action: Mapped[WorkflowAction] = mapped_column(SAEnum(WorkflowAction), nullable=False)
    note: Mapped[Optional[str]] = mapped_column(Text)
    previous_status: Mapped[Optional[str]] = mapped_column(String(50))
    new_status: Mapped[Optional[str]] = mapped_column(String(50))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    invoice: Mapped["Invoice"] = relationship("Invoice", back_populates="workflow_logs")
    actor: Mapped["User"] = relationship("User", back_populates="workflow_logs")


# ── Pydantic Schemas ──────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    company: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    company: Optional[str]
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class LineItemCreate(BaseModel):
    description: str
    quantity: float = 1.0
    unit_price: float
    amount: float


class LineItemOut(LineItemCreate):
    id: int
    model_config = {"from_attributes": True}


class VendorCreate(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    tax_id: Optional[str] = None


class VendorOut(VendorCreate):
    id: str
    created_at: datetime
    model_config = {"from_attributes": True}


class InvoiceCreate(BaseModel):
    invoice_number: str
    vendor_id: Optional[str] = None
    issue_date: date
    due_date: Optional[date] = None
    subtotal: float
    tax_amount: float = 0.0
    total_amount: float
    currency: str = "USD"
    description: Optional[str] = None
    file_url: Optional[str] = None
    file_name: Optional[str] = None
    line_items: List[LineItemCreate] = []


class InvoiceUpdate(BaseModel):
    vendor_id: Optional[str] = None
    due_date: Optional[date] = None
    description: Optional[str] = None
    status: Optional[InvoiceStatus] = None


class InvoiceOut(BaseModel):
    id: str
    invoice_number: str
    owner_id: str
    vendor_id: Optional[str]
    issue_date: date
    due_date: Optional[date]
    subtotal: float
    tax_amount: float
    total_amount: float
    currency: str
    description: Optional[str]
    status: InvoiceStatus
    ai_confidence: Optional[float]
    ai_flags: Optional[str]
    file_url: Optional[str]
    file_name: Optional[str]
    created_at: datetime
    updated_at: datetime
    line_items: List[LineItemOut] = []

    model_config = {"from_attributes": True}


class WorkflowLogCreate(BaseModel):
    action: WorkflowAction
    note: Optional[str] = None


class WorkflowLogOut(BaseModel):
    id: int
    invoice_id: str
    actor_id: str
    action: WorkflowAction
    note: Optional[str]
    previous_status: Optional[str]
    new_status: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class DashboardStats(BaseModel):
    total_invoices: int
    pending_count: int
    approved_count: int
    rejected_count: int
    paid_count: int
    total_amount_pending: float
    total_amount_paid: float
    avg_processing_days: float
    recent_invoices: List[InvoiceOut]
