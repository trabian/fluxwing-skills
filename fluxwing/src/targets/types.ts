/**
 * Shared types for code generation targets
 */

/**
 * Defines how a Fluxwing component maps to target output
 */
export interface ComponentMapping {
  /** Target HTML/output tag */
  tag: string;
  /** Base classes always applied */
  baseClasses: string;
  /** Classes applied based on variant prop */
  variantClasses?: Record<string, string>;
  /** Props mapped directly to HTML attributes */
  propsToAttrs?: Record<string, string>;
  /** Props mapped to classes based on value */
  propsToClasses?: Record<string, Record<string, string>>;
  /** Optional wrapper element tag */
  wrapperTag?: string;
  /** Classes for wrapper element */
  wrapperClasses?: string;
  /** Optional wrapper for children */
  childrenWrapper?: { tag: string; classes: string };
  /** Custom transform function for complex components */
  transform?: (props: Record<string, any>, children: string) => string;
}

/**
 * A complete set of component mappings for a target
 */
export type ComponentMappings = Record<string, ComponentMapping>;

/**
 * Interface for a code generation target
 */
export interface GeneratorTarget {
  /** Target identifier (e.g., 'react-tailwind') */
  name: string;
  /** Human-readable description */
  description: string;
  /** Component mappings for this target */
  mappings: ComponentMappings;
  /** Generate output from JSX and custom components */
  generate: (jsx: string, customComponents: Map<string, string>) => string;
  /** Format the generated output */
  format?: (code: string) => string;
  /** Wrap output in a component/function */
  wrapInComponent?: (code: string, name: string) => string;
}
