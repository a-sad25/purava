from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, get_db
import models
import hashlib
import json
import schemas
import ai_agent
from fastapi.responses import StreamingResponse
import pdf_generator

app = FastAPI(title="PURAVA API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

@app.get("/api/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    active_pilots = db.query(models.Pilot).filter(models.Pilot.status == "ACTIVE").count()
    validation_pilots = db.query(models.Pilot).filter(models.Pilot.status == "VALIDATION").count()
    completed_pilots = db.query(models.Pilot).filter(models.Pilot.status == "COMPLETED").count()
    successful_pilots = db.query(models.Pilot).filter(models.Pilot.status == "COMPLETED").count() # Mocked to match since QueueAI is successful
    eligible_startups = db.query(models.Application).filter(models.Application.status != "REJECTED").count()
    innovation_funnel = db.query(models.Application).count()
    
    return {
        "challenges": db.query(models.Challenge).count(),
        "startups": db.query(models.Startup).count(),
        "pilots": db.query(models.Pilot).count(),
        "active_pilots": active_pilots,
        "validation_pilots": validation_pilots,
        "successful_pilots": successful_pilots,
        "eligible_startups": eligible_startups,
        "innovation_funnel": innovation_funnel
    }

@app.get("/api/challenges", response_model=list[schemas.ChallengeSchema])
def get_challenges(db: Session = Depends(get_db)):
    challenges = db.query(models.Challenge).all()
    for c in challenges:
        c.applications_count = db.query(models.Application).filter(models.Application.challenge_id == c.id).count()
    return challenges

@app.get("/api/challenges/{id}", response_model=schemas.ChallengeSchema)
def get_challenge(id: int, db: Session = Depends(get_db)):
    return db.query(models.Challenge).filter(models.Challenge.id == id).first()

@app.get("/api/startups", response_model=list[schemas.StartupSchema])
def get_startups(db: Session = Depends(get_db)):
    return db.query(models.Startup).all()


def compute_current_hash(pilot):
    if not pilot.kpis: return None
    charter_dict = {
        "hypothesis": "Deploying QueueAI in selected hospital OPDs will reduce average patient waiting time without materially increasing staff workload or compromising operational safety.",
        "primary_kpi": {
            "name": pilot.kpis[0].name,
            "baseline": pilot.kpis[0].baseline,
            "target": pilot.kpis[0].target,
            "failure_threshold": pilot.kpis[0].failure_threshold
        },
        "secondary_kpis": [
            {"name": k.name, "baseline": k.baseline, "target": k.target} for k in pilot.kpis[1:]
        ],
        "success_criteria": "Primary KPI achieves <=52 minutes AND no secondary KPI breaches its defined safety/operational threshold.",
        "partial_criteria": "Primary KPI improves but does not meet the success target, while no critical safety or operational threshold is breached.",
        "failure_criteria": "Primary KPI remains above 65 minutes after the defined pilot evaluation period OR a critical operational/safety threshold is breached."
    }
    canonical = json.dumps(charter_dict, sort_keys=True)
    return hashlib.sha256(canonical.encode('utf-8')).hexdigest()

@app.get("/api/pilots", response_model=list[schemas.PilotSchema])
def get_pilots(db: Session = Depends(get_db)):
    pilots = db.query(models.Pilot).all()
    for p in pilots:
        p.current_charter_hash = compute_current_hash(p)
    return pilots


@app.get("/api/pilots/{id}", response_model=schemas.PilotSchema)
def get_pilot(id: int, db: Session = Depends(get_db)):
    return db.query(models.Pilot).filter(models.Pilot.id == id).first()

@app.post("/api/ai/structure-challenge")
def structure_challenge(payload: dict):
    raw_text = payload.get("raw_text", "")
    return ai_agent.structure_challenge(raw_text)

@app.post("/api/ai/assistant")
def ai_assistant(payload: dict):
    context = payload.get("context", "")
    question = payload.get("question", "")
    response = ai_agent.get_assistant_response(context, question)
    return {"response": response}

@app.post("/api/pilots/{id}/validate")
def validate_pilot(id: int, db: Session = Depends(get_db)):
    pilot = db.query(models.Pilot).filter(models.Pilot.id == id).first()
    if not pilot:
        raise HTTPException(status_code=404, detail="Pilot not found")
        
    if pilot.validation:
        pilot.validation.status = "VALIDATED"
    else:
        v = models.Validation(pilot_id=pilot.id, status="VALIDATED")
        db.add(v)
        
    db.commit()
    return {"status": "success"}

@app.get("/api/dossier/pdf/{pilot_id}")
def get_dossier(pilot_id: int, db: Session = Depends(get_db)):
    pilot = db.query(models.Pilot).filter(models.Pilot.id == pilot_id).first()
    if not pilot:
        raise HTTPException(status_code=404, detail="Pilot not found")
        
    kpi = pilot.kpis[0] if pilot.kpis else None
        
    data = {
        "challenge_title": pilot.application.challenge.title,
        "department_name": pilot.application.challenge.department.name,
        "startup_name": pilot.application.startup.name,
        "status": pilot.status,
        "duration_days": pilot.duration_days,
        "kpi_name": kpi.name if kpi else "N/A",
        "kpi_baseline": kpi.baseline if kpi else 0,
        "kpi_current": kpi.current if kpi else 0,
        "kpi_target": kpi.target if kpi else 0,
        "validation_status": pilot.validation.status if pilot.validation else "PENDING"
    }
    pdf_buffer = pdf_generator.generate_pilot_dossier(data)
    return StreamingResponse(pdf_buffer, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename=dossier_{pilot_id}.pdf"})

@app.post("/api/pilots/{id}/demo-simulate")
def demo_simulate(id: int, payload: dict, db: Session = Depends(get_db)):
    action = payload.get("action")
    pilot = db.query(models.Pilot).filter(models.Pilot.id == id).first()
    
    if action == "46":
        pilot.kpis[0].current = 46.0
        for r in pilot.risks: r.status = "MITIGATED"
    elif action == "60":
        pilot.kpis[0].current = 60.0
        for r in pilot.risks: r.status = "MITIGATED"
    elif action == "66":
        pilot.kpis[0].current = 66.0
        for r in pilot.risks: r.status = "MITIGATED"
    elif action == "60_critical":
        pilot.kpis[0].current = 60.0
        if pilot.risks:
            for r in pilot.risks: r.status = "MITIGATED"
            pilot.risks[0].severity = "CRITICAL"
            pilot.risks[0].status = "ACTIVE"
    elif action == "reset":
        pilot.kpis[0].current = 46.0
        if pilot.risks:
            pilot.risks[0].severity = "HIGH"
            pilot.risks[0].status = "MITIGATED"
            pilot.risks[1].status = "MITIGATED"
    
    db.commit()
    return {"status": "success"}

@app.post("/api/pilots/{id}/lock-charter")
def lock_charter(id: int, db: Session = Depends(get_db)):
    from datetime import datetime
    pilot = db.query(models.Pilot).filter(models.Pilot.id == id).first()
    if not pilot.charter_locked_at:
        pilot.charter_locked_at = datetime.utcnow()
        pilot.charter_hash = compute_current_hash(pilot)
        db.commit()
    return {"status": "locked", "hash": pilot.charter_hash}

@app.put("/api/pilots/{id}/charter")
def edit_charter(id: int, db: Session = Depends(get_db)):
    pilot = db.query(models.Pilot).filter(models.Pilot.id == id).first()
    if pilot.charter_locked_at:
        raise HTTPException(status_code=409, detail="Charter is locked; changes require a formal amendment")
    return {"status": "success"}
