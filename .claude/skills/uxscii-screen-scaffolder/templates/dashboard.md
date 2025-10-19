# Dashboard

Main application dashboard with key metrics and recent activity.

## Layout

```
╭──────────────────────────────────────────────────────────────────────────────╮
│ {{title}}                                                     {{userName}} ▼  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  {{greeting}}                                                                │
│                                                                              │
│  ╭───────────────────╮  ╭───────────────────╮  ╭──────────────────────╮    │
│  │ {{metricCard1}}   │  │ {{metricCard2}}   │  │ {{metricCard3}}      │    │
│  ╰───────────────────╯  ╰───────────────────╯  ╰──────────────────────╯    │
│                                                                              │
│  {{recentActivityTitle}}                                                     │
│  ╭────────────────────────────────────────────────────────────────────────╮ │
│  │ {{activityList}}                                                       │ │
│  ╰────────────────────────────────────────────────────────────────────────╯ │
│                                                                              │
╰──────────────────────────────────────────────────────────────────────────────╯
```

## Components Used

- **navigation**: Top navigation bar with user menu
- **card**: Metric cards for key statistics (3x)
- **badge**: Status indicators and trend arrows
- **list**: Recent activity feed

## States

### Loaded State
Dashboard fully loaded with all data displayed.

### Loading State
While fetching dashboard data - shows spinner.

### Error State
When data fetch fails - shows error message.

## Variables

- `title` (string): Dashboard title
- `userName` (string): Current user's name
- `greeting` (string): Personalized greeting
- `metricCard1` (component): First metric card (e.g., Revenue)
- `metricCard2` (component): Second metric card (e.g., Users)
- `metricCard3` (component): Third metric card (e.g., Growth)
- `recentActivityTitle` (string): Activity section header
- `activityList` (component): List of recent activities

## User Flows

1. User logs in and lands on dashboard
2. Dashboard loads metrics and activity data
3. User can click metric cards for detailed views
4. User can interact with activity items
5. User can access navigation menu via dropdown

## Accessibility

- **Role**: main
- **ARIA Label**: "Dashboard main content"
- **Keyboard**: Tab navigation through interactive elements
- **Screen Reader**: All metrics and activities properly labeled
