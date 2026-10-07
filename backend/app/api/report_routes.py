"""Routes for generating text reports from computed project results."""

from fastapi import APIRouter, Response

from app.schemas.report_schema import ReportRequest
from app.services.report_service import create_pdf_report, create_report

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.post("/generate")
def generate(request: ReportRequest) -> dict[str, str]:
    """Render a readable report from supplied analysis and workflow results."""
    report = create_report(request.title, request.sections)
    return {"status": "completed", "title": request.title, "report": report}


@router.post("/pdf", response_class=Response)
def generate_pdf(request: ReportRequest) -> Response:
    """Download a PDF report rendered from the supplied result sections."""
    pdf = create_pdf_report(request.title, request.sections)
    return Response(
        content=pdf,
        media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="qpart-report.pdf"'},
    )
