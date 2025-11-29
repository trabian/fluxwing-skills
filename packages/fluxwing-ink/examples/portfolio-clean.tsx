#!/usr/bin/env npx tsx
/**
 * Portfolio Overview - Clean version optimized for display
 */

import React from 'react';
import { render, Box, Text } from 'ink';

import {
  Panel,
  Stack,
  Row,
  Heading,
  Badge,
  Divider,
  Button,
} from '../src/components/index.js';

const PortfolioOverview = () => {
  return (
    <Box flexDirection="column" padding={1}>
      {/* HEADER */}
      <Box borderStyle="round" paddingX={2} paddingY={1}>
        <Box flexDirection="column">
          <Row justify="between">
            <Text dimColor>Total Portfolio Value</Text>
            <Row gap={2}>
              <Badge variant="success">● Live</Badge>
              <Button variant="primary">Trade</Button>
              <Button variant="outline">Deposit</Button>
            </Row>
          </Row>
          <Box gap={3}>
            <Text bold>$1,247,832.41</Text>
            <Text color="green">▲ $12,847.23 (+1.04%)</Text>
          </Box>
        </Box>
      </Box>

      <Box height={1} />

      {/* STATS BAR */}
      <Box justifyContent="space-around">
        <Box flexDirection="column" alignItems="center">
          <Text dimColor>Cash</Text>
          <Text bold>$84,221</Text>
        </Box>
        <Text dimColor>│</Text>
        <Box flexDirection="column" alignItems="center">
          <Text dimColor>Day P&L</Text>
          <Text bold color="green">+$12,847</Text>
        </Box>
        <Text dimColor>│</Text>
        <Box flexDirection="column" alignItems="center">
          <Text dimColor>Buying Power</Text>
          <Text bold>$168,442</Text>
        </Box>
        <Text dimColor>│</Text>
        <Box flexDirection="column" alignItems="center">
          <Text dimColor>Positions</Text>
          <Text bold>23</Text>
        </Box>
      </Box>

      <Box height={1} />
      <Divider width={70} />
      <Box height={1} />

      {/* HOLDINGS */}
      <Text bold> Top Holdings</Text>
      <Box flexDirection="column" paddingLeft={1}>
        <Box>
          <Text dimColor>{'Symbol'.padEnd(10)}{'Shares'.padEnd(10)}{'Value'.padEnd(14)}{'Change'.padEnd(10)}</Text>
        </Box>
        <Text dimColor>{'─'.repeat(44)}</Text>
        <Text><Text bold>{'AAPL'.padEnd(10)}</Text>{'245'.padEnd(10)}{'$142,847'.padEnd(14)}<Text color="green">{'+2.34%'}</Text></Text>
        <Text><Text bold>{'MSFT'.padEnd(10)}</Text>{'312'.padEnd(10)}{'$128,442'.padEnd(14)}<Text color="green">{'+1.87%'}</Text></Text>
        <Text><Text bold>{'GOOGL'.padEnd(10)}</Text>{'142'.padEnd(10)}{'$98,221'.padEnd(14)}<Text color="green">{'+0.92%'}</Text></Text>
        <Text><Text bold>{'BRK.B'.padEnd(10)}</Text>{'87'.padEnd(10)}{'$87,442'.padEnd(14)}<Text color="red">{'-0.21%'}</Text></Text>
        <Text><Text bold>{'VTI'.padEnd(10)}</Text>{'285'.padEnd(10)}{'$76,891'.padEnd(14)}<Text color="green">{'+1.12%'}</Text></Text>
        <Text dimColor>View all 23 holdings →</Text>
      </Box>

      <Box height={1} />

      {/* PERFORMANCE */}
      <Text bold> 7-Day Performance</Text>
      <Box flexDirection="column" paddingLeft={1}>
        <Text>  1.5% │            ╭─╮</Text>
        <Text>  1.0% │    ╭╮      │ │       ╭╮</Text>
        <Text>  0.5% │    ││  ╭╮  │ │  ╭╮   ││</Text>
        <Text>  0.0% │────┴┴──┴┴──┴─┴──┴┴───┴┴────</Text>
        <Text> -0.5% │        ╰╯</Text>
        <Text>       └─────────────────────────────</Text>
        <Text dimColor>         Mon Tue Wed Thu Fri Sat Sun</Text>
        <Box height={1} />
        <Box gap={4}>
          <Text>Week: <Text color="green">+4.3%</Text></Text>
          <Text>Month: <Text color="green">+8.7%</Text></Text>
          <Text>YTD: <Text color="green">+24.7%</Text></Text>
        </Box>
      </Box>

      <Box height={1} />

      {/* RECENT ACTIVITY */}
      <Text bold> Recent Activity</Text>
      <Box flexDirection="column" paddingLeft={1}>
        <Text>💰 AAPL Dividend           <Text color="green">+$847.20</Text>    Today</Text>
        <Text>📈 Buy VTI (15 shares)     <Text color="red">-$3,631.65</Text>   1d ago</Text>
        <Text>📉 Sell TSLA (10 shares)   <Text color="green">+$3,528.00</Text>   2d ago</Text>
        <Text>⬇️  ACH Deposit             <Text color="green">+$5,000.00</Text>   4d ago</Text>
        <Text>💰 MSFT Dividend           <Text color="green">+$412.50</Text>    1w ago</Text>
        <Text dimColor>View all activity →</Text>
      </Box>

      <Box height={1} />
      <Divider width={70} />
      <Row justify="between">
        <Text dimColor>Account #****4847 • Individual Brokerage</Text>
        <Text dimColor>Statements • Tax Docs • Settings</Text>
      </Row>
    </Box>
  );
};

render(<PortfolioOverview />);
