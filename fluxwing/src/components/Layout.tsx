import React from 'react';
import { Box, Text } from 'ink';
import type { CardProps, StackProps, RowProps, ScreenProps, DividerProps } from './types.js';

const borderChars = {
  single: { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' },
  double: { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║' },
  round: { tl: '╭', tr: '╮', bl: '╰', br: '╯', h: '─', v: '│' },
};

export const Card: React.FC<CardProps> = ({
  children,
  title,
  padding = 1,
  border = 'round',
}) => {
  const b = borderChars[border];

  return (
    <Box flexDirection="column">
      <Box
        flexDirection="column"
        borderStyle={border === 'round' ? 'round' : border === 'double' ? 'double' : 'single'}
        paddingX={padding}
        paddingY={padding}
      >
        {title && (
          <>
            <Text bold>{title}</Text>
            <Text> </Text>
          </>
        )}
        {children}
      </Box>
    </Box>
  );
};

export const Stack: React.FC<StackProps> = ({
  children,
  gap = 0,
  align = 'stretch',
}) => {
  const alignItems = align === 'left' ? 'flex-start'
    : align === 'right' ? 'flex-end'
    : align === 'center' ? 'center'
    : 'stretch';

  return (
    <Box flexDirection="column" gap={gap} alignItems={alignItems}>
      {children}
    </Box>
  );
};

export const Row: React.FC<RowProps> = ({
  children,
  gap = 1,
  align = 'center',
  justify = 'start',
}) => {
  const alignItems = align === 'top' ? 'flex-start'
    : align === 'bottom' ? 'flex-end'
    : 'center';

  const justifyContent = justify === 'start' ? 'flex-start'
    : justify === 'end' ? 'flex-end'
    : justify === 'center' ? 'center'
    : justify === 'between' ? 'space-between'
    : 'space-around';

  return (
    <Box flexDirection="row" gap={gap} alignItems={alignItems} justifyContent={justifyContent}>
      {children}
    </Box>
  );
};

export const Screen: React.FC<ScreenProps> = ({
  children,
  title,
  width = 50,
}) => {
  const b = borderChars.double;
  const innerWidth = width - 2;

  return (
    <Box flexDirection="column">
      {/* Top border with optional title */}
      <Text color="blue">
        {b.tl}
        {title
          ? `${b.h} ${title} ${b.h.repeat(Math.max(0, innerWidth - title.length - 3))}`
          : b.h.repeat(innerWidth)
        }
        {b.tr}
      </Text>

      {/* Content */}
      <Box flexDirection="column" paddingX={1}>
        {children}
      </Box>

      {/* Bottom border */}
      <Text color="blue">
        {b.bl}{b.h.repeat(innerWidth)}{b.br}
      </Text>
    </Box>
  );
};

export const Divider: React.FC<DividerProps> = ({
  style = 'line',
  width = 30,
}) => {
  const char = style === 'dashed' ? '╌' : style === 'dotted' ? '·' : '─';
  const line = typeof width === 'number' ? char.repeat(width) : char.repeat(30);

  return (
    <Box paddingY={0}>
      <Text dimColor>{line}</Text>
    </Box>
  );
};

export const Spacer: React.FC<{ size?: number }> = ({ size = 1 }) => {
  return <Box height={size} />;
};

export const Panel: React.FC<CardProps> = ({
  children,
  title,
  padding = 1,
}) => {
  return (
    <Box flexDirection="column" borderStyle="single" paddingX={padding} paddingY={padding}>
      {title && (
        <>
          <Text bold color="cyan">{title}</Text>
          <Divider />
        </>
      )}
      {children}
    </Box>
  );
};
