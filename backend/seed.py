import json
import hashlib
from datetime import datetime
from database import SessionLocal, engine, Base
import models

def compute_charter_hash(charter_data):
    canonical = json.dumps(charter_data, sort_keys=True)
    return hashlib.sha256(canonical.encode('utf-8')).hexdigest()

def seed_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    print("Seeding PURAVA data...")

    # Departments
    dept_health = models.Department(name="Maharashtra Health Department")
    dept_agri = models.Department(name="Agriculture Department")
    dept_urban = models.Department(name="Urban Development")
    dept_edu = models.Department(name="Education Department")
    dept_pwd = models.Department(name="Public Works Department")
    db.add_all([dept_health, dept_agri, dept_urban, dept_edu, dept_pwd])
    db.commit()

    # Challenges
    c1 = models.Challenge(
        title="AI-Powered Hospital Queue Optimization",
        department_id=dept_health.id,
        problem_description="Government hospitals are experiencing long patient waiting times. The department is seeking an innovative technology solution capable of reducing average waiting time without requiring major infrastructure changes.",
        desired_outcome="Reduce average patient waiting time by at least 30%.",
        sector="Healthcare",
        indicative_budget=2500000.0,
        pilot_duration_days=90,
        status="PUBLISHED"
    )
    c2 = models.Challenge(
        title="Agricultural Water Management",
        department_id=dept_agri.id,
        problem_description="Inefficient water usage in rural districts.",
        desired_outcome="Reduce water waste by 20%.",
        sector="Agriculture",
        indicative_budget=1500000.0,
        pilot_duration_days=120,
        status="PUBLISHED"
    )
    c3 = models.Challenge(
        title="Smart Traffic Light Synchronization",
        department_id=dept_urban.id,
        problem_description="Traffic congestion at major arterial intersections during peak hours.",
        desired_outcome="Improve traffic flow by 15%.",
        sector="Urban Mobility",
        indicative_budget=4000000.0,
        pilot_duration_days=180,
        status="APPLICATIONS_OPEN"
    )
    c4 = models.Challenge(
        title="Digital Land Records Verification",
        department_id=dept_pwd.id,
        problem_description="Manual verification of land records causes delays in infrastructure projects.",
        desired_outcome="Automate 80% of document cross-referencing.",
        sector="Governance",
        indicative_budget=1000000.0,
        pilot_duration_days=60,
        status="DRAFT"
    )
    db.add_all([c1, c2, c3, c4])
    db.commit()

    # Startups
    s1 = models.Startup(
        name="QueueAI Technologies",
        sector="Healthcare Technology",
        technology="AI / Predictive Analytics / Workflow Optimization",
        stage="Growth / Pilot Ready",
        description="AI-powered patient queue optimization and hospital flow management platform.",
        pilot_ready=True,
        has_experience=True
    )
    s2 = models.Startup(
        name="SmartWater AI",
        sector="Agriculture Tech",
        technology="IoT",
        stage="Seed",
        description="Smart water sensors for precision agriculture.",
        pilot_ready=True,
        has_experience=False
    )
    s3 = models.Startup(
        name="FlowSense Mobility",
        sector="Urban Tech",
        technology="Computer Vision",
        stage="Early Growth",
        description="Camera-based traffic light synchronization system.",
        pilot_ready=True,
        has_experience=True
    )
    s4 = models.Startup(
        name="DocuChain",
        sector="GovTech",
        technology="Blockchain",
        stage="Idea",
        description="Immutable land records platform.",
        pilot_ready=False,
        has_experience=False
    )
    s5 = models.Startup(
        name="HealthSync",
        sector="Healthcare Technology",
        technology="App / API",
        stage="Seed",
        description="Patient appointment booking system.",
        pilot_ready=True,
        has_experience=False
    )
    db.add_all([s1, s2, s3, s4, s5])
    db.commit()

    # Applications
    app1 = models.Application(
        challenge_id=c1.id,
        startup_id=s1.id,
        status="PILOT_SELECTED",
        eligibility_score=100.0,
        evaluation_score=92.5,
        match_explanation="Strong alignment with healthcare operations, proven predictive analytics, pilot-ready with relevant hospital workflow experience."
    )
    app2 = models.Application(
        challenge_id=c3.id,
        startup_id=s3.id,
        status="EVALUATED",
        eligibility_score=90.0,
        evaluation_score=75.0,
        match_explanation="Good vision tech but lacks hardware integration plan."
    )
    app3 = models.Application(
        challenge_id=c1.id,
        startup_id=s5.id,
        status="EVALUATED",
        eligibility_score=100.0,
        evaluation_score=68.0,
        match_explanation="Meets basic criteria but does not utilize predictive AI for flow control."
    )
    db.add_all([app1, app2, app3])
    db.commit()

    # Generate Charter Hash
    charter_dict = {
        "hypothesis": "Deploying QueueAI in selected hospital OPDs will reduce average patient waiting time without materially increasing staff workload or compromising operational safety.",
        "primary_kpi": {
            "name": "Average Patient Waiting Time",
            "baseline": 74.0,
            "target": 52.0,
            "failure_threshold": 65.0
        },
        "secondary_kpis": [
            {"name": "Staff Processing Time", "baseline": 11.5, "target": 12.0},
            {"name": "Queue Abandonment Rate", "baseline": 8.2, "target": 6.0},
            {"name": "System Availability", "baseline": 99.0, "target": 99.0}
        ],
        "success_criteria": "Primary KPI achieves <=52 minutes AND no secondary KPI breaches its defined safety/operational threshold.",
        "partial_criteria": "Primary KPI improves but does not meet the success target, while no critical safety or operational threshold is breached.",
        "failure_criteria": "Primary KPI remains above 65 minutes after the defined pilot evaluation period OR a critical operational/safety threshold is breached."
    }
    charter_hash_str = compute_charter_hash(charter_dict)

    # Pilot (QueueAI)
    p1 = models.Pilot(
        application_id=app1.id,
        status="COMPLETED",
        duration_days=90,
        start_date=datetime(2026, 6, 30, 10, 0, 0),
        charter_locked_at=datetime(2026, 6, 30, 10, 0, 0),
        charter_hash=charter_hash_str
    )
    db.add(p1)
    db.commit()

    # KPIs
    kpi1 = models.PilotKPI(
        pilot_id=p1.id,
        name="Average Patient Waiting Time",
        unit="min",
        baseline=74.0,
        target=52.0,
        current=46.0,
        failure_threshold=65.0
    )
    kpi2 = models.PilotKPI(
        pilot_id=p1.id,
        name="Staff Processing Time",
        unit="min",
        baseline=11.5,
        target=12.0,
        current=11.5,
        failure_threshold=None
    )
    kpi3 = models.PilotKPI(
        pilot_id=p1.id,
        name="Queue Abandonment Rate",
        unit="%",
        baseline=8.2,
        target=6.0,
        current=5.4,
        failure_threshold=None
    )
    kpi4 = models.PilotKPI(
        pilot_id=p1.id,
        name="System Availability",
        unit="%",
        baseline=99.0,
        target=99.0,
        current=99.6,
        failure_threshold=None
    )
    db.add_all([kpi1, kpi2, kpi3, kpi4])
    
    # Milestones
    m1 = models.PilotMilestone(pilot_id=p1.id, title="Deployment", percentage=25.0, status="COMPLETED", payment_status="RELEASED")
    m2 = models.PilotMilestone(pilot_id=p1.id, title="Mid-Pilot Validation", percentage=25.0, status="COMPLETED", payment_status="RELEASED")
    m3 = models.PilotMilestone(pilot_id=p1.id, title="Performance Target", percentage=25.0, status="COMPLETED", payment_status="RELEASED")
    m4 = models.PilotMilestone(pilot_id=p1.id, title="Independent Validation", percentage=25.0, status="COMPLETED", payment_status="RELEASED")
    db.add_all([m1, m2, m3, m4])

    # Governance Controls
    g1 = models.PilotGovernance(pilot_id=p1.id, category="DATA", description="Operational queue timestamps only; no patient clinical records or PII processed.")
    g2 = models.PilotGovernance(pilot_id=p1.id, category="IP", description="Background IP retained by startup; pilot-specific government usage rights defined through approved contractual terms.")
    g3 = models.PilotGovernance(pilot_id=p1.id, category="CYBERSECURITY", description="Role-based access; preliminary deployment vulnerability check passed.")
    g4 = models.PilotGovernance(pilot_id=p1.id, category="RISK", description="Supervised hospital deployment with staff orientation sessions.")
    db.add_all([g1, g2, g3, g4])

    # Risk
    r1 = models.Risk(
        pilot_id=p1.id,
        description="Patient Data Exposure",
        severity="HIGH",
        mitigation="Restricted pilot dataset + role-based access.",
        status="MITIGATED"
    )
    r2 = models.Risk(
        pilot_id=p1.id,
        description="Staff Adoption Resistance",
        severity="MEDIUM",
        mitigation="On-site training and simplified tablet interface.",
        status="MITIGATED"
    )
    db.add_all([r1, r2])
    
    # Validation
    v1 = models.Validation(
        pilot_id=p1.id,
        status="VALIDATED"
    )
    db.add(v1)
    
    db.commit()
    print("Seeding complete.")

if __name__ == "__main__":
    seed_db()
