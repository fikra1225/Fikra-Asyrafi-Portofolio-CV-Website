# Excel Portfolio Project: US Grocery & Gas Prices (2015–2026)

This guide walks through `US_Grocery_Gas_Prices_Analysis.xlsx` step by step, so you can rebuild
each piece live in Excel, screenshot it, and talk through it in a portfolio or interview. It
covers **PivotTables, What-If Analysis, INDEX/MATCH, lookup functions, and VBA macros** using 74
real BLS-tracked grocery and gas items, monthly from 2015–2026.

---

## 0. What's already built for you

| Tab | What it is |
|---|---|
| `README` | Overview + the dataset's own caveats (seasonality, discontinued series, nominal vs real prices) |
| `Monthly` | Long-format source data, one row per item-month — 8,869 rows (`tblMonthly`) |
| `ItemSummary` | One row per item: coverage, min/max, 12-month-average % change (`tblSummary`) |
| `Wide` | One row per month, one column per item — built for correlation analysis (`tblWide`) |
| `Dashboard` | Working INDEX/MATCH lookups (already functional) |
| `WhatIf_Model` | Working CAGR projection + sensitivity grid (already functional) |

Every data tab is an Excel **Table**, so a PivotTable built from any of them will auto-expand if
new months get appended later — worth mentioning out loud in an interview.

---

## 1. Build a PivotTable (from `tblMonthly`)

1. Click any cell inside the `Monthly` table.
2. **Insert > PivotTable** → "New Worksheet."
3. Drag:
   - `category` → **Rows**
   - `year` → **Columns**
   - `price` → **Values**, set to *Average*
4. You now have "average price by category by year" — a compact view of when each category's
   prices actually moved.
5. Right-click a value cell → **Number Format** → currency, 2 decimals, so it reads cleanly.
6. Build a second PivotTable filtered to `is_current = TRUE` (drag `is_current` from `tblSummary`
   into the PivotTable's Filters area, if you build this one from a data model combining both
   tables — or simpler: just filter the `Monthly` PivotTable by excluding the 14 discontinued
   items' `item` values in the Filter pane). This shows you know to control for the
   discontinued-series issue the dataset's README explicitly warns about.
7. **Portfolio tip:** screenshot the field list next to the resulting pivot — that pairing, not
   just the output, is what shows the skill.

---

## 2. INDEX/MATCH and lookup functions (already built — study & extend)

Open `Dashboard`. Cell `B3` is a dropdown (Data Validation) of all 74 items. Everything below is
a live lookup into `ItemSummary`, e.g.:

```
=INDEX(ItemSummary!$F$2:$F$75, MATCH($B$3, ItemSummary!$A$2:$A$75, 0))   ' First price
```

To the right is a **two-key lookup** — item AND month, pulling a single price out of the 8,869-row
`Monthly` table:

```
=INDEX(Monthly!$G$2:$G$8870,
   MATCH(1, (Monthly!$D$2:$D$8870=$B$3)*(Monthly!$A$2:$A$8870=$E$4), 0))
```

This is the standard trick for matching **two conditions at once** without a helper column:
multiplying two TRUE/FALSE arrays gives 1 only where both conditions hold, and `MATCH(1, ..., 0)`
finds that row. It's worth being able to explain this formula specifically — it's a step up from
a single-key INDEX/MATCH and a common "show me something harder" interview follow-up.

**Why INDEX/MATCH over VLOOKUP** here especially: `VLOOKUP` can't do a two-key match like this at
all without concatenating a helper column first; INDEX/MATCH does it natively.

**To extend it yourself:** add `AVERAGEIFS(Monthly!$G:$G, Monthly!$D:$D, $B$3, Monthly!$C:$C, 2024)`
beside the lookup to show "average price for this item in 2024" — combining a lookup with an
aggregation function is a natural next step to demonstrate.

---

## 3. What-If Analysis

### 3a. The projection model (already built)

`WhatIf_Model!B10` back-solves each item's **implied monthly growth rate** from its first-12-month
vs last-12-month average price (a CAGR). `B13` is the **lever** — a yellow, blue-text input cell
defaulted to that implied rate, but overridable. `B15` projects the price forward `B14` months:

```
B15: =$B$8*(1+$B$13)^$B$14
```

Change `B13` (try 0% for "prices freeze," or 3% for "much faster than history") and `B15` updates
instantly — that's the what-if lever in action.

### 3b. Turn the sensitivity grid into a *real* two-variable Data Table

The grid at rows 20–27 (growth rate down the side, horizon across the top) already shows the
correct numbers via plain formulas. To rebuild it as an actual Excel **Data Table** (worth doing
live, since `{=TABLE()}` is an array formula our file can't pre-bake):

1. Put the formula `=B15` in the single cell that sits one row above your rate column and one
   column left of your horizon row (the top-left corner of the grid).
2. Fill in growth-rate scenarios down the column below it, and month-horizons across the row to
   its right.
3. Select the *entire* rectangle (corner formula + rates + horizons).
4. **Data tab > What-If Analysis > Data Table.**
5. *Row input cell:* `B14` (Months ahead) — because horizons run across the top row.
   *Column input cell:* `B13` (growth rate) — because rates run down the left column.
6. Excel fills the grid with `{=TABLE(B14,B13)}`. Screenshot the dialog and result together.

### 3c. Goal Seek

1. Click `B15` (Projected price). Set `B14` to `24` first.
2. **Data tab > What-If Analysis > Goal Seek** → *Set cell* `B15`, *To value* `10`,
   *By changing cell* `B13`.
3. Excel solves for the monthly growth rate that would put the item at $10 in 24 months — a
   natural line for a write-up: "at Coffee's historical growth rate, it reaches $X in 2 years;
   Goal Seek shows it would need a rate of Y% to hit $10."

### 3d. Scenario Manager (optional third what-if tool)

**Data tab > What-If Analysis > Scenario Manager > Add.** Create "Cools Off" (`B13 = 0%`) and
"Accelerates" (`B13 = 2%`) scenarios (keep `B14` fixed at, say, 24), then use **Summary** to
generate a side-by-side comparison report.

---

## 4. VBA Macros

Three ready-to-import modules are in the `vba_prices/` folder next to this guide:

| File | What it does |
|---|---|
| `RefreshDashboard.bas` | Refreshes every PivotTable and forces a full recalc |
| `HighlightPriceChanges.bas` | Colors every row of `tblSummary` by 12-month % change: red (≥50%), amber (20–50%), green (0–20%), blue (fell), grey (discontinued) |
| `PriceAlertAndSweep.bas` | `PriceAlertReport` — asks for a % threshold and builds a filtered list of items above it; `RunWhatIfSweep` — drives the What-If "months ahead" lever across a range and logs every projected price |

**Why they're separate `.bas` files:** a VBA project is a compiled object living inside a
`.xlsm`/`.xlsb` file, so it has to be compiled by Excel itself — it can't be written into a plain
`.xlsx` by a script. Importing takes under a minute:

1. Open `US_Grocery_Gas_Prices_Analysis.xlsx` in Excel.
2. **File > Save As** → file type **Excel Macro-Enabled Workbook (.xlsm)**. Required before macros
   can be saved at all.
3. **Alt+F11** to open the VBA editor.
4. **File > Import File...** and select each `.bas` file (all three).
5. Close the editor. On the `ItemSummary` or `Dashboard` sheet, **Insert > Shapes** (or a
   Developer-tab Button) → draw a button → right-click → **Assign Macro** → pick the macro. Repeat
   for each of the four macros (`RefreshDashboard`, `HighlightPriceChanges`, `PriceAlertReport`,
   `RunWhatIfSweep`).
6. Enable macros when prompted (the yellow "Enable Content" bar, or Trust Center settings).
7. Test each button. `PriceAlertReport` should prompt for a threshold (try `40`) and build a
   sorted watchlist; `HighlightPriceChanges` should color-code all 74 items instantly.

**Portfolio tip:** a 30-second screen capture of `PriceAlertReport` running — typing "40," the
input box closing, a new sheet appearing with the filtered list — is a stronger portfolio artifact
than a static code screenshot.

---

## 5. Suggested portfolio write-up structure

1. **The data:** 74 BLS-tracked US grocery/gas items, monthly, 2015–2026, real dollar averages.
2. **Cleaning & structuring:** raw long/wide/summary CSVs → Excel Tables ready for pivoting.
3. **Exploration:** PivotTables showing average price by category and year, filtered to
   still-published series.
4. **Interactivity:** an INDEX/MATCH dashboard with both a single-key item lookup and a two-key
   item-and-month price lookup.
5. **Modeling:** a CAGR-based price projection with a live What-If lever, a rate × horizon
   sensitivity grid, Goal Seek, and Scenario comparison.
6. **Automation:** VBA macros that refresh, color-code, and build a threshold-based alert report
   with one click.

That arc — clean, explore, make interactive, model, automate — is the throughline reviewers scan
a portfolio project for.
