# Screenshot Import Screen Generation

This document provides helper functions for generating screen files (.uxm, .md, .rendered.md) during screenshot import.

## Overview

Screen generation creates 3 files:
1. **`.uxm`** - Screen metadata and component references
2. **`.md`** - Template with `{{component:id}}` references
3. **`.rendered.md`** - Actual ASCII preview with real data

## Step 1: Generate Screen Metadata (.uxm)

```typescript
function generateScreenUxm(mergedData) {
  const screenId = `${mergedData.screen.type}-screen`;
  const screenName = mergedData.screen.name;
  const screenDescription = mergedData.screen.description;
  const allComponentIds = [
    ...mergedData.composition.atomicComponents,
    ...mergedData.composition.compositeComponents
  ];

  return {
    "id": screenId,
    "type": "container",
    "version": "1.0.0",
    "metadata": {
      "name": screenName,
      "description": screenDescription,
      "author": "Fluxwing Screenshot Import",
      "created": new Date().toISOString(),
      "modified": new Date().toISOString(),
      "tags": ["screen", mergedData.screen.type, "imported"],
      "category": "layout"
    },
    "props": {
      "title": screenName,
      "layout": mergedData.screen.layout,
      "components": allComponentIds
    },
    "ascii": {
      "templateFile": `${screenId}.md`,
      "width": 80,
      "height": 40
    }
  };
}
```

## Step 2: Generate Screen Template (.md)

```typescript
function generateScreenTemplate(screenId, screenName, description, components, mergedData) {
  let markdown = `# ${screenName}\n\n${description}\n\n`;

  markdown += `## Layout\n\n\`\`\`\n`;

  // Reference all components
  for (const compId of components) {
    markdown += `{{component:${compId}}}\n\n`;
  }

  markdown += '\`\`\`\n\n';

  markdown += `## Components Used\n\n`;
  for (const compId of components) {
    const comp = mergedData.components.find(c => c.id === compId);
    const compName = comp ? generateComponentName(compId) : compId;
    markdown += `- \`${compId}\` - ${compName} (${comp?.type || 'unknown'})\n`;
  }

  return markdown;
}

// Helper: Convert kebab-case ID to Title Case name
function generateComponentName(id) {
  return id.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}
```

## Step 3: Generate Rendered Screen (.rendered.md)

**CRITICAL:** Embed actual ASCII from component files, NOT `{{variables}}`

```typescript
async function generateScreenRendered(screenId, screenName, description, mergedData) {
  let markdown = `# ${screenName}\n\n`;

  markdown += `## Rendered Example\n\n\`\`\`\n`;

  // Build complete rendered layout
  // Stack all components vertically (user can refine layout)
  const allComponentIds = [
    ...mergedData.composition.atomicComponents,
    ...mergedData.composition.compositeComponents
  ];

  for (const compId of allComponentIds) {
    // Read component .md file
    const compMdPath = `./fluxwing/components/${compId}.md`;
    try {
      const compMdContent = await read(compMdPath);

      // Extract default state ASCII (between first ``` pair after "## Default State")
      const asciiMatch = compMdContent.match(/## Default State\n\n```\n([\s\S]*?)\n```/);
      if (asciiMatch) {
        markdown += asciiMatch[1] + '\n\n';
      } else {
        markdown += `[Component ${compId} - ASCII not found]\n\n`;
      }
    } catch (error) {
      markdown += `[Component ${compId} - File not found]\n\n`;
    }
  }

  markdown += '\`\`\`\n\n';

  // Add example data section
  markdown += `**Example Data:**\n`;
  const exampleData = generateExampleData(mergedData.screen.type);
  for (const [key, value] of Object.entries(exampleData)) {
    markdown += `- ${key}: ${value}\n`;
  }

  return markdown;
}
```

## Step 4: Generate Example Data by Screen Type

```typescript
function generateExampleData(screenType) {
  const examples = {
    "login": {
      "Email": "john.doe@example.com",
      "Password": "••••••••",
      "Button": "Sign In"
    },
    "dashboard": {
      "Revenue": "$24,567",
      "Users": "1,234",
      "Growth": "+12.5%"
    },
    "profile": {
      "Name": "Jane Smith",
      "Role": "Product Manager",
      "Email": "jane.smith@company.com"
    },
    "settings": {
      "Theme": "Dark Mode",
      "Language": "English",
      "Notifications": "Enabled"
    },
    "form": {
      "Field 1": "Example value",
      "Field 2": "Another value"
    }
  };

  return examples[screenType] || examples["form"];
}
```

## Step 5: Write All Files Concurrently

```typescript
async function writeScreenFiles(screenId, screenUxm, screenMd, screenRendered) {
  // Create screens directory
  await bash('mkdir -p ./fluxwing/screens');

  const screenDir = './fluxwing/screens';
  const uxmPath = `${screenDir}/${screenId}.uxm`;
  const mdPath = `${screenDir}/${screenId}.md`;
  const renderedPath = `${screenDir}/${screenId}.rendered.md`;

  // Write all 3 files concurrently
  await Promise.all([
    write(uxmPath, JSON.stringify(screenUxm, null, 2)),
    write(mdPath, screenMd),
    write(renderedPath, screenRendered)
  ]);

  return { uxmPath, mdPath, renderedPath };
}
```

## Complete Workflow

```typescript
async function generateScreen(mergedData) {
  const screenId = `${mergedData.screen.type}-screen`;
  const allComponentIds = [
    ...mergedData.composition.atomicComponents,
    ...mergedData.composition.compositeComponents
  ];

  // Generate all content
  const screenUxm = generateScreenUxm(mergedData);
  const screenMd = generateScreenTemplate(
    screenId,
    mergedData.screen.name,
    mergedData.screen.description,
    allComponentIds,
    mergedData
  );
  const screenRendered = await generateScreenRendered(
    screenId,
    mergedData.screen.name,
    mergedData.screen.description,
    mergedData
  );

  // Write all files
  const paths = await writeScreenFiles(screenId, screenUxm, screenMd, screenRendered);

  console.log(`✓ Created: ${paths.uxmPath}`);
  console.log(`✓ Created: ${paths.mdPath}`);
  console.log(`✓ Created: ${paths.renderedPath}`);

  return { screenId, ...paths };
}
```

## Usage

```typescript
try {
  const screenResult = await generateScreen(mergedData);
  console.log(`✅ Screen generated with ${allComponentIds.length} components`);
} catch (error) {
  console.error(`❌ Failed to generate screen: ${error.message}`);
  throw error;
}
```
