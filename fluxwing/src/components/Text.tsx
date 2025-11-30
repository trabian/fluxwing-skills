import React from 'react';
import { Text as InkText, Box } from 'ink';
import type { TextProps, HeadingProps } from './types.js';

// Base Text component - no Box wrapper to avoid nesting issues
export const Text: React.FC<TextProps> = ({
  children,
  color,
  bold,
  italic,
  underline,
  dimmed,
}) => {
  return (
    <InkText
      color={color}
      bold={bold}
      italic={italic}
      underline={underline}
      dimColor={dimmed}
    >
      {children}
    </InkText>
  );
};

// Heading with optional alignment via Box wrapper
export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 1,
  align = 'left',
  color,
}) => {
  const styles: Record<number, { bold: boolean }> = {
    1: { bold: true },
    2: { bold: true },
    3: { bold: true },
    4: { bold: false },
  };

  const style = styles[level] || styles[1];
  const justifyContent = align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';

  return (
    <Box justifyContent={justifyContent}>
      <InkText bold={style.bold} color={color}>
        {children}
      </InkText>
    </Box>
  );
};

export const Label: React.FC<TextProps> = ({ children, color }) => {
  return (
    <InkText dimColor color={color}>
      {children}
    </InkText>
  );
};

export const Link: React.FC<TextProps> = ({ children }) => {
  return (
    <InkText color="cyan" underline>
      {children}
    </InkText>
  );
};
