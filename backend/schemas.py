from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DepartmentBase(BaseModel):
    name: str

class DepartmentSchema(DepartmentBase):
    id: int
    class Config:
        orm_mode = True

class ChallengeBase(BaseModel):
    title: str
    department_id: int
    problem_description: str
    desired_outcome: str
    sector: str
    indicative_budget: float
    pilot_duration_days: int
    status: str

class ChallengeSchema(ChallengeBase):
    id: int
    department: Optional[DepartmentSchema]
    applications_count: int = 0
    class Config:
        orm_mode = True

class StartupBase(BaseModel):
    name: str
    sector: str
    technology: str
    stage: str
    description: str
    pilot_ready: bool
    has_experience: bool

class StartupSchema(StartupBase):
    id: int
    class Config:
        orm_mode = True

class ApplicationBase(BaseModel):
    challenge_id: int
    startup_id: int
    status: str

class ApplicationSchema(ApplicationBase):
    id: int
    eligibility_score: Optional[float]
    evaluation_score: Optional[float]
    match_explanation: Optional[str]
    challenge: Optional[ChallengeSchema]
    startup: Optional[StartupSchema]
    class Config:
        orm_mode = True

class PilotKPIBase(BaseModel):
    name: str
    unit: str
    baseline: float
    target: float
    current: float
    failure_threshold: Optional[float] = None

class PilotKPISchema(PilotKPIBase):
    id: int
    pilot_id: int
    class Config:
        orm_mode = True

class PilotMilestoneBase(BaseModel):
    title: str
    percentage: float
    status: str
    payment_status: str

class PilotMilestoneSchema(PilotMilestoneBase):
    id: int
    pilot_id: int
    class Config:
        orm_mode = True

class RiskBase(BaseModel):
    description: str
    severity: str
    mitigation: str
    status: str

class RiskSchema(RiskBase):
    id: int
    pilot_id: int
    class Config:
        orm_mode = True

class ValidationBase(BaseModel):
    status: str
    evidence_summary: Optional[str]
    scale_decision: Optional[str]

class ValidationSchema(ValidationBase):
    id: int
    pilot_id: int
    class Config:
        orm_mode = True

class PilotGovernanceBase(BaseModel):
    category: str
    description: str

class PilotGovernanceSchema(PilotGovernanceBase):
    id: int
    pilot_id: int
    class Config:
        orm_mode = True

class PilotSchema(BaseModel):
    id: int
    application_id: int
    status: str
    start_date: datetime
    duration_days: int
    charter_locked_at: Optional[datetime] = None
    charter_hash: Optional[str] = None
    current_charter_hash: Optional[str] = None
    application: Optional[ApplicationSchema]
    kpis: List[PilotKPISchema] = []
    milestones: List[PilotMilestoneSchema] = []
    risks: List[RiskSchema] = []
    governance_controls: List[PilotGovernanceSchema] = []
    validation: Optional[ValidationSchema]
    class Config:
        orm_mode = True

class AuditLogSchema(BaseModel):
    id: int
    timestamp: datetime
    user_role: str
    action: str
    entity: str
    details: str
    class Config:
        orm_mode = True
