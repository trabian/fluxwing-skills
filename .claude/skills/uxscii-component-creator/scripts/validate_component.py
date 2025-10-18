#!/usr/bin/env python3
"""
Fast, deterministic component validation using JSON Schema.
Replaces the removed fluxwing-validator agent with reliable script.

Usage:
    python validate_component.py <component.uxm> <schema.json>

Returns:
    Exit 0 if valid, Exit 1 if errors found
    JSON output with validation results
"""

import json
import sys
import re
from pathlib import Path

try:
    from jsonschema import validate, ValidationError, Draft7Validator
except ImportError:
    print("Error: jsonschema library not found. Install with: pip install jsonschema")
    sys.exit(2)


def validate_component(uxm_file_path: str, schema_path: str) -> dict:
    """
    Validate a .uxm component file against the schema.

    Returns:
        {
            "valid": bool,
            "errors": [list of error messages],
            "warnings": [list of warnings],
            "stats": {component stats}
        }
    """
    # Load component
    try:
        with open(uxm_file_path) as f:
            component = json.load(f)
    except json.JSONDecodeError as e:
        return {
            "valid": False,
            "errors": [{
                "path": [],
                "message": f"Invalid JSON: {e.msg} at line {e.lineno}",
                "type": "json_error"
            }],
            "warnings": [],
            "stats": {}
        }
    except FileNotFoundError:
        return {
            "valid": False,
            "errors": [{
                "path": [],
                "message": f"Component file not found: {uxm_file_path}",
                "type": "file_not_found"
            }],
            "warnings": [],
            "stats": {}
        }

    # Load schema
    try:
        with open(schema_path) as f:
            schema = json.load(f)
    except FileNotFoundError:
        return {
            "valid": False,
            "errors": [{
                "path": [],
                "message": f"Schema file not found: {schema_path}",
                "type": "file_not_found"
            }],
            "warnings": [],
            "stats": {}
        }

    # Validate against schema
    validator = Draft7Validator(schema)
    errors = []

    for error in validator.iter_errors(component):
        errors.append({
            "path": list(error.path),
            "message": error.message,
            "type": "schema_violation"
        })

    # Additional uxscii-specific checks
    warnings = []

    # Check 1: ASCII file exists
    md_file = uxm_file_path.replace('.uxm', '.md')
    if not Path(md_file).exists():
        errors.append({
            "path": ["ascii", "templateFile"],
            "message": f"ASCII template file not found: {md_file}",
            "type": "missing_file"
        })
    else:
        # Check 2: Template variables match
        with open(md_file) as f:
            md_content = f.read()

        # Extract {{variables}} from markdown
        md_vars = set(re.findall(r'\{\{(\w+)\}\}', md_content))

        # Get variables from .uxm (handle both formats: array of strings or array of objects)
        ascii_vars = component.get('ascii', {}).get('variables', [])
        if ascii_vars and isinstance(ascii_vars[0], dict):
            # Array of objects format: [{"name": "text", "type": "string"}]
            uxm_vars = {v['name'] for v in ascii_vars if isinstance(v, dict) and 'name' in v}
        else:
            # Array of strings format: ["text", "value"]
            uxm_vars = set(ascii_vars)

        missing = md_vars - uxm_vars
        if missing:
            warnings.append({
                "path": ["ascii", "variables"],
                "message": f"Variables in .md but not defined in .uxm: {', '.join(sorted(missing))}",
                "type": "variable_mismatch"
            })

    # Check 3: Accessibility requirements
    if component.get('behavior', {}).get('interactive'):
        accessibility = component.get('accessibility', {})
        if not accessibility.get('role'):
            warnings.append({
                "path": ["accessibility", "role"],
                "message": "Interactive component should have ARIA role",
                "type": "accessibility"
            })
        if not accessibility.get('focusable'):
            warnings.append({
                "path": ["accessibility", "focusable"],
                "message": "Interactive component should be focusable",
                "type": "accessibility"
            })

    # Check 4: ASCII dimensions
    ascii_config = component.get('ascii', {})
    width = ascii_config.get('width', 0)
    height = ascii_config.get('height', 0)

    if width > 120:
        warnings.append({
            "path": ["ascii", "width"],
            "message": f"Width {width} exceeds recommended max of 120",
            "type": "dimensions"
        })

    if height > 50:
        warnings.append({
            "path": ["ascii", "height"],
            "message": f"Height {height} exceeds recommended max of 50",
            "type": "dimensions"
        })

    # Check 5: States should have properties
    states = component.get('behavior', {}).get('states', [])
    for state in states:
        if 'properties' not in state:
            warnings.append({
                "path": ["behavior", "states", state.get('name', 'unknown')],
                "message": f"State '{state.get('name')}' has no properties defined",
                "type": "incomplete_state"
            })

    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "warnings": warnings,
        "stats": {
            "id": component.get('id'),
            "type": component.get('type'),
            "version": component.get('version'),
            "states": len(component.get('behavior', {}).get('states', [])),
            "props": len(component.get('props', {})),
            "interactive": component.get('behavior', {}).get('interactive', False),
            "has_accessibility": bool(component.get('accessibility'))
        }
    }


def main():
    if len(sys.argv) < 3:
        print("Usage: validate_component.py <component.uxm> <schema.json>")
        print()
        print("Validates a uxscii component against the JSON schema.")
        print("Returns JSON with validation results and exits 0 if valid, 1 if invalid.")
        sys.exit(1)

    uxm_file = sys.argv[1]
    schema_file = sys.argv[2]

    result = validate_component(uxm_file, schema_file)
    print(json.dumps(result, indent=2))

    sys.exit(0 if result["valid"] else 1)


if __name__ == "__main__":
    main()
