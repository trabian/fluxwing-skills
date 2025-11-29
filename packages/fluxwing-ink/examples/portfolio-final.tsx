#!/usr/bin/env npx tsx
/**
 * Portfolio Overview - Wealth Management App
 *
 * Final design with performance chart
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

// ASCII Sparkline chart
const PerformanceChart: React.FC = () => {
  // 7-day performance visualization
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const values = [1.2, 0.8, -0.3, 1.5, 0.9, 0.2, 1.0]; // % change each day

  return (
    <Box flexDirection="column">
      <Text bold>7-Day Performance</Text>
      <Box height={1} />
      <Text>  1.5% │        ╭─╮</Text>
      <Text>  1.0% │  ╭╮    │ │     ╭╮</Text>
      <Text>  0.5% │  ││ ╭╮ │ │ ╭╮  ││</Text>
      <Text>  0.0% │──┴┴─┴┴─┴─┴─┴┴──┴┴──</Text>
      <Text> -0.5% │     ╰╯</Text>
      <Text>       └────────────────────</Text>
      <Text dimColor>        M  T  W  T  F  S  S</Text>
      <Box height={1} />
      <Row gap={2}>
        <Text>Week: <Text color="green">+4.3%</Text></Text>
        <Text>Month: <Text color="green">+8.7%</Text></Text>
        <Text>YTD: <Text color="green">+24.7%</Text></Text>
      </Row>
    </Box>
  );
};

// Stat box
const StatBox: React.FC<{ label: string; value: string; subtext?: string; color?: string }> = ({
  label, value, subtext, color,
}) => (
  <Box flexDirection="column" paddingX={2}>
    <Text dimColor>{label}</Text>
    <Text bold color={color}>{value}</Text>
    {subtext && <Text dimColor>{subtext}</Text>}
  </Box>
);

// Holding row
const HoldingRow: React.FC<{ symbol: string; shares: string; value: string; change: string }> = ({
  symbol, shares, value, change,
}) => (
  <Box>
    <Box width={8}><Text bold>{symbol}</Text></Box>
    <Box width={10}><Text dimColor>{shares}</Text></Box>
    <Box width={11}><Text>{value}</Text></Box>
    <Box width={9}><Text color={change.startsWith('-') ? 'red' : 'green'}>{change}</Text></Box>
  </Box>
);

// Activity row
const ActivityRow: React.FC<{ icon: string; desc: string; amount: string; time: string }> = ({
  icon, desc, amount, time,
}) => (
  <Box>
    <Box width={3}><Text>{icon}</Text></Box>
    <Box width={18}><Text>{desc}</Text></Box>
    <Box width={11}><Text color={amount.startsWith('+') ? 'green' : 'red'}>{amount}</Text></Box>
    <Box width={7}><Text dimColor>{time}</Text></Box>
  </Box>
);

const PortfolioOverview = () => {
  return (
    <Box flexDirection="column" padding={1}>
      {/* HEADER */}
      <Box borderStyle="round" paddingX={2} paddingY={1}>
        <Row justify="between">
          <Stack gap={0}>
            <Text dimColor>Total Portfolio Value</Text>
            <Box gap={2}>
              <Text bold>$1,247,832.41</Text>
              <Text color="green">▲ $12,847.23 (+1.04%)</Text>
            </Box>
          </Stack>
          <Row gap={1}>
            <Badge variant="success">● Live</Badge>
            <Button variant="outline">Deposit</Button>
            <Button variant="primary">Trade</Button>
          </Row>
        </Row>
      </Box>

      <Box height={1} />

      {/* STATS BAR */}
      <Row>
        <StatBox label="Cash" value="$84,221" />
        <Text dimColor>│</Text>
        <StatBox label="Day P&L" value="+$12.8K" color="green" />
        <Text dimColor>│</Text>
        <StatBox label="Buying Power" value="$168K" />
        <Text dimColor>│</Text>
        <StatBox label="Positions" value="23" />
      </Row>

      <Box height={1} />

      {/* THREE COLUMNS */}
      <Row gap={2} align="top">
        {/* LEFT: Holdings */}
        <Box flexDirection="column" width={40}>
          <Panel title="Top Holdings">
            <Stack gap={0}>
              <Box>
                <Box width={8}><Text bold dimColor>Sym</Text></Box>
                <Box width={10}><Text bold dimColor>Shares</Text></Box>
                <Box width={11}><Text bold dimColor>Value</Text></Box>
                <Box width={9}><Text bold dimColor>Chg</Text></Box>
              </Box>
              <Divider width={36} />
              <HoldingRow symbol="AAPL" shares="245" value="$142,847" change="+2.3%" />
              <HoldingRow symbol="MSFT" shares="312" value="$128,442" change="+1.9%" />
              <HoldingRow symbol="GOOGL" shares="142" value="$98,221" change="+0.9%" />
              <HoldingRow symbol="BRK.B" shares="87" value="$87,442" change="-0.2%" />
              <HoldingRow symbol="VTI" shares="285" value="$76,891" change="+1.1%" />
              <Divider width={36} />
              <Text dimColor>View all 23 →</Text>
            </Stack>
          </Panel>
        </Box>

        {/* CENTER: Chart */}
        <Box flexDirection="column" width={30}>
          <Panel title="Performance">
            <PerformanceChart />
          </Panel>
        </Box>

        {/* RIGHT: Activity */}
        <Box flexDirection="column" width={42}>
          <Panel title="Recent Activity">
            <Stack gap={0}>
              <ActivityRow icon="💰" desc="AAPL Dividend" amount="+$847" time="Today" />
              <ActivityRow icon="📈" desc="Buy VTI" amount="-$3,631" time="1d" />
              <ActivityRow icon="📉" desc="Sell TSLA" amount="+$3,528" time="2d" />
              <ActivityRow icon="⬇️" desc="Deposit" amount="+$5,000" time="4d" />
              <ActivityRow icon="💰" desc="MSFT Dividend" amount="+$412" time="1w" />
              <Divider width={38} />
              <Text dimColor>View all →</Text>
            </Stack>
          </Panel>
        </Box>
      </Row>

      <Box height={1} />
      <Divider width={115} />
      <Text dimColor>Individual Brokerage ****4847 │ Statements │ Tax Docs │ Settings</Text>
    </Box>
  );
};

render(<PortfolioOverview />);
