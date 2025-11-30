import { ReactNode } from 'react';

// Common prop types
export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type Size = 'sm' | 'md' | 'lg';
export type Align = 'left' | 'center' | 'right';
export type InputState = 'default' | 'focus' | 'error' | 'disabled';

export interface BaseProps {
  children?: ReactNode;
}

export interface BoxProps extends BaseProps {
  padding?: number | [number, number];
  margin?: number | [number, number];
  border?: 'none' | 'single' | 'double' | 'round' | 'bold';
  borderColor?: string;
  width?: number | string;
  height?: number;
  flexDirection?: 'row' | 'column';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  gap?: number;
}

export interface TextProps extends BaseProps {
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  dimmed?: boolean;
  align?: Align;
}

export interface HeadingProps extends TextProps {
  level?: 1 | 2 | 3 | 4;
}

export interface ButtonProps extends BaseProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: string;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  type?: 'text' | 'password' | 'email';
  state?: InputState;
  error?: string;
  width?: number;
}

export interface CardProps extends BaseProps {
  title?: string;
  padding?: number;
  border?: 'single' | 'double' | 'round';
}

export interface DividerProps {
  style?: 'line' | 'dashed' | 'dotted';
  width?: number | string;
}

export interface AlertProps extends BaseProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
}

export interface BadgeProps extends BaseProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export interface ProgressProps {
  value: number;
  max?: number;
  width?: number;
  showLabel?: boolean;
}

export interface SelectProps {
  label?: string;
  options: Array<{ value: string; label: string }>;
  selected?: string;
  placeholder?: string;
  width?: number;
}

export interface CheckboxProps {
  label: string;
  checked?: boolean;
  disabled?: boolean;
}

export interface RadioProps {
  label: string;
  selected?: boolean;
  disabled?: boolean;
}

export interface ScreenProps extends BaseProps {
  title?: string;
  width?: number;
}

export interface StackProps extends BaseProps {
  gap?: number;
  align?: 'left' | 'center' | 'right' | 'stretch';
}

export interface RowProps extends BaseProps {
  gap?: number;
  align?: 'top' | 'center' | 'bottom';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}
