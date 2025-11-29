#!/usr/bin/env npx tsx
/**
 * Component Showcase
 *
 * Displays all available components for reference
 * Run with: npx tsx examples/component-showcase.tsx
 */

import React from 'react';
import { render, Box, Text } from 'ink';

import {
  Heading,
  Label,
  Link,
  Button,
  ButtonGroup,
  Input,
  TextArea,
  Select,
  Checkbox,
  Radio,
  Card,
  Panel,
  Stack,
  Row,
  Divider,
  Alert,
  Badge,
  Progress,
  Spinner,
  Toast,
  Table,
  List,
  TabBar,
  Breadcrumb,
  Pagination,
} from '../src/components/index.js';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Box flexDirection="column" marginBottom={1}>
    <Heading level={2}>{title}</Heading>
    <Divider width={50} style="dashed" />
    <Box height={1} />
    {children}
    <Box height={1} />
  </Box>
);

const ComponentShowcase = () => {
  return (
    <Box flexDirection="column" padding={1}>
      <Heading level={1}>Fluxwing Ink Component Library</Heading>
      <Text dimColor>A complete UI design system for terminal rendering</Text>
      <Box height={2} />

      {/* Typography */}
      <Section title="Typography">
        <Stack gap={0}>
          <Heading level={1}>Heading 1</Heading>
          <Heading level={2}>Heading 2</Heading>
          <Heading level={3}>Heading 3</Heading>
          <Text>Regular text</Text>
          <Text bold>Bold text</Text>
          <Text italic>Italic text</Text>
          <Label>Label text</Label>
          <Link>Link text</Link>
        </Stack>
      </Section>

      {/* Buttons */}
      <Section title="Buttons">
        <Stack gap={1}>
          <Row gap={2}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
          </Row>
          <Row gap={2}>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button disabled>Disabled</Button>
          </Row>
          <Row gap={2}>
            <Button icon="check">With Icon</Button>
            <Button variant="outline" icon="arrow">Arrow</Button>
          </Row>
        </Stack>
      </Section>

      {/* Inputs */}
      <Section title="Form Inputs">
        <Row gap={2} align="top">
          <Stack gap={1}>
            <Input label="Default" placeholder="Enter text..." width={25} />
            <Input label="With Value" value="Hello World" width={25} />
            <Input label="Password" type="password" value="secret" width={25} />
          </Stack>
          <Stack gap={1}>
            <Input label="Focused" state="focus" value="Focused input" width={25} />
            <Input label="Error" state="error" error="Invalid input" width={25} />
            <Input label="Disabled" state="disabled" value="Disabled" width={25} />
          </Stack>
        </Row>
      </Section>

      {/* Selects & Toggles */}
      <Section title="Selects & Toggles">
        <Row gap={3} align="top">
          <Select
            label="Dropdown"
            options={[
              { value: '1', label: 'Option 1' },
              { value: '2', label: 'Option 2' },
            ]}
            selected="1"
            width={25}
          />
          <Stack gap={0}>
            <Text bold>Checkboxes</Text>
            <Checkbox label="Option A" checked />
            <Checkbox label="Option B" />
            <Checkbox label="Disabled" disabled />
          </Stack>
          <Stack gap={0}>
            <Text bold>Radio Buttons</Text>
            <Radio label="Choice 1" selected />
            <Radio label="Choice 2" />
            <Radio label="Choice 3" />
          </Stack>
        </Row>
      </Section>

      {/* Feedback */}
      <Section title="Feedback">
        <Stack gap={1}>
          <Row gap={2}>
            <Badge>Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
          </Row>

          <Row gap={2}>
            <Progress value={25} width={15} />
            <Progress value={50} width={15} />
            <Progress value={75} width={15} />
            <Progress value={100} width={15} />
          </Row>

          <Spinner label="Loading..." />
        </Stack>
      </Section>

      {/* Alerts */}
      <Section title="Alerts">
        <Stack gap={1}>
          <Alert type="info" title="Information">This is an info message</Alert>
          <Alert type="success" title="Success">Operation completed</Alert>
          <Alert type="warning" title="Warning">Please review this</Alert>
          <Alert type="error" title="Error">Something went wrong</Alert>
        </Stack>
      </Section>

      {/* Navigation */}
      <Section title="Navigation">
        <Stack gap={1}>
          <Breadcrumb items={['Home', 'Products', 'Electronics', 'Phones']} />
          <TabBar
            tabs={[
              { id: 'tab1', label: 'Tab 1' },
              { id: 'tab2', label: 'Tab 2' },
              { id: 'tab3', label: 'Tab 3' },
            ]}
            active="tab1"
          />
          <Pagination current={5} total={20} />
        </Stack>
      </Section>

      {/* Data Display */}
      <Section title="Data Display">
        <Row gap={3} align="top">
          <Table
            columns={[
              { key: 'name', header: 'Name', width: 12 },
              { key: 'role', header: 'Role', width: 10 },
              { key: 'status', header: 'Status', width: 8 },
            ]}
            data={[
              { name: 'Alice', role: 'Admin', status: 'Active' },
              { name: 'Bob', role: 'User', status: 'Pending' },
              { name: 'Carol', role: 'Editor', status: 'Active' },
            ]}
          />
          <List
            items={[
              { label: 'First item', value: 'Value 1' },
              { label: 'Second item', value: 'Value 2' },
              { label: 'Third item' },
              { label: 'Fourth item', icon: '→' },
            ]}
          />
        </Row>
      </Section>

      {/* Containers */}
      <Section title="Containers">
        <Row gap={2} align="top">
          <Card title="Card Component" padding={1}>
            <Text>Card content goes here</Text>
            <Text dimColor>With rounded borders</Text>
          </Card>
          <Panel title="Panel Component">
            <Text>Panel content</Text>
            <Text dimColor>With single borders</Text>
          </Panel>
        </Row>
      </Section>

      <Box height={1} />
      <Divider width={60} />
      <Text dimColor>End of Component Showcase</Text>
    </Box>
  );
};

render(<ComponentShowcase />);
