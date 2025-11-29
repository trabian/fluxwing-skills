import React from 'react';
import { Box, Text } from 'ink';
import type { ButtonProps } from './types.js';

// Border characters for different styles
const borders = {
  primary: { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' },
  secondary: { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' },
  outline: { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' },
  ghost: { tl: ' ', tr: ' ', bl: ' ', br: ' ', h: ' ', v: ' ' },
  danger: { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' },
};

const variantColors: Record<string, { bg?: string; fg: string; border: string }> = {
  primary: { fg: 'white', border: 'blue' },
  secondary: { fg: 'white', border: 'gray' },
  outline: { fg: 'blue', border: 'blue' },
  ghost: { fg: 'blue', border: 'transparent' },
  danger: { fg: 'white', border: 'red' },
};

const iconMap: Record<string, string> = {
  google: '◉',
  github: '◈',
  apple: '',
  check: '✓',
  close: '✗',
  arrow: '→',
  plus: '+',
  minus: '−',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon,
}) => {
  const b = borders[variant];
  const colors = variantColors[variant];

  const padding = size === 'sm' ? 1 : size === 'lg' ? 3 : 2;
  const label = typeof children === 'string' ? children : '';
  const iconChar = icon ? iconMap[icon] || icon : '';
  const content = iconChar ? `${iconChar} ${label}` : label;

  // Calculate width
  const contentWidth = content.length + (padding * 2);
  const width = fullWidth ? 30 : contentWidth; // 30 is a reasonable default for fullWidth

  const paddedContent = content.padStart(Math.floor((width - 2 + content.length) / 2)).padEnd(width - 2);

  const color = disabled ? 'gray' : colors.border;
  const textColor = disabled ? 'gray' : colors.fg;

  return (
    <Box flexDirection="column">
      <Text color={color}>
        {b.tl}{b.h.repeat(width - 2)}{b.tr}
      </Text>
      <Text>
        <Text color={color}>{b.v}</Text>
        <Text color={textColor}>{paddedContent}</Text>
        <Text color={color}>{b.v}</Text>
      </Text>
      <Text color={color}>
        {b.bl}{b.h.repeat(width - 2)}{b.br}
      </Text>
    </Box>
  );
};

export const ButtonGroup: React.FC<{ children: React.ReactNode; gap?: number }> = ({
  children,
  gap = 1,
}) => {
  return (
    <Box flexDirection="row" gap={gap}>
      {children}
    </Box>
  );
};
