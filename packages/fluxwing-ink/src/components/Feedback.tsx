import React from 'react';
import { Box, Text } from 'ink';
import type { AlertProps, BadgeProps, ProgressProps } from './types.js';

const alertStyles = {
  info: { icon: 'ℹ', color: 'blue', border: '─' },
  success: { icon: '✓', color: 'green', border: '─' },
  warning: { icon: '⚠', color: 'yellow', border: '─' },
  error: { icon: '✗', color: 'red', border: '─' },
};

export const Alert: React.FC<AlertProps> = ({
  children,
  type = 'info',
  title,
}) => {
  const style = alertStyles[type];

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={style.color}
      paddingX={1}
    >
      <Box gap={1}>
        <Text color={style.color}>{style.icon}</Text>
        {title && <Text bold color={style.color}>{title}</Text>}
      </Box>
      {children && (
        <Text>{children}</Text>
      )}
    </Box>
  );
};

const badgeStyles = {
  default: { bg: 'gray', fg: 'white' },
  success: { bg: 'green', fg: 'white' },
  warning: { bg: 'yellow', fg: 'black' },
  error: { bg: 'red', fg: 'white' },
  info: { bg: 'blue', fg: 'white' },
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
}) => {
  const style = badgeStyles[variant];

  return (
    <Text backgroundColor={style.bg} color={style.fg}>
      {' '}{children}{' '}
    </Text>
  );
};

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  width = 20,
  showLabel = true,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;

  const filledBar = '█'.repeat(filled);
  const emptyBar = '░'.repeat(empty);

  return (
    <Box gap={1}>
      <Text>
        <Text color="green">{filledBar}</Text>
        <Text dimColor>{emptyBar}</Text>
      </Text>
      {showLabel && (
        <Text dimColor>{Math.round(percentage)}%</Text>
      )}
    </Box>
  );
};

export const Spinner: React.FC<{ label?: string }> = ({ label }) => {
  // Static representation for mockup purposes
  return (
    <Box gap={1}>
      <Text color="cyan">◐</Text>
      {label && <Text>{label}</Text>}
    </Box>
  );
};

export const Toast: React.FC<AlertProps> = ({
  children,
  type = 'info',
}) => {
  const style = alertStyles[type];

  return (
    <Box borderStyle="round" borderColor={style.color} paddingX={2} paddingY={0}>
      <Text color={style.color}>{style.icon} </Text>
      <Text>{children}</Text>
    </Box>
  );
};
