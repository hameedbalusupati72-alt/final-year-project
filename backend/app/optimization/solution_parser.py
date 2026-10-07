"""Validation and description helpers for structural planning results."""


def parse_partition_solution(solution: dict) -> dict:
    """Validate a planner result's scope and return it unchanged."""
    if solution.get("status") != "structural_partition_plan":
        raise ValueError("Expected a structural partition plan result.")
    if not isinstance(solution.get("partitions"), list):
        raise ValueError("Partition plan is missing its partitions list.")
    if not isinstance(solution.get("cut_edges"), list):
        raise ValueError("Partition plan is missing its cut_edges list.")
    return solution
