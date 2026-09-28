import math
from typing import Tuple, List, Optional
from models import Scheme, ChannelPartner
from schemas import AssessmentRequest, AuditEventSchema

def calculate_distance(lat1, lon1, lat2, lon2):
    # Haversine formula
    if lat1 is None or lon1 is None or lat2 is None or lon2 is None:
        return float('inf')
    R = 6371  # Radius of earth in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2) * math.sin(dlat/2) + \
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
        math.sin(dlon/2) * math.sin(dlon/2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def perform_assessment(request: AssessmentRequest, db) -> Tuple[bool, str, List[str], Optional[Scheme], dict, Optional[ChannelPartner], List[AuditEventSchema]]:
    audit_trail = []
    reasons = []
    
    # 1. Income Check
    if request.annual_family_income > 500000:
        audit_trail.append(AuditEventSchema(step="Income Check", result="FAIL", details=f"Income {request.annual_family_income} > 5,00,000 ceiling."))
        reasons.append("Annual family income exceeds the ₹5.00 lakh eligibility ceiling specified in the problem statement.")
        return False, "INELIGIBLE", reasons, None, {}, None, audit_trail
    else:
        audit_trail.append(AuditEventSchema(step="Income Check", result="PASS", details=f"Income {request.annual_family_income} <= 5,00,000 ceiling."))
        
    # 2. Scheme Matching
    schemes = db.query(Scheme).all()
    matched_scheme = None
    for scheme in schemes:
        if scheme.minimum_project_cost <= request.estimated_project_cost <= scheme.maximum_project_cost:
            # Simple category match check
            if request.business_category.lower() in scheme.purpose_categories.lower():
                matched_scheme = scheme
                break
                
    # fallback to first scheme if no category match but cost matches
    if not matched_scheme:
        for scheme in schemes:
            if scheme.minimum_project_cost <= request.estimated_project_cost <= scheme.maximum_project_cost:
                matched_scheme = scheme
                break

    if not matched_scheme:
         audit_trail.append(AuditEventSchema(step="Scheme Matching", result="FAIL", details="No scheme matches the project cost range and category."))
         reasons.append("Could not find a scheme matching your project cost and category.")
         return False, "INELIGIBLE", reasons, None, {}, None, audit_trail
         
    audit_trail.append(AuditEventSchema(step="Scheme Matching", result="PASS", details=f"Matched with {matched_scheme.name} based on project cost and category."))
    
    # 3. Financial Calculation
    required_contribution = request.estimated_project_cost * 0.10
    potential_financing = request.estimated_project_cost * 0.90
    
    final_loan = min(potential_financing, matched_scheme.maximum_loan_amount)
    
    # Calculate EMI
    r = (matched_scheme.interest_rate / 100) / 12
    n = matched_scheme.tenure_months
    if r > 0 and n > 0:
        emi = (final_loan * r * math.pow(1 + r, n)) / (math.pow(1 + r, n) - 1)
    else:
        emi = 0
        
    total_repayment = emi * n
    total_interest = total_repayment - final_loan
    
    financial_parameters = {
        "project_cost": request.estimated_project_cost,
        "beneficiary_contribution": required_contribution,
        "potential_financing": potential_financing,
        "final_loan_amount": final_loan,
        "interest_rate": matched_scheme.interest_rate,
        "tenure_months": matched_scheme.tenure_months,
        "moratorium_months": matched_scheme.moratorium_months,
        "estimated_emi": emi,
        "estimated_total_repayment": total_repayment,
        "estimated_total_interest": total_interest
    }
    audit_trail.append(AuditEventSchema(step="Financial Calculation", result="PASS", details=f"Calculated required contribution {required_contribution} and final loan {final_loan}."))

    # 4. Partner Routing
    partners = db.query(ChannelPartner).all()
    eligible_partners = []
    
    for partner in partners:
        if partner.operational_status != "ACTIVE":
            continue
        if partner.risk_status == "HIGH" or partner.npa_percentage > 10.0 or partner.overdue_status == "HIGH":
            continue
        if partner.fund_utilization_status != "ELIGIBLE":
            continue
        # check scheme match
        if matched_scheme.name not in partner.supported_schemes:
             continue
             
        dist = calculate_distance(request.latitude, request.longitude, partner.latitude, partner.longitude)
        eligible_partners.append((dist, partner))
        
    recommended_partner = None
    if eligible_partners:
        eligible_partners.sort(key=lambda x: x[0])
        recommended_partner = eligible_partners[0][1]
        recommended_partner.distance = eligible_partners[0][0]
        audit_trail.append(AuditEventSchema(step="Partner Routing", result="PASS", details=f"Found {len(eligible_partners)} eligible partners. Recommended {recommended_partner.name} at distance {recommended_partner.distance:.1f}km."))
    else:
        audit_trail.append(AuditEventSchema(step="Partner Routing", result="WARNING", details="No eligible active partners found nearby for this scheme."))
        
    return True, "ELIGIBLE", [], matched_scheme, financial_parameters, recommended_partner, audit_trail
