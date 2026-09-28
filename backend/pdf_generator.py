from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
import io

def generate_pilot_dossier(pilot_data):
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    margin = 40
    
    # 1. Header & Authority Banner
    c.setFillColor(colors.HexColor("#1F3A5F"))
    c.rect(0, height - 70, width, 70, fill=1, stroke=0)
    
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(width / 2.0, height - 25, "GOVERNMENT OF MAHARASHTRA")
    
    c.setFont("Helvetica", 10)
    c.drawCentredString(width / 2.0, height - 42, "Maharashtra State Innovation Society (MSInS) - Innovation Pilot Sandbox")
    c.setFillColor(colors.red)
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(width / 2.0, height - 56, "PROTOTYPE — SIMULATED DATA — NOT AN OFFICIAL GOVERNMENT DOCUMENT")
    
    c.setFillColor(colors.HexColor("#1F3A5F"))
    c.rect(0, height - 100, width, 30, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 12)
    c.drawCentredString(width / 2.0, height - 89, "EMPIRICAL PILOT EVALUATION & EVIDENCE BRIEF")
    
    # Metadata bar
    c.setFillColor(colors.black)
    c.setFont("Helvetica", 9)
    y = height - 115
    date_str = "28-Sep-2026"
    metadata = f"Dossier Ref: MH-PLT-2026-0892    |    Date: {date_str}    |    Status: PILOT VALIDATED"
    c.drawCentredString(width / 2.0, y, metadata)
    
    y -= 30
    
    def draw_section_header(title, y_pos):
        c.setFillColor(colors.HexColor("#f1f5f9"))
        c.rect(margin, y_pos - 15, width - 2*margin, 20, fill=1, stroke=1)
        c.setFillColor(colors.HexColor("#0f172a"))
        c.setFont("Helvetica-Bold", 10)
        c.drawString(margin + 5, y_pos - 10, title)
        return y_pos - 35

    def draw_row(label, val, y_pos, indent=margin+5):
        c.setFont("Helvetica-Bold", 9)
        c.drawString(indent, y_pos, label)
        c.setFont("Helvetica", 9)
        c.drawString(indent + 140, y_pos, str(val))
        return y_pos - 15

    # Section 1: Challenge & Startup Metadata Table
    y = draw_section_header("SECTION 1: CHALLENGE & STARTUP METADATA", y)
    y = draw_row("Department:", "Maharashtra Health Department", y)
    y = draw_row("Target Challenge:", "AI-Powered Hospital Queue Optimization", y)
    y = draw_row("Selected Startup:", "QueueAI Technologies (DPIIT profile evidence available)", y)
    y = draw_row("Pilot Sites:", "3 Government Hospitals (90 Days)", y)
    
    y -= 10
    
    # Section 2: Empirical Performance Metrics Table
    y = draw_section_header("SECTION 2: EMPIRICAL PERFORMANCE METRICS", y)
    y = draw_row("Metric:", "Average Patient Waiting Time", y)
    y = draw_row("Baseline:", "74 min", y)
    y = draw_row("Pre-Agreed Target:", "<=52 min", y)
    y = draw_row("Verified Measurement:", "46 min", y)
    y = draw_row("Achievement:", "37.8% Reduction (Target Exceeded)", y)
    y = draw_row("Data Consistency Check:", "PASSED", y)
    
    y -= 10

        # Section: Pilot Governance
    y = draw_section_header("SECTION 3: PILOT GOVERNANCE CONTROLS", y)
    y = draw_row("Data Privacy:", "Operational queue timestamps only; no patient clinical records or PII processed.", y)
    y = draw_row("IP Rights:", "Background IP retained by startup; pilot-specific government usage rights defined.", y)
    y = draw_row("Cybersecurity:", "Role-based access; preliminary deployment vulnerability check passed.", y)
    y = draw_row("Risk:", "Supervised hospital deployment with staff orientation sessions.", y)
    y -= 10

    # Section 4: Milestone & Payment Ledger
    y = draw_section_header("SECTION 4: MILESTONE & PAYMENT LEDGER", y)
    y = draw_row("M1: Deployment (25%)", "COMPLETED / RELEASED", y)
    y = draw_row("M2: Mid-Pilot Validation (25%)", "COMPLETED / RELEASED", y)
    y = draw_row("M3: Performance Target (25%)", "COMPLETED / PENDING", y)
    y = draw_row("M4: Independent Validation (25%)", "VERIFIED / LOCKED", y)
    
    y -= 10

    # Section 5: Recommended Procurement Transition
    y = draw_section_header("SECTION 5: RECOMMENDED PROCUREMENT TRANSITION", y)
    
    c.setFont("Helvetica", 10)
    c.setFillColor(colors.black)
    text = (
        "In this prototype demonstration, the simulated evidence package satisfies the predefined KPI rules and is prepared for Competent Authority Review to determine the applicable procurement pathway under prevailing public procurement rules."
    )
    import textwrap
    lines = textwrap.wrap(text, width=85)
    for line in lines:
        c.drawString(margin + 5, y, line)
        y -= 14
        
    y -= 40
    
    # Footer & Sign-off Block
    c.setFont("Helvetica-Bold", 9)
    sig_y = y - 40
    c.drawString(margin, sig_y, "___________________________")
    c.drawString(margin, sig_y - 15, "Prototype Role — Nodal Officer")
    
    c.drawString(margin + 175, sig_y, "___________________________")
    c.drawString(margin + 175, sig_y - 15, "Prototype Role — Department Representative")
    
    c.drawString(margin + 350, sig_y, "___________________________")
    c.drawString(margin + 350, sig_y - 15, "Prototype Role — Third-Party Validator")
    
    # Disclaimer
    c.setFillColor(colors.red)
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(width / 2.0, 30, "PROTOTYPE - SIMULATED DATA. THIS IS A HACKATHON DEMONSTRATION, NOT A GOVERNMENT DOCUMENT.")
    c.drawCentredString(width / 2.0, 18, "Final decisions subject to departmental authority.")
    
    c.save()
    buffer.seek(0)
    return buffer
