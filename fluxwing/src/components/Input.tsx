import React from 'react';
import { Box, Text } from 'ink';
import type { InputProps, SelectProps, CheckboxProps, RadioProps } from './types.js';

const borderStyles = {
  default: { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' },
  focus: { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║' },
  error: { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' },
  disabled: { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '╌', v: '┊' },
};

const stateColors = {
  default: 'gray',
  focus: 'blue',
  error: 'red',
  disabled: 'gray',
};

export const Input: React.FC<InputProps> = ({
  label,
  placeholder = '',
  value = '',
  type = 'text',
  state = 'default',
  error,
  width = 30,
}) => {
  const b = borderStyles[state];
  const color = stateColors[state];

  // Display value or placeholder
  let displayValue = value || placeholder;
  if (type === 'password' && value) {
    displayValue = '•'.repeat(value.length);
  }

  // Add cursor for empty/placeholder state
  if (!value && state !== 'disabled') {
    displayValue = displayValue || '_';
  }

  // Pad or truncate to fit width
  const innerWidth = width - 2;
  const paddedValue = displayValue.slice(0, innerWidth).padEnd(innerWidth);

  return (
    <Box flexDirection="column">
      {label && (
        <Text dimColor={state === 'disabled'}>{label}</Text>
      )}
      <Text color={color}>
        {b.tl}{b.h.repeat(innerWidth)}{b.tr}
      </Text>
      <Text>
        <Text color={color}>{b.v}</Text>
        <Text dimColor={!value && !!placeholder} color={state === 'disabled' ? 'gray' : undefined}>
          {paddedValue}
        </Text>
        <Text color={color}>{b.v}</Text>
      </Text>
      <Text color={color}>
        {b.bl}{b.h.repeat(innerWidth)}{b.br}
      </Text>
      {error && state === 'error' && (
        <Text color="red">⚠ {error}</Text>
      )}
    </Box>
  );
};

export const TextArea: React.FC<InputProps & { rows?: number }> = ({
  label,
  placeholder = '',
  value = '',
  state = 'default',
  error,
  width = 30,
  rows = 3,
}) => {
  const b = borderStyles[state];
  const color = stateColors[state];
  const innerWidth = width - 2;

  // Split value into lines
  const lines = (value || placeholder || '').split('\n');
  const displayLines: string[] = [];

  for (let i = 0; i < rows; i++) {
    const line = lines[i] || '';
    displayLines.push(line.slice(0, innerWidth).padEnd(innerWidth));
  }

  return (
    <Box flexDirection="column">
      {label && <Text dimColor={state === 'disabled'}>{label}</Text>}
      <Text color={color}>
        {b.tl}{b.h.repeat(innerWidth)}{b.tr}
      </Text>
      {displayLines.map((line, i) => (
        <Text key={i}>
          <Text color={color}>{b.v}</Text>
          <Text dimColor={!value && !!placeholder}>{line}</Text>
          <Text color={color}>{b.v}</Text>
        </Text>
      ))}
      <Text color={color}>
        {b.bl}{b.h.repeat(innerWidth)}{b.br}
      </Text>
      {error && state === 'error' && (
        <Text color="red">⚠ {error}</Text>
      )}
    </Box>
  );
};

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  selected,
  placeholder = 'Select...',
  width = 30,
}) => {
  const innerWidth = width - 4; // Account for borders and dropdown arrow
  const selectedOption = options.find(o => o.value === selected);
  const displayValue = selectedOption?.label || placeholder;
  const paddedValue = displayValue.slice(0, innerWidth).padEnd(innerWidth);

  return (
    <Box flexDirection="column">
      {label && <Text>{label}</Text>}
      <Text color="gray">
        ┌{'─'.repeat(innerWidth + 2)}┐
      </Text>
      <Text>
        <Text color="gray">│</Text>
        <Text dimColor={!selected}> {paddedValue}</Text>
        <Text color="gray"> ▼│</Text>
      </Text>
      <Text color="gray">
        └{'─'.repeat(innerWidth + 2)}┘
      </Text>
    </Box>
  );
};

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  disabled = false,
}) => {
  const box = checked ? '☑' : '☐';
  const color = disabled ? 'gray' : undefined;

  return (
    <Text color={color}>
      {box} {label}
    </Text>
  );
};

export const Radio: React.FC<RadioProps> = ({
  label,
  selected = false,
  disabled = false,
}) => {
  const circle = selected ? '◉' : '○';
  const color = disabled ? 'gray' : undefined;

  return (
    <Text color={color}>
      {circle} {label}
    </Text>
  );
};
