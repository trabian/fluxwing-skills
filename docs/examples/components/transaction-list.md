# Transaction List Template

## Standard View
```
╭────────────────────────────────────────────────────────────────────╮
│ {{title}}                                    Sort: {{sortBy}} ▼    │
├────────────────────────────────────────────────────────────────────┤
│ Date       │ Description              │ Category    │ Amount       │
├────────────────────────────────────────────────────────────────────┤
│ 10/13/2025 │ Customer Payment - ABC   │ Receivable  │ +$45,000.00 │
│ 10/13/2025 │ Vendor Payment - XYZ Inc │ Payable     │ -$12,500.00 │
│ 10/12/2025 │ Wire Transfer In         │ Transfer    │ +$100,000   │
│ 10/12/2025 │ Payroll Processing       │ Payroll     │ -$87,450.00 │
│ 10/11/2025 │ Credit Line Draw         │ Financing   │ +$250,000   │
│ 10/11/2025 │ Equipment Purchase       │ CapEx       │ -$65,000.00 │
│ 10/10/2025 │ Service Revenue          │ Revenue     │ +$28,750.00 │
│ 10/10/2025 │ Utilities Payment        │ Operating   │ -$3,240.50  │
│ 10/09/2025 │ Customer Deposit         │ Receivable  │ +$15,000.00 │
│ 10/09/2025 │ Insurance Premium        │ Operating   │ -$8,900.00  │
├────────────────────────────────────────────────────────────────────┤
│ Showing 10 of 247 transactions                  Load More...       │
╰────────────────────────────────────────────────────────────────────╯
```

## With Status Indicators
```
╭────────────────────────────────────────────────────────────────────╮
│ Recent Transactions                              Filter: All ▼     │
├────────────────────────────────────────────────────────────────────┤
│ Date       │ Description              │ Status      │ Amount       │
├────────────────────────────────────────────────────────────────────┤
│ 10/13/2025 │ Customer Payment - ABC   │ ✓ Posted    │ +$45,000.00 │
│ 10/13/2025 │ Vendor Payment - XYZ Inc │ ⧗ Pending   │ -$12,500.00 │
│ 10/12/2025 │ Wire Transfer In         │ ✓ Posted    │ +$100,000   │
│ 10/12/2025 │ Payroll Processing       │ ✓ Posted    │ -$87,450.00 │
│ 10/11/2025 │ Credit Line Draw         │ ⧗ Pending   │ +$250,000   │
│ 10/11/2025 │ Equipment Purchase       │ ✓ Posted    │ -$65,000.00 │
│ 10/10/2025 │ Service Revenue          │ ✓ Posted    │ +$28,750.00 │
│ 10/10/2025 │ Utilities Payment        │ ✓ Posted    │ -$3,240.50  │
╰────────────────────────────────────────────────────────────────────╯
```

## Grouped by Date
```
╭────────────────────────────────────────────────────────────────────╮
│ Transaction History                                                │
├────────────────────────────────────────────────────────────────────┤
│ Today - October 13, 2025                            Net: +$32,500  │
├────────────────────────────────────────────────────────────────────┤
│  Customer Payment - ABC Corp          Receivable    +$45,000.00    │
│  Vendor Payment - XYZ Inc            Payable       -$12,500.00    │
│                                                                    │
│ Yesterday - October 12, 2025                        Net: +$12,550  │
├────────────────────────────────────────────────────────────────────┤
│  Wire Transfer In                    Transfer      +$100,000.00    │
│  Payroll Processing                  Payroll       -$87,450.00    │
│                                                                    │
│ October 11, 2025                                   Net: +$185,000  │
├────────────────────────────────────────────────────────────────────┤
│  Credit Line Draw                    Financing     +$250,000.00    │
│  Equipment Purchase                  CapEx         -$65,000.00    │
╰────────────────────────────────────────────────────────────────────╯
```

## Compact View
```
╭────────────────────────────────────────────────────────────────────╮
│ Recent Activity                                                    │
├────────────────────────────────────────────────────────────────────┤
│ 10/13  Customer Payment - ABC                          +$45,000.00│
│ 10/13  Vendor Payment - XYZ                            -$12,500.00│
│ 10/12  Wire Transfer In                               +$100,000.00│
│ 10/12  Payroll Processing                              -$87,450.00│
│ 10/11  Credit Line Draw                               +$250,000.00│
│ 10/11  Equipment Purchase                              -$65,000.00│
│ 10/10  Service Revenue                                 +$28,750.00│
│ 10/10  Utilities Payment                                -$3,240.50│
├────────────────────────────────────────────────────────────────────┤
│ 8 transactions shown                                               │
╰────────────────────────────────────────────────────────────────────╯
```

## With Running Balance
```
╭────────────────────────────────────────────────────────────────────╮
│ Transaction History with Balance                                   │
├────────────────────────────────────────────────────────────────────┤
│ Date       │ Description              │ Amount       │ Balance     │
├────────────────────────────────────────────────────────────────────┤
│ 10/13/2025 │ Customer Payment         │ +$45,000.00  │ $2,458,392 │
│ 10/13/2025 │ Vendor Payment           │ -$12,500.00  │ $2,413,392 │
│ 10/12/2025 │ Wire Transfer In         │ +$100,000.00 │ $2,425,892 │
│ 10/12/2025 │ Payroll Processing       │ -$87,450.00  │ $2,325,892 │
│ 10/11/2025 │ Credit Line Draw         │ +$250,000.00 │ $2,413,342 │
│ 10/11/2025 │ Equipment Purchase       │ -$65,000.00  │ $2,163,342 │
│ 10/10/2025 │ Service Revenue          │ +$28,750.00  │ $2,228,342 │
│ 10/10/2025 │ Utilities Payment        │ -$3,240.50   │ $2,199,592 │
├────────────────────────────────────────────────────────────────────┤
│ Period total: +$255,559.50                                         │
╰────────────────────────────────────────────────────────────────────╯
```

## Empty State
```
╭────────────────────────────────────────────────────────────────────╮
│ Recent Transactions                                                │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│                         No transactions found                      │
│                                                                    │
│              Try adjusting your filters or date range              │
│                                                                    │
╰────────────────────────────────────────────────────────────────────╯
```

## Usage

The transaction list displays banking transactions with:
- **Date**: Transaction date
- **Description**: Transaction details
- **Category**: Transaction classification
- **Status**: Posted, Pending, Failed indicators
- **Amount**: Transaction value (+ for inflows, - for outflows)
- **Balance**: Running balance (optional)

Features:
- Sorting by any column
- Filtering by type (all, inflow, outflow, pending)
- Grouping by date
- Pagination/load more
- Selection for bulk actions
- Status indicators with icons
