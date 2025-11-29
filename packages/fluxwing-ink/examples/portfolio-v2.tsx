#!/usr/bin/env npx tsx
/**
 * Portfolio Overview - Wealth Management App
 *
 * Design iteration 2:
 * - ASCII pie chart for asset allocation
 * - Color-coded gain/loss
 * - Quick actions section
 * - Transaction type icons
 */

import React from 'react';
import { render, Box, Text } from 'ink';

import {
  Card,
  Panel,
  Stack,
  Row,
  Heading,
  Badge,
  Table,
  Divider,
  Button,
} from '../src/components/index.js';

// Custom ASCII pie chart component
const PieChart: React.FC<{ data: Array<{ label: string; value: number; color?: string }> }> = ({ data }) => {
  // ASCII art pie chart representation
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Box flexDirection="column">
      <Text>        ╭───────────╮</Text>
      <Text>      ╭─┤{' '}US Eq 45%{' '}├───╮</Text>
      <Text>    ╭─┤ ╰───────────╯   ├─╮</Text>
      <Text>    │ │   Int'l 20%    │ │</Text>
      <Text>    │ ├────────────────┤ │</Text>
      <Text>    │ │  Fixed 25%     │ │</Text>
      <Text>    ╰─┤ ╭───────────╮  ├─╯</Text>
      <Text>      ╰─┤ Alt 7%    ├──╯</Text>
      <Text>        │ Cash 3%   │</Text>
      <Text>        ╰───────────╯</Text>
    </Box>
  );
};

// Transaction with icon
const TransactionRow: React.FC<{
  date: string;
  type: string;
  description: string;
  amount: string;
}> = ({ date, type, description, amount }) => {
  const icons: Record<string, string> = {
    Dividend: '💰',
    Buy: '📈',
    Sell: '📉',
    Transfer: '↔️',
    Deposit: '⬇️',
    Withdraw: '⬆️',
  };
  const icon = icons[type] || '•';
  const isPositive = amount.startsWith('+');

  return (
    <Box gap={2}>
      <Text dimColor>{date.padEnd(10)}</Text>
      <Text>{icon} {type.padEnd(10)}</Text>
      <Text>{description.padEnd(32)}</Text>
      <Text color={isPositive ? 'green' : 'red'}>{amount.padStart(12)}</Text>
    </Box>
  );
};

// Holdings with colored change
const HoldingRow: React.FC<{
  symbol: string;
  name: string;
  value: string;
  change: string;
}> = ({ symbol, name, value, change }) => {
  const isPositive = change.startsWith('+');

  return (
    <Box gap={1}>
      <Text bold>{symbol.padEnd(8)}</Text>
      <Text>{name.padEnd(18)}</Text>
      <Text>{value.padStart(12)}</Text>
      <Text color={isPositive ? 'green' : 'red'}>{change.padStart(10)}</Text>
    </Box>
  );
};

const PortfolioOverview = () => {
  const holdings = [
    { symbol: 'AAPL', name: 'Apple Inc.', value: '$142,847', change: '+2.34%' },
    { symbol: 'MSFT', name: 'Microsoft Corp', value: '$128,442', change: '+1.87%' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', value: '$98,221', change: '+0.92%' },
    { symbol: 'BRK.B', name: 'Berkshire Hath.', value: '$87,442', change: '-0.21%' },
    { symbol: 'VTI', name: 'Vanguard Total', value: '$76,891', change: '+1.12%' },
  ];

  const transactions = [
    { date: 'Nov 29', type: 'Dividend', description: 'AAPL Quarterly Dividend', amount: '+$847.20' },
    { date: 'Nov 28', type: 'Buy', description: 'VTI - 15 shares @ $242.11', amount: '-$3,631.65' },
    { date: 'Nov 27', type: 'Sell', description: 'TSLA - 10 shares @ $352.80', amount: '+$3,528.00' },
    { date: 'Nov 25', type: 'Transfer', description: 'ACH Deposit', amount: '+$5,000.00' },
  ];

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Row justify="between">
        <Stack gap={0}>
          <Heading level={1}>Portfolio Overview</Heading>
          <Text dimColor>Last updated: Nov 29, 2024 3:42 PM EST</Text>
        </Stack>
        <Row gap={2}>
          <Badge variant="success">Market Open</Badge>
        </Row>
      </Row>

      <Box height={1} />

      {/* Account Summary */}
      <Row gap={2}>
        <Card padding={1}>
          <Stack gap={0}>
            <Text dimColor>Total Portfolio Value</Text>
            <Heading level={1}>$1,247,832.41</Heading>
            <Text color="green">▲ $12,847.23 (+1.04%) today</Text>
          </Stack>
        </Card>

        <Card padding={1}>
          <Stack gap={0}>
            <Text dimColor>Cash Available</Text>
            <Heading level={2}>$84,221.00</Heading>
            <Text dimColor>Buying power: $168,442</Text>
          </Stack>
        </Card>

        {/* Quick Actions */}
        <Panel title="Quick Actions">
          <Row gap={1}>
            <Button variant="primary" icon="plus">Deposit</Button>
            <Button variant="outline">Withdraw</Button>
            <Button variant="outline">Transfer</Button>
          </Row>
        </Panel>
      </Row>

      <Box height={1} />

      {/* Main Content */}
      <Row gap={2} align="top">
        {/* Asset Allocation with Pie Chart */}
        <Panel title="Asset Allocation">
          <Stack gap={1}>
            <PieChart data={[]} />
            <Divider width={24} />
            <Row gap={2}>
              <Text>■ <Text color="blue">US Equity</Text></Text>
              <Text>■ <Text color="cyan">Int'l</Text></Text>
            </Row>
            <Row gap={2}>
              <Text>■ <Text color="green">Fixed Inc</Text></Text>
              <Text>■ <Text color="yellow">Alt</Text></Text>
              <Text>■ <Text color="gray">Cash</Text></Text>
            </Row>
          </Stack>
        </Panel>

        {/* Top Holdings with colored changes */}
        <Box flexDirection="column" flexGrow={1}>
          <Panel title="Top Holdings">
            <Stack gap={0}>
              <Box gap={1}>
                <Text bold dimColor>{'Symbol'.padEnd(8)}</Text>
                <Text bold dimColor>{'Name'.padEnd(18)}</Text>
                <Text bold dimColor>{'Value'.padStart(12)}</Text>
                <Text bold dimColor>{'Change'.padStart(10)}</Text>
              </Box>
              <Divider width={50} />
              {holdings.map((h, i) => (
                <HoldingRow key={i} {...h} />
              ))}
            </Stack>
          </Panel>
        </Box>
      </Row>

      <Box height={1} />

      {/* Recent Transactions with icons */}
      <Panel title="Recent Activity">
        <Stack gap={0}>
          <Box gap={2}>
            <Text bold dimColor>{'Date'.padEnd(10)}</Text>
            <Text bold dimColor>{'Type'.padEnd(13)}</Text>
            <Text bold dimColor>{'Description'.padEnd(32)}</Text>
            <Text bold dimColor>{'Amount'.padStart(12)}</Text>
          </Box>
          <Divider width={70} />
          {transactions.map((t, i) => (
            <TransactionRow key={i} {...t} />
          ))}
        </Stack>
      </Panel>

      <Box height={1} />
      <Divider width={80} />
      <Row justify="between">
        <Text dimColor>Account #****4847 • Individual Brokerage</Text>
        <Row gap={2}>
          <Button variant="ghost">Statements</Button>
          <Button variant="ghost">Tax Docs</Button>
          <Button variant="primary">Trade</Button>
        </Row>
      </Row>
    </Box>
  );
};

render(<PortfolioOverview />);
