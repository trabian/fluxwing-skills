# Date Range Picker Template

## Closed State
```
Date Range
┌─────────────────────────────────┐
│ Last 30 Days 📅 ▼              │
└─────────────────────────────────┘
```

## Open with Presets
```
Date Range
┌─────────────────────────────────┐
│ Last 30 Days 📅 ▲              │
├─────────────────────────────────┤
│   Today                         │
│   Last 7 Days                   │
│ ● Last 30 Days                  │
│   Last 90 Days                  │
│   This Month                    │
│   Last Month                    │
│   This Quarter                  │
│   This Year                     │
│   Custom Range...               │
└─────────────────────────────────┘
```

## Custom Date Selection
```
Date Range: Custom
┌─────────────────────────────────────────────┐
│ From: 09/14/2025  To: 10/13/2025           │
├─────────────────────────────────────────────┤
│     September 2025      October 2025        │
│  S  M  T  W  T  F  S   S  M  T  W  T  F  S │
│        1  2  3  4  5            1  2  3  4  │
│  6  7  8  9 10 11 12   5  6  7  8  9 10 11 │
│ 13[14]15 16 17 18 19  12[13]14 15 16 17 18 │
│ 20 21 22 23 24 25 26  19 20 21 22 23 24 25 │
│ 27 28 29 30           26 27 28 29 30 31    │
│                                             │
│         [ Cancel ]    [ Apply Range ]       │
└─────────────────────────────────────────────┘
```

## Compact View
```
📅 10/01/2025 - 10/13/2025 ▼
```

## With Quick Actions
```
Date Range
┌─────────────────────────────────┐
│ 09/14/2025 - 10/13/2025 ▼      │
├─────────────────────────────────┤
│ Quick Select:                   │
│ ┌──────┐ ┌──────┐ ┌──────┐     │
│ │ 7D   │ │ 30D  │ │ 90D  │     │
│ └──────┘ └──────┘ └──────┘     │
│                                 │
│ Presets:                        │
│ • Today                         │
│ • Yesterday                     │
│ • This Week                     │
│ • This Month                    │
│ • This Quarter                  │
│ • This Year                     │
│ • Custom...                     │
└─────────────────────────────────┘
```

## Inline Display (Header)
```
Viewing: Last 30 Days (09/14/2025 - 10/13/2025) [Change]
```

## With Comparison
```
Date Range (Compare Mode)
┌─────────────────────────────────┐
│ Current:  09/14 - 10/13         │
│ Compare:  08/14 - 09/13         │
│                                 │
│ ☑ Enable Comparison             │
│                                 │
│ Compare to:                     │
│ ○ Previous Period               │
│ ● Same Period Last Year         │
│ ○ Custom Period                 │
└─────────────────────────────────┘
```

## Usage

The date range picker allows users to:
- **Select preset ranges**: Common time periods (7d, 30d, etc.)
- **Custom date selection**: Pick specific start and end dates
- **Quick actions**: Fast selection buttons for common ranges
- **Comparison mode**: Compare current period to another period

Preset ranges automatically calculate:
- "Today": Current day
- "Last 7 Days": Past week from today
- "Last 30 Days": Past month from today
- "This Month": 1st to current day of current month
- "This Quarter": Start of quarter to current day
- "This Year": Jan 1 to current day

Date format can be customized:
- MM/DD/YYYY (US format)
- DD/MM/YYYY (International)
- YYYY-MM-DD (ISO format)

The picker:
- Validates date ranges
- Enforces max range limits
- Highlights selected dates
- Shows current selection in closed state
- Supports keyboard navigation
