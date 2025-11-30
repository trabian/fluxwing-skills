import React from 'react';
import { Box, Text } from 'ink';

interface Column {
  key: string;
  header: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
}

interface TableProps {
  columns: Column[];
  data: Record<string, string | number>[];
  border?: 'none' | 'single' | 'double';
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  border = 'single',
}) => {
  // Calculate column widths
  const colWidths = columns.map((col) => {
    if (col.width) return col.width;
    const headerLen = col.header.length;
    const maxDataLen = Math.max(
      ...data.map((row) => String(row[col.key] || '').length)
    );
    return Math.max(headerLen, maxDataLen) + 2;
  });

  const totalWidth = colWidths.reduce((a, b) => a + b, 0) + columns.length + 1;

  const b = border === 'double'
    ? { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║', cross: '╬', tCross: '╦', bCross: '╩', lCross: '╠', rCross: '╣' }
    : border === 'single'
    ? { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│', cross: '┼', tCross: '┬', bCross: '┴', lCross: '├', rCross: '┤' }
    : { tl: '', tr: '', bl: '', br: '', h: '', v: ' ', cross: '', tCross: '', bCross: '', lCross: '', rCross: '' };

  const formatCell = (value: string, width: number, align: 'left' | 'center' | 'right' = 'left') => {
    const str = value.slice(0, width);
    if (align === 'center') {
      const padding = width - str.length;
      const left = Math.floor(padding / 2);
      const right = padding - left;
      return ' '.repeat(left) + str + ' '.repeat(right);
    } else if (align === 'right') {
      return str.padStart(width);
    }
    return str.padEnd(width);
  };

  // Top border
  const topBorder = border !== 'none' ? (
    <Text dimColor>
      {b.tl}
      {colWidths.map((w, i) => b.h.repeat(w) + (i < colWidths.length - 1 ? b.tCross : '')).join('')}
      {b.tr}
    </Text>
  ) : null;

  // Header row
  const headerRow = (
    <Text>
      <Text dimColor>{b.v}</Text>
      {columns.map((col, i) => (
        <React.Fragment key={col.key}>
          <Text bold>{formatCell(col.header, colWidths[i], col.align)}</Text>
          <Text dimColor>{b.v}</Text>
        </React.Fragment>
      ))}
    </Text>
  );

  // Header separator
  const headerSep = border !== 'none' ? (
    <Text dimColor>
      {b.lCross}
      {colWidths.map((w, i) => b.h.repeat(w) + (i < colWidths.length - 1 ? b.cross : '')).join('')}
      {b.rCross}
    </Text>
  ) : null;

  // Data rows
  const dataRows = data.map((row, rowIndex) => (
    <Text key={rowIndex}>
      <Text dimColor>{b.v}</Text>
      {columns.map((col, i) => (
        <React.Fragment key={col.key}>
          <Text>{formatCell(String(row[col.key] || ''), colWidths[i], col.align)}</Text>
          <Text dimColor>{b.v}</Text>
        </React.Fragment>
      ))}
    </Text>
  ));

  // Bottom border
  const bottomBorder = border !== 'none' ? (
    <Text dimColor>
      {b.bl}
      {colWidths.map((w, i) => b.h.repeat(w) + (i < colWidths.length - 1 ? b.bCross : '')).join('')}
      {b.br}
    </Text>
  ) : null;

  return (
    <Box flexDirection="column">
      {topBorder}
      {headerRow}
      {headerSep}
      {dataRows}
      {bottomBorder}
    </Box>
  );
};

interface ListProps {
  items: Array<{ label: string; value?: string; icon?: string }>;
  ordered?: boolean;
}

export const List: React.FC<ListProps> = ({ items, ordered = false }) => {
  return (
    <Box flexDirection="column">
      {items.map((item, i) => (
        <Box key={i} gap={1}>
          <Text dimColor>
            {ordered ? `${i + 1}.` : item.icon || '•'}
          </Text>
          <Text>{item.label}</Text>
          {item.value && <Text dimColor>— {item.value}</Text>}
        </Box>
      ))}
    </Box>
  );
};
