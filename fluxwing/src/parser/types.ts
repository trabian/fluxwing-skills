/**
 * Shared types for component parsing
 */

/**
 * A component definition with default template and optional state variants
 */
export interface ComponentDefinition {
  /** Default template (no state) */
  default: string;
  /** State-specific templates (hover, focus, disabled, active, error, etc.) */
  states: Record<string, string>;
}

/**
 * Result of parsing inline component definitions from input
 */
export interface ParsedInput {
  /** The remaining JSX after removing component block */
  jsx: string;
  /** Parsed component definitions */
  components: Record<string, ComponentDefinition>;
}

/**
 * Result of parsing a single component definition line
 */
export interface ParsedComponentLine {
  /** Component name */
  name: string;
  /** State name (undefined for default) */
  state?: string;
  /** JSX template */
  template: string;
}
