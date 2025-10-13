# Cash Flow Chart Template

## Line Chart with Legend
```
╭────────────────────────────────────────────────────────────────────╮
│ {{title}}                                                          │
│ Legend: ─── Inflows  ··· Outflows  ═══ Net                       │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│ 3M │                                    ╱───╲                      │
│    │                          ╱────────╱     ╲                     │
│ 2M │                    ╱────╱                ╲                    │
│    │              ╱────╱                       ──╲                 │
│ 1M │        ╱────╱                                ╲                │
│    │   ────╱                                       ───╲            │
│  0 ├────·····················································────  │
│    │     ·····                                           ·····    │
│-1M │          ·····                                   ·····        │
│    │               ·····                         ·····             │
│-2M │                    ·····               ·····                  │
│    │                         ·····     ·····                       │
│-3M │                              ═════                            │
│    │                                                                │
│    └────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬──────│
│        Week Week Week Week Week Week Week Week Week Week Week Week │
│         1    5    9   13   17   21   25   29   33   37   41   45  │
╰────────────────────────────────────────────────────────────────────╯
```

## Simplified Bar Chart
```
╭────────────────────────────────────────────────────────────────────╮
│ 30-Day Cash Flow Summary                                          │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│ Inflows    │████████████████████████████████████│ $2.4M          │
│            │                                                       │
│ Outflows   │██████████████████████████│ $1.8M                     │
│            │                                                       │
│ Net Flow   │████████████│ +$612K                                  │
│            │                                                       │
├────────────────────────────────────────────────────────────────────┤
│ Average daily: +$20.4K  │  Best day: +$89K  │  Worst day: -$12K  │
╰────────────────────────────────────────────────────────────────────╯
```

## Trend with Data Points
```
╭────────────────────────────────────────────────────────────────────╮
│ 7-Day Cash Flow Trend                                             │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│ $800K │                                                   ●        │
│       │                                          ●                 │
│ $600K │                                 ●                          │
│       │                        ●                                   │
│ $400K │               ●                                            │
│       │      ●                                                     │
│ $200K │ ●                                                          │
│       │                                                            │
│    $0 ├────────────────────────────────────────────────────────── │
│       │                                                            │
│       Mon    Tue    Wed    Thu    Fri    Sat    Sun               │
│       10/7  10/8   10/9   10/10  10/11  10/12  10/13              │
│                                                                    │
│       Current: $752K  │  Change: +$189K (+33.6%)                  │
╰────────────────────────────────────────────────────────────────────╯
```

## Multi-Line Comparison
```
╭────────────────────────────────────────────────────────────────────╮
│ Cash Position vs. Forecast                                        │
│ ─── Actual   - - - Forecast                                       │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│ $3M │                         ────────                             │
│     │                    ─────        ────                         │
│ $2M │               ─────                  ─────                   │
│     │          ─────    - - -                   ─────              │
│ $1M │     ─────    - - -       - - -                 ────          │
│     │ ────    - - -                 - - -                          │
│  0  ├────────────────────────────────────────────────────────────  │
│     │                                                               │
│     │ Q1        Q2        Q3        Q4                             │
│     │ Jan-Mar   Apr-Jun   Jul-Sep   Oct-Dec                       │
│     │                                                               │
│     │ Variance: -2.3%  │  Trend: Improving                         │
╰────────────────────────────────────────────────────────────────────╯
```

## Usage

The cash flow chart visualizes cash flow data with:
- **Title**: Chart heading
- **Legend**: Visual key for different data series
- **Grid**: Optional gridlines for easier reading
- **Data Points**: Values plotted over time
- **Axes**: Time (X-axis) and Amount (Y-axis)
- **Summary Stats**: Key metrics below the chart

Chart types:
- `line`: Continuous line showing trends
- `bar`: Horizontal or vertical bars for comparisons
- `area`: Filled area under the line

The chart automatically scales based on data range and displays appropriate currency formatting.
