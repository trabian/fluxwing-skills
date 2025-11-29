#!/usr/bin/env npx tsx
/**
 * Dashboard Design
 *
 * Run with: npx tsx examples/dashboard.tsx
 */

import React from 'react';
import { render, Box, Text } from 'ink';

import {
  Screen,
  Card,
  Panel,
  Stack,
  Row,
  Heading,
  Badge,
  Progress,
  Table,
  TabBar,
  Nav,
  NavItem,
  Breadcrumb,
  Alert,
  Divider,
  Button,
} from '../src/components/index.js';

const Dashboard = () => {
  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Row justify="between">
        <Heading level={1}>Dashboard</Heading>
        <Row gap={2}>
          <Badge variant="success">Online</Badge>
          <Text dimColor>John Doe</Text>
        </Row>
      </Row>

      <Breadcrumb items={['Home', 'Dashboard', 'Overview']} />

      <Box height={1} />

      {/* Tabs */}
      <TabBar
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'analytics', label: 'Analytics' },
          { id: 'reports', label: 'Reports' },
          { id: 'settings', label: 'Settings' },
        ]}
        active="overview"
      />

      <Box height={1} />

      {/* Alert */}
      <Alert type="info" title="System Update">
        Scheduled maintenance on Sunday 2am-4am EST
      </Alert>

      <Box height={1} />

      {/* Stats Row */}
      <Row gap={2}>
        <Card title="Revenue" padding={1}>
          <Heading level={2}>$24,500</Heading>
          <Text color="green">↑ 12% from last month</Text>
        </Card>

        <Card title="Users" padding={1}>
          <Heading level={2}>1,234</Heading>
          <Text color="green">↑ 8% from last month</Text>
        </Card>

        <Card title="Orders" padding={1}>
          <Heading level={2}>456</Heading>
          <Text color="red">↓ 3% from last month</Text>
        </Card>
      </Row>

      <Box height={1} />

      {/* Main Content */}
      <Row gap={2} align="top">
        {/* Table */}
        <Box flexDirection="column" flexGrow={1}>
          <Heading level={3}>Recent Orders</Heading>
          <Table
            columns={[
              { key: 'id', header: 'ID', width: 8 },
              { key: 'customer', header: 'Customer', width: 15 },
              { key: 'amount', header: 'Amount', width: 10, align: 'right' },
              { key: 'status', header: 'Status', width: 10 },
            ]}
            data={[
              { id: '#1234', customer: 'Alice Smith', amount: '$250.00', status: 'Completed' },
              { id: '#1235', customer: 'Bob Jones', amount: '$150.00', status: 'Pending' },
              { id: '#1236', customer: 'Carol White', amount: '$320.00', status: 'Shipped' },
              { id: '#1237', customer: 'David Brown', amount: '$89.00', status: 'Completed' },
            ]}
          />
        </Box>

        {/* Sidebar */}
        <Box flexDirection="column" width={25}>
          <Panel title="Quick Actions">
            <Stack gap={1}>
              <Button variant="primary" fullWidth>New Order</Button>
              <Button variant="outline" fullWidth>Export Data</Button>
              <Button variant="ghost" fullWidth>View Reports</Button>
            </Stack>
          </Panel>

          <Box height={1} />

          <Panel title="Progress">
            <Stack gap={1}>
              <Text>Monthly Goal</Text>
              <Progress value={72} width={18} />
              <Text dimColor>$72,000 / $100,000</Text>
            </Stack>
          </Panel>
        </Box>
      </Row>
    </Box>
  );
};

render(<Dashboard />);
