#!/usr/bin/env npx tsx
/**
 * Portfolio Overview - Wealth Management App
 *
 * Design iteration 1
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
  Progress,
  Table,
  Divider,
  Button,
} from '../src/components/index.js';

const PortfolioOverview = () => {
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
          <Button variant="outline">Refresh</Button>
        </Row>
      </Row>

      <Box height={1} />

      {/* Account Summary */}
      <Row gap={2}>
        <Card title="Total Value" padding={1}>
          <Heading level={2}>$1,247,832.41</Heading>
          <Text color="green">+$12,847.23 (+1.04%) today</Text>
        </Card>

        <Card title="Cash Available" padding={1}>
          <Heading level={2}>$84,221.00</Heading>
          <Text dimColor>Ready to invest</Text>
        </Card>

        <Card title="Day's Gain/Loss" padding={1}>
          <Heading level={2}>+$12,847.23</Heading>
          <Text color="green">↑ 1.04%</Text>
        </Card>
      </Row>

      <Box height={1} />

      {/* Main Content */}
      <Row gap={2} align="top">
        {/* Asset Allocation */}
        <Panel title="Asset Allocation">
          <Stack gap={1}>
            <Row justify="between">
              <Text>US Equities</Text>
              <Text>45%</Text>
            </Row>
            <Progress value={45} width={25} showLabel={false} />

            <Row justify="between">
              <Text>International</Text>
              <Text>20%</Text>
            </Row>
            <Progress value={20} width={25} showLabel={false} />

            <Row justify="between">
              <Text>Fixed Income</Text>
              <Text>25%</Text>
            </Row>
            <Progress value={25} width={25} showLabel={false} />

            <Row justify="between">
              <Text>Alternatives</Text>
              <Text>7%</Text>
            </Row>
            <Progress value={7} width={25} showLabel={false} />

            <Row justify="between">
              <Text>Cash</Text>
              <Text>3%</Text>
            </Row>
            <Progress value={3} width={25} showLabel={false} />
          </Stack>
        </Panel>

        {/* Top Holdings */}
        <Box flexDirection="column" flexGrow={1}>
          <Heading level={3}>Top Holdings</Heading>
          <Table
            columns={[
              { key: 'symbol', header: 'Symbol', width: 8 },
              { key: 'name', header: 'Name', width: 20 },
              { key: 'value', header: 'Value', width: 12, align: 'right' },
              { key: 'change', header: 'Change', width: 10, align: 'right' },
            ]}
            data={[
              { symbol: 'AAPL', name: 'Apple Inc.', value: '$142,847', change: '+2.34%' },
              { symbol: 'MSFT', name: 'Microsoft Corp', value: '$128,442', change: '+1.87%' },
              { symbol: 'GOOGL', name: 'Alphabet Inc.', value: '$98,221', change: '+0.92%' },
              { symbol: 'BRK.B', name: 'Berkshire Hath.', value: '$87,442', change: '-0.21%' },
              { symbol: 'VTI', name: 'Vanguard Total', value: '$76,891', change: '+1.12%' },
            ]}
          />
        </Box>
      </Row>

      <Box height={1} />

      {/* Recent Transactions */}
      <Heading level={3}>Recent Transactions</Heading>
      <Table
        columns={[
          { key: 'date', header: 'Date', width: 12 },
          { key: 'type', header: 'Type', width: 10 },
          { key: 'description', header: 'Description', width: 30 },
          { key: 'amount', header: 'Amount', width: 14, align: 'right' },
        ]}
        data={[
          { date: 'Nov 29', type: 'Dividend', description: 'AAPL Quarterly Dividend', amount: '+$847.20' },
          { date: 'Nov 28', type: 'Buy', description: 'VTI - 15 shares @ $242.11', amount: '-$3,631.65' },
          { date: 'Nov 27', type: 'Sell', description: 'TSLA - 10 shares @ $352.80', amount: '+$3,528.00' },
          { date: 'Nov 25', type: 'Transfer', description: 'ACH Deposit', amount: '+$5,000.00' },
        ]}
      />

      <Box height={1} />
      <Divider width={80} />
      <Row justify="between">
        <Text dimColor>Account #****4847 • Brokerage</Text>
        <Row gap={2}>
          <Button variant="ghost">Statements</Button>
          <Button variant="ghost">Tax Documents</Button>
          <Button variant="primary">Trade</Button>
        </Row>
      </Row>
    </Box>
  );
};

render(<PortfolioOverview />);
