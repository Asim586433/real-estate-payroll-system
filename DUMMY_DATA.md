# Real Estate Payroll System - Dummy Data Documentation

## Overview

The system has been populated with comprehensive dummy data to demonstrate all features and functionality. This document outlines what data has been seeded and how to use it.

## Seeded Data Summary

### Employees (12 Total)
The system includes 12 sample real estate agents with varying commission rates:

| Name | Email | Commission Rate | Status |
|------|-------|-----------------|--------|
| Sarah Johnson | sarah.johnson@realestate.com | 5.0% | Active |
| Michael Chen | michael.chen@realestate.com | 5.5% | Active |
| Jessica Williams | jessica.williams@realestate.com | 4.8% | Active |
| David Martinez | david.martinez@realestate.com | 5.2% | Active |
| Emily Thompson | emily.thompson@realestate.com | 5.1% | Active |
| Robert Anderson | robert.anderson@realestate.com | 5.4% | Active |
| Amanda Davis | amanda.davis@realestate.com | 4.9% | Active |
| Christopher Brown | christopher.brown@realestate.com | 5.3% | Active |
| Lisa Wilson | lisa.wilson@realestate.com | 5.0% | Active |
| James Taylor | james.taylor@realestate.com | 5.6% | Active |
| Michelle Garcia | michelle.garcia@realestate.com | 4.95% | Active |
| Daniel Rodriguez | daniel.rodriguez@realestate.com | 5.25% | Active |

### Commission Rates (4 Total)
Different commission rate structures for various property types:

1. **Standard Rate** - 5.0% for residential properties
2. **Premium Rate** - 6.0% for high-value properties (>$500k)
3. **Starter Rate** - 4.0% for new agents (<$250k)
4. **Commercial Rate** - 5.5% for commercial properties

### Tax Settings
Federal tax configuration for 2024:
- Federal Tax Rate: 12%
- State Tax Rate: 5%
- Local Tax Rate: 2%
- Social Security Rate: 6.2%
- Medicare Rate: 1.45%

### Payroll Periods (6 Total)
Monthly payroll periods from January to June 2024:
- January 2024 (Closed)
- February 2024 (Closed)
- March 2024 (Closed)
- April 2024 (Closed)
- May 2024 (Closed)
- June 2024 (Closed)

### Transactions (60 Total)
60 property sales distributed across:
- **Sale Amounts**: $250,000 to $2,150,000
- **Properties**: 15 different California properties (San Francisco, Los Angeles, San Diego, etc.)
- **Commission Rates**: 5.0% to 6.0%
- **Status**: All marked as "Completed"

**Sample Transaction Data:**
- Property addresses in major California cities
- Realistic sale amounts ranging from $250k to $2.15M
- Commission amounts calculated automatically (5-6% of sale price)
- Dates spread across January to June 2024

### Payments
Automatically generated payments for all employees across all 6 payroll periods:
- **Gross Amount**: Sum of commissions for the period
- **Tax Withholdings**: Federal, state, local, social security, and medicare
- **Net Amount**: Gross minus all withholdings
- **Payment Method**: Direct deposit
- **Status**: 80% processed, 20% pending

**Example Payment Calculation:**
```
Gross Commission: $15,000
Federal Tax (12%): $1,800
State Tax (5%): $750
Local Tax (2%): $300
Social Security (6.2%): $930
Medicare (1.45%): $217.50
─────────────────────────
Net Payment: $10,202.50
```

## Using the Dummy Data

### Accessing the Application

1. **Login**: Use your Manus OAuth credentials to log in
2. **Dashboard**: View summary statistics and recent activity
3. **Employees Page**: Browse all 12 sample agents
4. **Transactions Page**: View all 60 property sales
5. **Payments Page**: See payment history and summaries

### Key Features to Test

#### Dashboard
- **Total Payouts**: Displays sum of all gross commissions
- **Active Employees**: Shows 12 active agents
- **Pending Payments**: Shows payments awaiting processing
- **Recent Sales**: Displays latest transactions

#### Employee Management
- Search employees by name or email
- View employment status (all active)
- Filter by commission rate
- See hire dates and contact information

#### Transaction Tracking
- View all 60 completed sales
- Search by property address or city
- See commission calculations
- Filter by status, date, or agent

#### Payment Management
- View payment history across 6 periods
- See tax breakdown for each payment
- Track payment status (processed/pending)
- View payment method and dates

## Data Characteristics

### Realistic Distribution
- **Sales**: Distributed across 15 properties in California
- **Dates**: Spread evenly from January to June 2024
- **Amounts**: Range from $250k to $2.15M (realistic for real estate)
- **Agents**: Varied commission rates (4.8% to 5.6%)

### Tax Calculations
All tax withholdings are calculated automatically:
- Federal: 12% of gross
- State: 5% of gross
- Local: 2% of gross
- Social Security: 6.2% of gross
- Medicare: 1.45% of gross

### Payment Status
- **80% Processed**: Completed and paid to agents
- **20% Pending**: Awaiting final processing

## Regenerating Dummy Data

To reset and regenerate all dummy data:

```bash
node seed-db.mjs
```

This will:
1. Clear all existing data
2. Repopulate with fresh dummy data
3. Recalculate all commissions and payments
4. Reset all statuses

## Notes

- All dummy data uses realistic California property addresses
- Commission rates follow industry standards
- Tax rates are based on 2024 California rates
- Payment dates are set to the 28th of each month
- All employees are marked as "Active"
- All transactions are marked as "Completed"

## Testing Recommendations

1. **Dashboard**: Verify all metrics calculate correctly
2. **Search**: Test employee and transaction search functionality
3. **Filtering**: Try filtering by status, date range, and amount
4. **Calculations**: Verify commission and tax calculations
5. **Navigation**: Test all page transitions and links
6. **Responsive Design**: Check layout on mobile and desktop

---

For questions or to modify the dummy data, edit the `seed-db.mjs` file and run it again.
