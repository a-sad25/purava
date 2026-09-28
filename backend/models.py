from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    challenges = relationship("Challenge", back_populates="department")

class Challenge(Base):
    __tablename__ = "challenges"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"))
    problem_description = Column(Text)
    desired_outcome = Column(Text)
    sector = Column(String)
    indicative_budget = Column(Float)
    pilot_duration_days = Column(Integer)
    status = Column(String, default="DRAFT") # DRAFT, PUBLISHED, APPLICATIONS_OPEN
    
    department = relationship("Department", back_populates="challenges")
    applications = relationship("Application", back_populates="challenge")

class Startup(Base):
    __tablename__ = "startups"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    sector = Column(String)
    technology = Column(String)
    stage = Column(String)
    description = Column(Text)
    pilot_ready = Column(Boolean, default=False)
    has_experience = Column(Boolean, default=False)
    
    applications = relationship("Application", back_populates="startup")

class Application(Base):
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id"))
    startup_id = Column(Integer, ForeignKey("startups.id"))
    status = Column(String, default="SUBMITTED") # SUBMITTED, ELIGIBLE, EVALUATED, PILOT_SELECTED, REJECTED
    
    eligibility_score = Column(Float, nullable=True)
    evaluation_score = Column(Float, nullable=True)
    match_explanation = Column(Text, nullable=True)
    
    challenge = relationship("Challenge", back_populates="applications")
    startup = relationship("Startup", back_populates="applications")
    pilot = relationship("Pilot", back_populates="application", uselist=False)

class Pilot(Base):
    __tablename__ = "pilots"
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    status = Column(String, default="DESIGN") # DESIGN, ACTIVE, VALIDATION, COMPLETED
    start_date = Column(DateTime, default=datetime.datetime.utcnow)
    duration_days = Column(Integer)
    charter_locked_at = Column(DateTime, nullable=True)
    charter_hash = Column(String, nullable=True)
    
    application = relationship("Application", back_populates="pilot")
    kpis = relationship("PilotKPI", back_populates="pilot")
    milestones = relationship("PilotMilestone", back_populates="pilot")
    risks = relationship("Risk", back_populates="pilot")
    validation = relationship("Validation", back_populates="pilot", uselist=False)
    governance_controls = relationship("PilotGovernance", back_populates="pilot")

class PilotKPI(Base):
    __tablename__ = "pilot_kpis"
    id = Column(Integer, primary_key=True, index=True)
    pilot_id = Column(Integer, ForeignKey("pilots.id"))
    name = Column(String)
    unit = Column(String)
    baseline = Column(Float)
    target = Column(Float)
    current = Column(Float, default=0.0)
    failure_threshold = Column(Float, nullable=True)
    
    pilot = relationship("Pilot", back_populates="kpis")

class PilotMilestone(Base):
    __tablename__ = "pilot_milestones"
    id = Column(Integer, primary_key=True, index=True)
    pilot_id = Column(Integer, ForeignKey("pilots.id"))
    title = Column(String)
    percentage = Column(Float)
    status = Column(String, default="PENDING") # PENDING, IN_PROGRESS, COMPLETED, LOCKED
    payment_status = Column(String, default="PENDING") # PENDING, RELEASED
    
    pilot = relationship("Pilot", back_populates="milestones")

class Risk(Base):
    __tablename__ = "risks"
    id = Column(Integer, primary_key=True, index=True)
    pilot_id = Column(Integer, ForeignKey("pilots.id"))
    description = Column(String)
    severity = Column(String) # LOW, MEDIUM, HIGH
    mitigation = Column(Text)
    status = Column(String, default="IDENTIFIED") # IDENTIFIED, MITIGATED
    
    pilot = relationship("Pilot", back_populates="risks")

class Validation(Base):
    __tablename__ = "validations"
    id = Column(Integer, primary_key=True, index=True)
    pilot_id = Column(Integer, ForeignKey("pilots.id"))
    status = Column(String, default="PENDING") # PENDING, VALIDATED, FAILED
    evidence_summary = Column(Text)
    scale_decision = Column(String, nullable=True) # SCALE, EXTEND, CLOSE
    
    pilot = relationship("Pilot", back_populates="validation")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    user_role = Column(String)
    action = Column(String)
    entity = Column(String)
    details = Column(Text)

class PilotGovernance(Base):
    __tablename__ = "pilot_governance"
    id = Column(Integer, primary_key=True, index=True)
    pilot_id = Column(Integer, ForeignKey("pilots.id"))
    category = Column(String)
    description = Column(Text)
    
    pilot = relationship("Pilot", back_populates="governance_controls")
