# Dashboard - Rendered Example

This shows the actual dashboard with realistic metrics and activity data.

## Loaded State (Default)

```
╭──────────────────────────────────────────────────────────────────────────────╮
│ Dashboard                                                  Sarah Johnson ▼   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Welcome back, Sarah! Here's what's happening today.                         │
│                                                                              │
│  ╭───────────────────╮  ╭───────────────────╮  ╭──────────────────────╮    │
│  │ Revenue           │  │ Active Users      │  │ Growth               │    │
│  │ ─────────────────  │  │ ─────────────────  │  │ ───────────────────   │    │
│  │ $24,567           │  │ 1,234             │  │ +12.5%               │    │
│  │ +8.3% ↗           │  │ +45 today         │  │ MoM                  │    │
│  ╰───────────────────╯  ╰───────────────────╯  ╰──────────────────────╯    │
│                                                                              │
│  Recent Activity                                                             │
│  ╭────────────────────────────────────────────────────────────────────────╮ │
│  │ • John Doe signed up                              2 minutes ago       │ │
│  │ • New order #1234 received                       5 minutes ago       │ │
│  │ • Sarah Johnson updated profile                  8 minutes ago       │ │
│  │ • Mike Smith completed onboarding               15 minutes ago       │ │
│  │ • System backup completed successfully          22 minutes ago       │ │
│  ╰────────────────────────────────────────────────────────────────────────╯ │
│                                                                              │
╰──────────────────────────────────────────────────────────────────────────────╯
```

## Loading State

```
╭──────────────────────────────────────────────────────────────────────────────╮
│ Dashboard                                                  Sarah Johnson ▼   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                                                                              │
│                          ⠋ Loading dashboard...                             │
│                                                                              │
│                                                                              │
╰──────────────────────────────────────────────────────────────────────────────╯
```

## Data Context

This example demonstrates:

### User Information
- **User**: Sarah Johnson (logged in)
- **Time**: October 11, 2024, 3:45 PM
- **Greeting**: Personalized with name and time-appropriate message

### Metric Cards

**Card 1: Revenue**
- Value: $24,567 (monthly revenue)
- Trend: +8.3% ↗ (positive growth from last month)
- Visual: Green trend indicator

**Card 2: Active Users**
- Value: 1,234 (total active users)
- Change: +45 today (new users today)
- Visual: User count with daily change

**Card 3: Growth**
- Value: +12.5% (percentage growth)
- Period: MoM (month over month)
- Visual: Growth percentage

### Recent Activity

Real activity entries with timestamps:
1. **John Doe signed up** - 2 minutes ago
2. **New order #1234 received** - 5 minutes ago
3. **Sarah Johnson updated profile** - 8 minutes ago
4. **Mike Smith completed onboarding** - 15 minutes ago
5. **System backup completed successfully** - 22 minutes ago

## User Flow Demonstration

### Step 1: Login Complete
User successfully authenticates
→ Dashboard loads

### Step 2: Data Fetch
System retrieves:
- Latest metrics
- Recent activity
- User preferences

### Step 3: Display
Dashboard renders with:
- Personalized greeting
- Current metrics with trends
- Real-time activity feed

### Step 4: Interaction
User can:
- Click metric cards for details
- Click activity items for context
- Access user menu via dropdown
- Navigate to other sections

## Components Breakdown

This screen composition includes:

1. **Top Bar**
   - Dashboard title (left)
   - User dropdown menu (right): "Sarah Johnson ▼"

2. **Greeting Section**
   - Personalized message: "Welcome back, Sarah!"
   - Context: "Here's what's happening today."

3. **Metric Cards (3x)** (component: card)
   - **Revenue Card**
     - Title: "Revenue"
     - Value: "$24,567"
     - Trend: "+8.3% ↗" (badge with arrow)

   - **Users Card**
     - Title: "Active Users"
     - Value: "1,234"
     - Change: "+45 today"

   - **Growth Card**
     - Title: "Growth"
     - Value: "+12.5%"
     - Period: "MoM"

4. **Activity Section**
   - Header: "Recent Activity"
   - List (component: list)
     - 5 recent items
     - Each with description and timestamp
     - Bullet formatting for clarity

## Design Notes

- **Information Hierarchy**: Most important metrics (revenue) comes first
- **Visual Grouping**: Cards use consistent styling and spacing
- **Real-time Feel**: Recent timestamps show system is live
- **Scanability**: Bullet points and clear labels make scanning easy
- **Trend Indicators**: Arrows (↗) and percentages show direction quickly
- **Whitespace**: Generous padding prevents cramped feeling

## Trend Indicators Explained

- **↗** (up-right arrow): Positive trend, growth
- **→** (right arrow): Flat, no change
- **↘** (down-right arrow): Negative trend, decline
- **+X%**: Positive percentage change (green context)
- **-X%**: Negative percentage change (red context)

## Time-based Data

All timestamps are relative:
- "2 minutes ago" - Very recent
- "5 minutes ago" - Recent
- "15 minutes ago" - Somewhat recent
- "22 minutes ago" - Less recent

This creates a sense of real-time activity.

## Accessibility Features

- Clear heading hierarchy (Dashboard → sections)
- Metric values announced with context
- Activity items in semantic list
- Keyboard navigation: Tab through cards and items
- Screen reader: Trends and timestamps properly announced
- High contrast for trend indicators

## State Transitions

1. **Initial Load** → Loading spinner shown
2. **Data Fetched** → Transition to loaded state
3. **Error Occurs** → Show error message, retry button
4. **User Clicks Card** → Navigate to detail view
5. **New Activity** → Update activity list (real-time)

This rendered example shows exactly how a production dashboard appears with real data!
