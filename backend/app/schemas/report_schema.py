"""Request schema for rendering a report from available project results."""

from pydantic import BaseModel, Field, field_validator


class ReportRequest(BaseModel):
    """User-supplied report title and result sections."""

    title: str = Field(default="Quantum circuit analysis report", max_length=200)
    sections: dict[str, object] = Field(min_length=1)

    @field_validator("title")
    @classmethod
    def title_must_not_be_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Report title must not be blank.")
        return value.strip()

    @field_validator("sections")
    @classmethod
    def section_names_must_not_be_blank(
        cls, value: dict[str, object]
    ) -> dict[str, object]:
        if any(not name.strip() for name in value):
            raise ValueError("Report section names must not be blank.")
        return value
