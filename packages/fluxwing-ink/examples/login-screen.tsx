#!/usr/bin/env npx tsx
/**
 * Login Screen Design
 *
 * Run with: npx tsx examples/login-screen.tsx
 */

import React from 'react';
import { render, Box, Text } from 'ink';

// Import our design components
import {
  Card,
  Stack,
  Row,
  Heading,
  Input,
  Button,
  ButtonGroup,
  Divider,
  Link,
  Checkbox,
} from '../src/components/index.js';

const LoginScreen = () => {
  return (
    <Box flexDirection="column" padding={1}>
      <Card border="round">
        <Stack gap={1}>
          {/* Header */}
          <Heading level={1} align="center">Welcome Back</Heading>
          <Text dimColor>Sign in to your account to continue</Text>

          {/* Spacer */}
          <Box height={1} />

          {/* Email Input */}
          <Input
            label="Email"
            placeholder="you@example.com"
            type="email"
            width={35}
          />

          {/* Password Input */}
          <Input
            label="Password"
            type="password"
            value="secretpass"
            width={35}
          />

          {/* Remember me + Forgot password */}
          <Row justify="between">
            <Checkbox label="Remember me" checked />
            <Link>Forgot password?</Link>
          </Row>

          {/* Spacer */}
          <Box height={1} />

          {/* Submit Button */}
          <Button variant="primary" fullWidth>
            Sign In
          </Button>

          {/* Divider with "or" text */}
          <Row gap={1} justify="center">
            <Divider width={12} />
            <Text dimColor>or</Text>
            <Divider width={12} />
          </Row>

          {/* Social Login */}
          <ButtonGroup gap={2}>
            <Button variant="outline" icon="google">
              Google
            </Button>
            <Button variant="outline" icon="github">
              GitHub
            </Button>
          </ButtonGroup>

          {/* Sign up link */}
          <Box height={1} />
          <Box justifyContent="center">
            <Text dimColor>Don't have an account? </Text>
            <Link>Sign up</Link>
          </Box>
        </Stack>
      </Card>
    </Box>
  );
};

// Render the design
render(<LoginScreen />);
