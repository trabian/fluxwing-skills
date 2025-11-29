#!/usr/bin/env npx tsx
/**
 * Settings Form Design
 *
 * Run with: npx tsx examples/settings-form.tsx
 */

import React from 'react';
import { render, Box, Text } from 'ink';

import {
  Card,
  Stack,
  Row,
  Heading,
  Input,
  TextArea,
  Select,
  Checkbox,
  Radio,
  Button,
  ButtonGroup,
  Divider,
  Alert,
  Badge,
} from '../src/components/index.js';

const SettingsForm = () => {
  return (
    <Box flexDirection="column" padding={1}>
      <Row justify="between">
        <Heading level={1}>Account Settings</Heading>
        <Badge variant="info">Pro Plan</Badge>
      </Row>

      <Box height={1} />

      <Card border="round">
        <Stack gap={1}>
          {/* Profile Section */}
          <Heading level={2}>Profile Information</Heading>
          <Divider width={40} />

          <Row gap={2}>
            <Input
              label="First Name"
              value="John"
              width={20}
            />
            <Input
              label="Last Name"
              value="Doe"
              width={20}
            />
          </Row>

          <Input
            label="Email Address"
            value="john.doe@example.com"
            type="email"
            width={42}
          />

          <TextArea
            label="Bio"
            placeholder="Tell us about yourself..."
            value="Software developer passionate about building great products."
            width={42}
            rows={3}
          />

          <Box height={1} />

          {/* Preferences Section */}
          <Heading level={2}>Preferences</Heading>
          <Divider width={40} />

          <Select
            label="Language"
            options={[
              { value: 'en', label: 'English' },
              { value: 'es', label: 'Spanish' },
              { value: 'fr', label: 'French' },
            ]}
            selected="en"
            width={42}
          />

          <Select
            label="Timezone"
            options={[
              { value: 'est', label: 'Eastern Time (EST)' },
              { value: 'pst', label: 'Pacific Time (PST)' },
              { value: 'utc', label: 'UTC' },
            ]}
            selected="est"
            width={42}
          />

          <Box height={1} />

          {/* Notifications Section */}
          <Heading level={2}>Notifications</Heading>
          <Divider width={40} />

          <Stack gap={0}>
            <Checkbox label="Email notifications" checked />
            <Checkbox label="Push notifications" checked />
            <Checkbox label="SMS notifications" />
            <Checkbox label="Weekly digest" checked />
          </Stack>

          <Box height={1} />

          {/* Theme Section */}
          <Heading level={2}>Theme</Heading>
          <Divider width={40} />

          <Stack gap={0}>
            <Radio label="Light mode" selected />
            <Radio label="Dark mode" />
            <Radio label="System default" />
          </Stack>

          <Box height={1} />

          {/* Danger Zone */}
          <Alert type="warning" title="Danger Zone">
            Actions here cannot be undone
          </Alert>

          <Row gap={2}>
            <Button variant="outline">Export Data</Button>
            <Button variant="danger">Delete Account</Button>
          </Row>

          <Box height={1} />
          <Divider width={40} />

          {/* Actions */}
          <Row justify="end" gap={2}>
            <Button variant="ghost">Cancel</Button>
            <Button variant="primary">Save Changes</Button>
          </Row>
        </Stack>
      </Card>
    </Box>
  );
};

render(<SettingsForm />);
