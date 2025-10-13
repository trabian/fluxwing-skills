# Screenshot Import Validation Functions

This document provides validation function implementations for verifying generated uxscii components during screenshot import.

## Overview

Five validation checks run concurrently for each component:

1. **validateSchema()** - Check against JSON Schema
2. **validateFileIntegrity()** - Check template file exists and matches
3. **validateVariableConsistency()** - Check variables are defined and used
4. **validateComponentReferences()** - Check referenced components exist
5. **validateBestPractices()** - Check quality standards (warnings only)

## Validation Function Implementations

### 1. validateSchema()

Check against JSON Schema:

```typescript
async function validateSchema(uxmPath) {
  const schemaPath = '{PLUGIN_ROOT}/data/schema/uxm-component.schema.json';
  const schema = JSON.parse(await read(schemaPath));
  const uxmData = JSON.parse(await read(uxmPath));

  const errors = [];

  // Required fields
  if (!uxmData.id || !uxmData.type || !uxmData.version || !uxmData.metadata) {
    errors.push("Missing required top-level fields");
  }

  // ID format
  if (uxmData.id && !uxmData.id.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)) {
    errors.push(`Invalid ID format: ${uxmData.id}`);
  }

  // Version format
  if (uxmData.version && !uxmData.version.match(/^\d+\.\d+\.\d+$/)) {
    errors.push(`Invalid version format: ${uxmData.version}`);
  }

  if (errors.length > 0) {
    throw new Error(`Schema validation errors: ${errors.join(', ')}`);
  }

  return { passed: true, message: "Schema compliance verified" };
}
```

### 2. validateFileIntegrity()

Check template file exists and matches:

```typescript
async function validateFileIntegrity(uxmPath, mdPath) {
  const uxmData = JSON.parse(await read(uxmPath));
  const expectedTemplateName = uxmData.ascii.templateFile;

  // Check .md file exists
  try {
    await read(mdPath);
  } catch (error) {
    throw new Error(`Template file missing: ${mdPath}`);
  }

  // Check filename matches reference
  const actualFileName = mdPath.split('/').pop();
  if (expectedTemplateName !== actualFileName) {
    throw new Error(`Template filename mismatch: expected ${expectedTemplateName}, got ${actualFileName}`);
  }

  return { passed: true, message: "File integrity verified" };
}
```

### 3. validateVariableConsistency()

Check variables are defined and used:

```typescript
async function validateVariableConsistency(uxmPath, mdPath) {
  const uxmData = JSON.parse(await read(uxmPath));
  const mdContent = await read(mdPath);

  // Extract defined variables from .uxm
  const definedVariables = uxmData.ascii?.variables ? uxmData.ascii.variables.map(v => v.name) : [];

  // Extract used variables from .md (matches {{variableName}} but NOT {{component:id}})
  const usedVariables = [...mdContent.matchAll(/\{\{(?!component:)(\w+)\}\}/g)].map(m => m[1]);

  // Check all used variables are defined
  const undefinedVars = usedVariables.filter(v => !definedVariables.includes(v));
  if (undefinedVars.length > 0) {
    throw new Error(`Undefined variables in template: ${undefinedVars.join(', ')}`);
  }

  // Warn about unused variables (non-blocking)
  const unusedVars = definedVariables.filter(v => !usedVariables.includes(v));
  if (unusedVars.length > 0) {
    console.warn(`⚠️  Unused variables defined in ${uxmPath}: ${unusedVars.join(', ')}`);
  }

  return { passed: true, message: "Variable consistency verified", warnings: unusedVars.length };
}
```

### 4. validateComponentReferences()

Check referenced components exist:

```typescript
async function validateComponentReferences(uxmPath) {
  const uxmData = JSON.parse(await read(uxmPath));

  // Check if component has child references
  if (!uxmData.props.components || uxmData.props.components.length === 0) {
    return { passed: true, message: "No component references to validate" };
  }

  // Check each referenced component exists
  for (const ref of uxmData.props.components) {
    const refPath = `./fluxwing/components/${ref.id}.uxm`;
    try {
      await read(refPath);
    } catch (error) {
      throw new Error(`Referenced component not found: ${ref.id} (expected at ${refPath})`);
    }
  }

  return { passed: true, message: `${uxmData.props.components.length} component references verified` };
}
```

### 5. validateBestPractices()

Check quality standards (warnings only):

```typescript
async function validateBestPractices(uxmPath) {
  const uxmData = JSON.parse(await read(uxmPath));
  const warnings = [];

  // Check multiple states
  if (uxmData.behavior?.states && uxmData.behavior.states.length < 3) {
    warnings.push("Consider adding more states (recommended: 3+)");
  }

  // Check accessibility
  if (!uxmData.behavior?.accessibility?.ariaLabel) {
    warnings.push("Missing ARIA label for accessibility");
  }

  // Check description
  if (!uxmData.metadata.description || uxmData.metadata.description.length < 10) {
    warnings.push("Description is too brief");
  }

  // Check tags
  if (!uxmData.metadata.tags || uxmData.metadata.tags.length < 2) {
    warnings.push("Add more tags for discoverability");
  }

  if (warnings.length > 0) {
    console.warn(`⚠️  Best practices warnings for ${uxmData.id}:\n  - ${warnings.join('\n  - ')}`);
  }

  return { passed: true, warnings: warnings.length, messages: warnings };
}
```

## Usage Pattern

Run all 5 validations concurrently for each component:

```typescript
const validationResults = await Promise.all(
  allFiles.map(async (fileSet) => {
    const { uxmPath, mdPath, id } = fileSet;

    try {
      const [
        schemaResult,
        integrityResult,
        variableResult,
        referenceResult,
        practicesResult
      ] = await Promise.all([
        validateSchema(uxmPath),
        validateFileIntegrity(uxmPath, mdPath),
        validateVariableConsistency(uxmPath, mdPath),
        validateComponentReferences(uxmPath),
        validateBestPractices(uxmPath)
      ]);

      return {
        componentId: id,
        success: true,
        checks: {
          schema: schemaResult,
          integrity: integrityResult,
          variables: variableResult,
          references: referenceResult,
          practices: practicesResult
        }
      };

    } catch (error) {
      throw new Error(`Validation failed for ${id}: ${error.message}`);
    }
  })
);
```

## Error Handling

- **Schema, Integrity, Variables, References**: Fail-fast (throw errors)
- **Best Practices**: Non-blocking (warnings only)
- Always provide component ID in error messages
- Collect all warnings for summary report
