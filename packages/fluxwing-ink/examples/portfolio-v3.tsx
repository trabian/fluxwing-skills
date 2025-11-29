#!/usr/bin/env npx tsx
/**
 * Portfolio Overview - Wealth Management App
 *
 * Design iteration 3: Cleaner, balanced layout
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
  Divider,
  Button,
} from '../src/components/index.js';

// Stat box component
const StatBox: React.FC<{ label: string; value: string; subtext?: string; color?: string }> = ({
  label,
  value,
  subtext,
  color,
}) => (
  <Box flexDirection="column" paddingX={2}>
    <Text dimColor>{label}</Text>
    <Text bold color={color}>{value}</Text>
    {subtext && <Text dimColor>{subtext}</Text>}
  </Box>
);

// Holding row
const HoldingRow: React.FC<{
  symbol: string;
  shares: string;
  value: string;
  change: string;
}> = ({ symbol, shares, value, change }) => {
  const isPositive = change.startsWith('+') || !change.startsWith('-');
  return (
    <Box>
      <Box width={10}>
        <Text bold>{symbol}</Text>
      </Box>
      <Box width={12}>
        <Text dimColor>{shares}</Text>
      </Box>
      <Box width={12}>
        <Text>{value}</Text>
      </Box>
      <Box width={10}>
        <Text color={isPositive ? 'green' : 'red'}>{change}</Text>
      </Box>
    </Box>
  );
};

// Activity row
const ActivityRow: React.FC<{
  icon: string;
  description: string;
  amount: string;
  time: string;
}> = ({ icon, description, amount, time }) => {
  const isPositive = amount.startsWith('+');
  return (
    <Box>
      <Box width={3}>
        <Text>{icon}</Text>
      </Box>
      <Box width={24}>
        <Text>{description}</Text>
      </Box>
      <Box width={12}>
        <Text color={isPositive ? 'green' : 'red'}>{amount}</Text>
      </Box>
      <Box width={8}>
        <Text dimColor>{time}</Text>
      </Box>
    </Box>
  );
};

const PortfolioOverview = () => {
  return (
    <Box flexDirection="column" padding={1}>
      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* HEADER */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Box borderStyle="round" paddingX={2} paddingY={1}>
        <Row justify="between">
          <Stack gap={0}>
            <Text dimColor>Total Portfolio Value</Text>
            <Box gap={2}>
              <Text bold>$1,247,832.41</Text>
              <Text color="green">▲ $12,847.23 (+1.04%)</Text>
            </Box>
            <Text dimColor>Last updated Nov 29, 3:42 PM</Text>
          </Stack>

          <Row gap={1}>
            <Badge variant="success">● Live</Badge>
            <Button variant="outline">Deposit</Button>
            <Button variant="outline">Withdraw</Button>
            <Button variant="primary">Trade</Button>
          </Row>
        </Row>
      </Box>

      <Box height={1} />

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* STATS BAR */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Row justify="around">
        <StatBox label="Cash" value="$84,221" subtext="Available" />
        <Text dimColor>│</Text>
        <StatBox label="Day's P&L" value="+$12,847" color="green" subtext="+1.04%" />
        <Text dimColor>│</Text>
        <StatBox label="Total Return" value="+$247,832" color="green" subtext="+24.7%" />
        <Text dimColor>│</Text>
        <StatBox label="Positions" value="23" subtext="Holdings" />
        <Text dimColor>│</Text>
        <StatBox label="Buying Power" value="$168,442" />
      </Row>

      <Box height={1} />
      <Divider width={85} />
      <Box height={1} />

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT - Two Columns */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Row gap={2} align="top">
        {/* LEFT: Holdings */}
        <Box flexDirection="column" width="50%">
          <Panel title="Holdings">
            <Stack gap={0}>
              <Box>
                <Box width={10}><Text bold dimColor>Symbol</Text></Box>
                <Box width={12}><Text bold dimColor>Shares</Text></Box>
                <Box width={12}><Text bold dimColor>Value</Text></Box>
                <Box width={10}><Text bold dimColor>Today</Text></Box>
              </Box>
              <Divider width={42} />
              <HoldingRow symbol="AAPL" shares="245 sh" value="$142,847" change="+2.34%" />
              <HoldingRow symbol="MSFT" shares="312 sh" value="$128,442" change="+1.87%" />
              <HoldingRow symbol="GOOGL" shares="142 sh" value="$98,221" change="+0.92%" />
              <HoldingRow symbol="BRK.B" shares="87 sh" value="$87,442" change="-0.21%" />
              <HoldingRow symbol="VTI" shares="285 sh" value="$76,891" change="+1.12%" />
              <HoldingRow symbol="AMZN" shares="65 sh" value="$58,942" change="+1.45%" />
              <Divider width={42} />
              <Text dimColor>View all 23 holdings →</Text>
            </Stack>
          </Panel>
        </Box>

        {/* RIGHT: Activity */}
        <Box flexDirection="column" width="50%">
          <Panel title="Recent Activity">
            <Stack gap={0}>
              <Box>
                <Box width={3}><Text dimColor> </Text></Box>
                <Box width={24}><Text bold dimColor>Transaction</Text></Box>
                <Box width={12}><Text bold dimColor>Amount</Text></Box>
                <Box width={8}><Text bold dimColor>When</Text></Box>
              </Box>
              <Divider width={44} />
              <ActivityRow icon="💰" description="AAPL Dividend" amount="+$847.20" time="Today" />
              <ActivityRow icon="📈" description="Buy VTI" amount="-$3,631" time="1d ago" />
              <ActivityRow icon="📉" description="Sell TSLA" amount="+$3,528" time="2d ago" />
              <ActivityRow icon="⬇️" description="Deposit" amount="+$5,000" time="4d ago" />
              <ActivityRow icon="💰" description="MSFT Dividend" amount="+$412.50" time="1w ago" />
              <ActivityRow icon="📈" description="Buy GOOGL" amount="-$2,847" time="1w ago" />
              <Divider width={44} />
              <Text dimColor>View all activity →</Text>
            </Stack>
          </Panel>
        </Box>
      </Row>

      <Box height={1} />

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* FOOTER */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <Divider width={85} />
      <Row justify="between">
        <Text dimColor>Individual Brokerage ****4847</Text>
        <Row gap={3}>
          <Text dimColor>Statements</Text>
          <Text dimColor>Tax Documents</Text>
          <Text dimColor>Settings</Text>
        </Row>
      </Row>
    </Box>
  );
};

render(<PortfolioOverview />);
