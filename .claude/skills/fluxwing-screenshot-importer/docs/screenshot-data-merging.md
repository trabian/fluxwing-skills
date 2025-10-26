# Screenshot Import Data Merging

This document provides helper functions for merging vision agent outputs into a unified data structure.

## Overview

After 3 vision agents complete (layout, components, visual properties), their outputs must be merged into a single enriched data structure suitable for component generation.

## Helper Functions

### 1. findSectionForComponent()

Determines which layout section contains a component:

```typescript
function findSectionForComponent(compLocation, layoutStructure) {
  // Match component location to layout sections
  for (const section of layoutStructure.sections) {
    if (compLocation.section === section.id) {
      return section;
    }
  }

  // Fallback to main section if no match
  return layoutStructure.sections.find(s => s.type === 'main');
}
```

### 2. categorizeComponents()

Splits components into atomic, composite, and screen categories:

```typescript
function categorizeComponents(components, screenType) {
  const atomicComponents = components
    .filter(c => c.category === "atomic")
    .map(c => c.id);

  const compositeComponents = components
    .filter(c => c.category === "composite")
    .map(c => c.id);

  return {
    atomicComponents,
    compositeComponents,
    screenComponents: [`${screenType}-screen`]
  };
}
```

### 3. generateScreenName()

Converts screen type to human-readable name:

```typescript
function generateScreenName(screenType) {
  const names = {
    "dashboard": "Dashboard",
    "login": "Login Screen",
    "form": "Form Screen",
    "list": "List View",
    "detail": "Detail View",
    "settings": "Settings",
    "profile": "Profile Page"
  };

  return names[screenType] || `${screenType.charAt(0).toUpperCase()}${screenType.slice(1)} Screen`;
}
```

### 4. generateScreenDescription()

Creates screen description from type and layout:

```typescript
function generateScreenDescription(screenType, layoutStructure) {
  const sectionNames = layoutStructure.sections.map(s => s.type).join(", ");
  return `${generateScreenName(screenType)} with ${sectionNames} sections`;
}
```

### 5. enrichComponentWithVisualProps()

Merges component data with visual properties (with defaults):

```typescript
function enrichComponentWithVisualProps(comp, visualResult) {
  const visualProps = visualResult.visualProperties[comp.id] || {
    dimensions: {
      width: comp.location.position.width,
      height: comp.location.position.height,
      unit: "characters"
    },
    borderStyle: "light",
    fillPattern: "transparent",
    textAlignment: "left",
    spacing: { padding: "normal", margin: "normal" }
  };

  return {
    width: visualProps.dimensions?.width || comp.location.position.width,
    height: visualProps.dimensions?.height || comp.location.position.height,
    borderStyle: visualProps.borderStyle || "light",
    fillPattern: visualProps.fillPattern || "transparent",
    textAlignment: visualProps.textAlignment || "left",
    textContent: comp.textContent,
    placeholder: comp.placeholder || ""
  };
}
```

## Complete Merging Workflow

```typescript
function mergeAgentResults(layoutResult, componentResult, visualResult) {
  const mergedData = {
    screen: {
      type: layoutResult.screenType,
      name: generateScreenName(layoutResult.screenType),
      description: generateScreenDescription(layoutResult.screenType, layoutResult.layoutStructure),
      layout: layoutResult.layoutStructure.type
    },
    components: componentResult.components.map(comp => {
      // Find which section contains this component
      const section = findSectionForComponent(comp.location, layoutResult.layoutStructure);

      // Enrich with visual properties
      const visualProperties = enrichComponentWithVisualProps(comp, visualResult);

      return {
        id: comp.id,
        type: comp.type,
        category: comp.category,
        section: section?.id || "main",
        visualProperties,
        states: comp.states || ["default"],
        accessibility: comp.accessibility,
        location: comp.location // preserve original location data
      };
    }),
    composition: categorizeComponents(componentResult.components, layoutResult.screenType),
    layoutHierarchy: layoutResult.hierarchy
  };

  return mergedData;
}
```

## Usage Example

```typescript
// After all 3 vision agents complete
const layoutResult = await layoutAgent();
const componentResult = await componentAgent();
const visualResult = await visualAgent();

// Merge their outputs
const mergedData = mergeAgentResults(layoutResult, componentResult, visualResult);

// mergedData is now ready for component generation
console.log(`Merged ${mergedData.components.length} components for ${mergedData.screen.type} screen`);
```

## Output Structure

The merged data structure:

```typescript
{
  screen: {
    type: "dashboard",
    name: "Dashboard",
    description: "Dashboard with header, main sections",
    layout: "fixed-header-sidebar"
  },
  components: [
    {
      id: "email-input",
      type: "input",
      category: "atomic",
      section: "main",
      visualProperties: {
        width: 40,
        height: 3,
        borderStyle: "light",
        fillPattern: "transparent",
        textAlignment: "left",
        textContent: "Email",
        placeholder: "Enter your email"
      },
      states: ["default", "focus", "error"],
      accessibility: {
        role: "textbox",
        label: "Email address"
      },
      location: { /* original location data */ }
    }
  ],
  composition: {
    atomicComponents: ["email-input", "password-input"],
    compositeComponents: ["login-form"],
    screenComponents: ["dashboard-screen"]
  },
  layoutHierarchy: {
    root: "screen",
    children: {
      header: ["logo", "navigation"],
      main: ["login-form"]
    }
  }
}
```
