#!/usr/bin/env python3
"""
Build searchable index of all component templates.
Run this when templates are added/updated.

Usage:
    python build_index.py [templates_dir] [output_file]

Defaults:
    templates_dir: ../uxscii-component-creator/templates/
    output_file: ../data/template-index.json
"""

import json
import re
import sys
from pathlib import Path
from datetime import datetime


def extract_preview(md_file: Path, max_lines: int = 5) -> str:
    """Extract ASCII preview from .md file."""
    if not md_file.exists():
        return ""

    content = md_file.read_text()

    # Find first code block after "## Default State"
    match = re.search(r'## Default State.*?```(.*?)```', content, re.DOTALL)
    if match:
        lines = match.group(1).strip().split('\n')
        return '\n'.join(lines[:max_lines])

    # Fallback: find any code block
    match = re.search(r'```(.*?)```', content, re.DOTALL)
    if match:
        lines = match.group(1).strip().split('\n')
        return '\n'.join(lines[:max_lines])

    return ""


def infer_tags(component: dict) -> list:
    """Infer searchable tags from component."""
    tags = [component["type"]]

    # Add interactivity tags
    if component.get("behavior", {}).get("interactive"):
        tags.append("interactive")

    # Add form-related tags
    if component["type"] in ["input", "button", "form", "checkbox", "radio", "select"]:
        tags.append("form")

    # Add navigation tags
    if component["type"] in ["navigation", "breadcrumb", "pagination", "tabs"]:
        tags.append("navigation")

    # Add container tags
    if component["type"] in ["card", "modal", "panel", "container"]:
        tags.append("container")

    # Add from component metadata tags
    if "tags" in component.get("metadata", {}):
        tags.extend(component["metadata"]["tags"])

    return list(set(tags))  # Remove duplicates


def build_index(templates_dir: Path, output_file: Path):
    """Build index from all .uxm files in directory."""
    index = {
        "version": "1.0.0",
        "generated": datetime.utcnow().isoformat() + "Z",
        "template_count": 0,
        "bundled_templates": [],
        "by_type": {},
        "by_tag": {}
    }

    uxm_files = sorted(templates_dir.glob("*.uxm"))

    if not uxm_files:
        print(f"⚠ Warning: No .uxm files found in {templates_dir}")
        return

    for uxm_file in uxm_files:
        try:
            with open(uxm_file) as f:
                component = json.load(f)

            md_file = uxm_file.with_suffix('.md')
            preview = extract_preview(md_file)

            # Get states
            states = component.get("behavior", {}).get("states", [])
            state_names = [s["name"] if isinstance(s, dict) else s for s in states]

            # Extract metadata
            template_info = {
                "id": component["id"],
                "type": component["type"],
                "name": component["metadata"]["name"],
                "description": component["metadata"].get("description", ""),
                "file": f"{{SKILL_ROOT}}/../uxscii-component-creator/templates/{uxm_file.name}",
                "md_file": f"{{SKILL_ROOT}}/../uxscii-component-creator/templates/{md_file.name}",
                "states": state_names,
                "props": list(component.get("props", {}).keys()),
                "tags": infer_tags(component),
                "preview": preview,
                "interactive": component.get("behavior", {}).get("interactive", False),
                "has_accessibility": bool(component.get("accessibility"))
            }

            index["bundled_templates"].append(template_info)

            # Index by type
            comp_type = component["type"]
            if comp_type not in index["by_type"]:
                index["by_type"][comp_type] = []
            index["by_type"][comp_type].append(component["id"])

            # Index by tags
            for tag in template_info["tags"]:
                if tag not in index["by_tag"]:
                    index["by_tag"][tag] = []
                index["by_tag"][tag].append(component["id"])

        except Exception as e:
            print(f"✗ Error processing {uxm_file.name}: {e}")
            continue

    index["template_count"] = len(index["bundled_templates"])

    # Write index
    output_file.parent.mkdir(parents=True, exist_ok=True)
    with open(output_file, 'w') as f:
        json.dump(index, f, indent=2)

    print(f"✓ Built index with {index['template_count']} templates")
    print(f"  Types: {len(index['by_type'])} ({', '.join(sorted(index['by_type'].keys()))})")
    print(f"  Tags: {len(index['by_tag'])} ({', '.join(sorted(index['by_tag'].keys()))})")
    print(f"  Output: {output_file}")


def main():
    # Determine paths
    script_dir = Path(__file__).parent

    if len(sys.argv) >= 2:
        templates_dir = Path(sys.argv[1])
    else:
        templates_dir = script_dir.parent / "../uxscii-component-creator/templates"

    if len(sys.argv) >= 3:
        output_file = Path(sys.argv[2])
    else:
        output_file = script_dir.parent / "data/template-index.json"

    templates_dir = templates_dir.resolve()
    output_file = output_file.resolve()

    if not templates_dir.exists():
        print(f"✗ Error: Templates directory not found: {templates_dir}")
        sys.exit(1)

    print(f"Building index from: {templates_dir}")
    build_index(templates_dir, output_file)


if __name__ == "__main__":
    main()
