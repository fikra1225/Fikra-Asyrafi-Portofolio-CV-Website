Attribute VB_Name = "HighlightPriceChanges"
'==========================================================================
' HighlightPriceChanges  (PRACTICE — fill in the TODOs)
' Goal: loop through tblItemSummary on the ItemSummary sheet and color each
' row by its pct_change_12mo_avg value:
'    > 50            -> red    RGB(255,199,206)
'    20 to 50        -> amber  RGB(255,235,156)
'    < 20 (numeric)  -> green  RGB(198,239,206)
'    blank/non-numeric (discontinued item) -> no fill (xlNone)
'==========================================================================
Sub HighlightPriceChanges()

    Dim ws As Worksheet
    Dim tbl As ListObject
    Dim r As Range
    Dim pctCol As Long
    Dim pctVal As Variant

    ' TODO 1: Set ws = ThisWorkbook.Worksheets("ItemSummary")
    ' TODO 2: Set tbl = ws.ListObjects("tblItemSummary")
    ' TODO 3: find the column index of "pct_change_12mo_avg" via
    '         tbl.ListColumns("pct_change_12mo_avg").Index

    ' TODO 4: loop `For Each r In tbl.DataBodyRange.Rows`, read
    '         pctVal = r.Cells(1, pctCol).Value, and apply the color rules
    '         above using r.Interior.Color / r.Interior.ColorIndex = xlNone

    ' TODO 5: show a MsgBox reporting how many rows were formatted

End Sub
