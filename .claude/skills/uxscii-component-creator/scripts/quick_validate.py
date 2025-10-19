#!/usr/bin/env python3
"""
Quick validation wrapper for component creation workflow.
Returns simple pass/fail + actionable error messages.

Usage:
    python quick_validate.py <component.uxm> <schema.json>

Returns:
    Exit 0 if valid, Exit 1 if errors found
    Human-friendly output for Claude to read
"""

import json
import sys
from pathlib import Path

try:
    from jsonschema import validate, ValidationError, Draft7Validator
except ImportError:
    print("✗ Error: jsonschema library not found")
    print("  Install with: pip install jsonschema")
    sys.exit(2)


def quick_validate(uxm_file: str, schema_file: str) -> None:
    """Validate and print result in Claude-friendly format."""
    try:
        # Load component
        with open(uxm_file) as f:
            component = json.load(f)

        # Load schema
        with open(schema_file) as f:
            schema = json.load(f)

        # Validate against schema
        validator = Draft7Validator(schema)
        errors = list(validator.iter_errors(component))

        if errors:
            # Schema validation failed
            print(f"✗ Validation Failed: {uxm_file}")
            print()
            for i, error in enumerate(errors[:3], 1):  # Show first 3 errors
                path = " → ".join(map(str, error.path)) if error.path else "root"
                print(f"  Error {i}: {error.message}")
                print(f"  Location: {path}")
                print()
            if len(errors) > 3:
                print(f"  ... and {len(errors) - 3} more errors")
            sys.exit(1)

        # Schema validation passed - check for .md file
        md_file = uxm_file.replace('.uxm', '.md')
        if not Path(md_file).exists():
            print(f"✗ Missing ASCII File: {md_file}")
            print(f"  Component .uxm is valid, but .md template file not found")
            sys.exit(1)

        # Success!
        comp_name = component['metadata']['name']
        comp_id = component['id']
        comp_type = component['type']
        state_count = len(component.get('behavior', {}).get('states', []))
        prop_count = len(component.get('props', {}))

        print(f"✓ Valid: {comp_name} ({comp_id})")
        print(f"  Type: {comp_type}")
        print(f"  States: {state_count}")
        print(f"  Props: {prop_count}")
        print(f"  Files: {uxm_file} + {Path(md_file).name}")

        sys.exit(0)

    except json.JSONDecodeError as e:
        print(f"✗ Invalid JSON: {uxm_file}")
        print(f"  Error: {e.msg} at line {e.lineno}, column {e.colno}")
        sys.exit(1)

    except FileNotFoundError as e:
        print(f"✗ File Not Found: {e.filename}")
        sys.exit(1)

    except Exception as e:
        print(f"✗ Unexpected Error: {e}")
        sys.exit(1)


def main():
    if len(sys.argv) != 3:
        print("Usage: quick_validate.py <component.uxm> <schema.json>")
        print()
        print("Quickly validates a uxscii component for use in workflows.")
        sys.exit(1)

    quick_validate(sys.argv[1], sys.argv[2])


if __name__ == "__main__":
    main()
