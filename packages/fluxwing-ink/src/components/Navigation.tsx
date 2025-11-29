import React from 'react';
import { Box, Text } from 'ink';

interface TabsProps {
  tabs: Array<{ id: string; label: string }>;
  active?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, active }) => {
  return (
    <Box flexDirection="row" gap={0}>
      {tabs.map((tab, i) => {
        const isActive = tab.id === active;
        return (
          <Box key={tab.id}>
            <Text color={isActive ? 'blue' : 'gray'}>
              {isActive ? '┌' : '─'}
              {'─'.repeat(tab.label.length + 2)}
              {isActive ? '┐' : '─'}
            </Text>
            {i < tabs.length - 1 && <Text color="gray">─</Text>}
          </Box>
        );
      })}
      <Text>
        {'\n'}
      </Text>
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Text key={tab.id} color={isActive ? 'blue' : 'gray'}>
            │ {tab.label} │
          </Text>
        );
      })}
    </Box>
  );
};

// Simple horizontal tabs
export const TabBar: React.FC<TabsProps> = ({ tabs, active }) => {
  return (
    <Box flexDirection="column">
      <Box flexDirection="row" gap={2}>
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <Text key={tab.id} color={isActive ? 'blue' : undefined} bold={isActive}>
              {isActive ? '▸ ' : '  '}{tab.label}
            </Text>
          );
        })}
      </Box>
      <Text dimColor>{'─'.repeat(50)}</Text>
    </Box>
  );
};

interface NavItemProps {
  label: string;
  icon?: string;
  active?: boolean;
  indent?: number;
}

export const NavItem: React.FC<NavItemProps> = ({
  label,
  icon,
  active = false,
  indent = 0,
}) => {
  const prefix = active ? '▸' : ' ';
  const indentStr = '  '.repeat(indent);

  return (
    <Text color={active ? 'blue' : undefined} bold={active}>
      {indentStr}{prefix} {icon && `${icon} `}{label}
    </Text>
  );
};

interface NavProps {
  children: React.ReactNode;
  title?: string;
}

export const Nav: React.FC<NavProps> = ({ children, title }) => {
  return (
    <Box flexDirection="column" borderStyle="single" paddingX={1}>
      {title && (
        <>
          <Text bold>{title}</Text>
          <Text dimColor>{'─'.repeat(20)}</Text>
        </>
      )}
      {children}
    </Box>
  );
};

interface BreadcrumbProps {
  items: string[];
  separator?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = ' › ',
}) => {
  return (
    <Box>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <Text color={i === items.length - 1 ? undefined : 'cyan'}>
            {item}
          </Text>
          {i < items.length - 1 && <Text dimColor>{separator}</Text>}
        </React.Fragment>
      ))}
    </Box>
  );
};

interface PaginationProps {
  current: number;
  total: number;
  showPages?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  current,
  total,
  showPages = 5,
}) => {
  const start = Math.max(1, current - Math.floor(showPages / 2));
  const end = Math.min(total, start + showPages - 1);
  const pages = [];

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <Box gap={1}>
      <Text color={current > 1 ? 'cyan' : 'gray'}>◀</Text>
      {start > 1 && <Text dimColor>...</Text>}
      {pages.map((page) => (
        <Text key={page} color={page === current ? 'blue' : undefined} bold={page === current}>
          {page === current ? `[${page}]` : ` ${page} `}
        </Text>
      ))}
      {end < total && <Text dimColor>...</Text>}
      <Text color={current < total ? 'cyan' : 'gray'}>▶</Text>
    </Box>
  );
};
