Attribute VB_Name = "ExportCategorySummary"
'==========================================================================
' ExportCategorySummary + RunWhatIfSweep  (PRACTICE — fill in the TODOs)
'==========================================================================

Sub ExportCategorySummary()
    ' Goal: ask the user for a category name (Application.InputBox), then
    ' loop tblItemSummary on ItemSummary counting how many items are in that
    ' category, how many of those are still published (is_current = True),
    ' and their average pct_change_12mo_avg. Write the results to a new
    ' sheet named "Summary_<category>".

    Dim category As String
    Dim ws As Worksheet, outWs As Worksheet
    Dim tbl As ListObject
    Dim r As Range
    Dim catCol As Long, pctCol As Long, currentCol As Long
    Dim n As Long, currentN As Long
    Dim totalPct As Double

    ' TODO 1: prompt for the category with Application.InputBox
    ' TODO 2: Set ws / tbl, and find catCol / pctCol / currentCol via
    '         tbl.ListColumns("...").Index
    ' TODO 3: loop tbl.DataBodyRange.Rows, matching category with
    '         StrComp(..., vbTextCompare) = 0, and accumulate n / currentN / totalPct
    ' TODO 4: create (or clear, if it exists) a sheet named "Summary_" & category
    ' TODO 5: write item count, still-published count, and average % change to it
    ' TODO 6: MsgBox confirming completion

End Sub

Sub RunWhatIfSweep()
    ' Goal: loop the WhatIf_Model's hypothetical gasoline price (B13) from
    ' 2.00 to 5.50 in steps of 0.25, and for each value, force a recalculation
    ' and log the resulting predicted milk price (B14) starting at row 35.

    Dim ws As Worksheet
    Dim gasPrice As Double
    Dim outRow As Long

    ' TODO 1: Set ws = ThisWorkbook.Worksheets("WhatIf_Model")
    ' TODO 2: write header labels at row 35 (e.g. "Gasoline $ (macro sweep)", "Predicted Milk Price")
    ' TODO 3: loop gasPrice from 2 to 5.5 step 0.25:
    '           - set ws.Range("B13").Value = gasPrice
    '           - Application.Calculate
    '           - write gasPrice and ws.Range("B14").Value to the next row
    ' TODO 4: MsgBox confirming completion

End Sub
