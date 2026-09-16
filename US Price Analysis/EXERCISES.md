# Excel Portfolio Exercise: US Grocery & Gas Prices (2015–2026)

Two workbooks are included:

- **`US_Prices_Analysis_PRACTICE.xlsx`** — do the work here. Data tabs (`Monthly`,
  `ItemSummary`, `WideSelected`) are complete; orange cells mark where your formulas go.
- **`US_Prices_Analysis_SOLUTION.xlsx`** — the finished answer key. Don't peek until you've had
  a real attempt — check a cell, not the whole sheet, when you get stuck.

VBA starter code is in `vba/practice/` (fill in the `TODO`s) and `vba/solution/` (the answer key).

Data: 60 currently-published BLS item price series, monthly, Jan 2015–Jul 2026, real dollar
prices (eggs, milk, ground beef, gasoline, electricity, etc.) — see the original `README.md` for
full column definitions and caveats about seasonality and discontinued series.

---

## Part 1 — PivotTables

Work in the `PivotPractice` tab.

1. Go to `Monthly`, click any cell inside `tblMonthly`, then **Insert > PivotTable** → place it on
   `PivotPractice`.
2. **Exercise 1a:** Build a table of average price by `category`, split by `year`, so you can see
   which category rose fastest and when.
   - Rows: `category`. Columns: `year`. Values: `price` (Average).
3. **Exercise 1b:** Build a second PivotTable counting how many item-months fall into each
   `category` (Values: `item`, set to *Count*) — a sanity check on how much data backs each
   category (Eggs has only 1 item; Beef has 13).
4. **Stretch goal:** Add a Slicer for `category` (Insert > Slicer) so both PivotTables filter
   together — a nice interactive touch for a portfolio screenshot.

*(There's no single "correct" pivot layout — compare your approach to the guide in
`PORTFOLIO_GUIDE_NOTES.md` further down for one worked example.)*

---

## Part 2 — INDEX/MATCH and lookup functions

Work on the `Dashboard` tab of the **practice** workbook. `B3` already has a dropdown (Data
Validation) listing every item from `ItemSummary`.

**Exercise 2a — single-key lookup.** For each orange cell (`B5:B12`), write an INDEX/MATCH that
pulls the matching column from `tblItemSummary` for whichever item is selected in `B3`. Wrap it in
`IFERROR(..., "n/a")` so a typo doesn't break the sheet. Pattern:

```
=IFERROR(INDEX(ItemSummary!$X$2:$X$61, MATCH($B$3, ItemSummary!$A$2:$A$61, 0)), "n/a")
```

Swap `$X$2:$X$61` for the column you need (Category is column C, Unit is column B, First Price is
column F, and so on — check the `ItemSummary` header row for the letters).

**Exercise 2b — multi-criteria lookup (harder).** `B19` should return the exact price for the item
in `B16`, in the year in `B17` and month in `B18`, by searching `tblMonthly`. Since `MATCH` only
takes one lookup column at a time, combine three conditions into one array:

```
=IFERROR(INDEX(Monthly!$G$2:$G$?, MATCH(1,
    (Monthly!$D$2:$D$?=$B$16) * (Monthly!$B$2:$B$?=$B$17) * (Monthly!$C$2:$C$?=$B$18), 0)), "not found")
```

(Replace `$G$2:$G$?` etc. with the actual last row of `tblMonthly` — check the sheet.) In classic
Excel, confirm this with **Ctrl+Shift+Enter** instead of just Enter, since it's a legacy array
formula; modern Excel (365) evaluates it automatically.

**Check your work:** open the solution file's `Dashboard` tab and compare formulas cell by cell.

---

## Part 3 — What-If Analysis

Work on the `WhatIf_Model` tab.

**Exercise 3a — build the regression.** `B6:B10` are orange. Fill in:
- `B6` (Slope): `=SLOPE(y_range, x_range)`
- `B7` (Intercept): `=INTERCEPT(y_range, x_range)`
- `B8` (R-squared): `=RSQ(y_range, x_range)`
- `B9`/`B10`: plain `=AVERAGE(...)` of each series

where **y** = Milk price and **x** = Gasoline price, both from `WideSelected` (check the header
row for which column letter each item landed in — it depends on alphabetical order).

**Exercise 3b — wire up the live lever.** `B14` should read `=Slope*B13 + Intercept` using the
cells you just built (reference `$B$6` and `$B$7`, not the raw numbers).

**Exercise 3c — fill in the sensitivity table** (`B20:B27`): same formula as B14, but each row
uses its own scenario value in column A instead of `B13`.

**Exercise 3d — do this part live in Excel (not storable in the file):**
1. Convert your sensitivity table into a *real* Excel Data Table: select `A19:B27`, then
   **Data > What-If Analysis > Data Table**, Column input cell = `B13`.
2. Run **Goal Seek**: Set cell `B14`, To value `4.5`, By changing cell `B13` — find the gas price
   that would predict a $4.50 gallon of milk.
3. Optional: **Scenario Manager** — add a "Cheap Gas" ($2.00) and "Expensive Gas" ($5.00) scenario
   and generate a Scenario Summary report.

**Check your work:** the solution file's `B6` should be about `0.495`, `B7` about `2.09`, and
`B8` (R²) about `0.59` — a moderately strong relationship, consistent with the README's hint that
gas prices might help predict food prices.

---

## Part 4 — Macros & VBA

Stub files are in `vba/practice/` with `TODO` comments; finished versions are in `vba/solution/`
for when you want to check your work or just see a clean reference implementation.

1. Save your practice workbook as `.xlsm` (macros can't be stored in plain `.xlsx`).
2. **Alt+F11** → **File > Import File** → import all three `.bas` files from `vba/practice/`.
3. Fill in each `TODO` inside the VBA editor. All three build on things you already used in Parts
   1–3 (looping an Excel Table via `ListObjects`, referencing named ranges, forcing a recalc).
4. Add three buttons on the `Dashboard` sheet (**Insert > Shapes**, right-click → **Assign
   Macro**) for `RefreshAll`, `HighlightPriceChanges`, and `ExportCategorySummary`.
5. Test each button. `HighlightPriceChanges` should color-code all 74 rows on `ItemSummary` by
   inflation severity; `ExportCategorySummary` should prompt for a category and create a summary
   sheet.

---

## Suggested portfolio write-up

1. **The data:** 60 BLS grocery/gas price series, national monthly averages, 2015–2026.
2. **Cleaning & structuring:** long format for PivotTables, a summary table for lookups, a
   curated wide table for correlation/regression.
3. **Exploration:** PivotTables showing which categories rose fastest and when.
4. **Interactivity:** an INDEX/MATCH dashboard, including a 3-key composite lookup — a step up
   from a basic single-column VLOOKUP.
5. **Modeling:** does gasoline predict milk prices? A regression + live What-If lever + Data
   Table + Goal Seek make the answer explorable, not just a static number.
6. **Automation:** VBA macros for refreshing, formatting, and summarizing with one click.

That arc — clean, explore, make interactive, model, automate — is what most portfolio reviewers
are actually scanning for.
