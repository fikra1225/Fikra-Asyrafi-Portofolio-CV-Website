Attribute VB_Name = "PriceAlertAndSweep"
'==========================================================================
' Two macros:
'   1) PriceAlertReport - prompts for a % change threshold, builds a new
'      sheet listing every item whose 12-month-avg change exceeds it,
'      sorted descending. A simple "which items should I actually worry
'      about" report driven entirely from tblSummary.
'   2) RunWhatIfSweep - drives the WhatIf_Model's "Months ahead" cell (B14)
'      across a range of horizons and logs the resulting projected price
'      for the item currently selected in B5, i.e. running the what-if
'      lever programmatically instead of reading it off the sensitivity grid.
'==========================================================================

Sub PriceAlertReport()

    Dim threshold As Double
    Dim ws As Worksheet, outWs As Worksheet
    Dim tbl As ListObject
    Dim r As Range
    Dim itemCol As Long, catCol As Long, pctCol As Long
    Dim outRow As Long
    Dim resp As String

    resp = InputBox("Show items with a 12-month price change of at least what percent?", _
                     "Price Alert Report", "40")
    If resp = "" Then Exit Sub
    If Not IsNumeric(resp) Then
        MsgBox "Please enter a number, e.g. 40 for 40%.", vbExclamation
        Exit Sub
    End If
    threshold = CDbl(resp)

    Set ws = ThisWorkbook.Worksheets("ItemSummary")
    Set tbl = ws.ListObjects("tblSummary")
    itemCol = tbl.ListColumns("item").Index
    catCol = tbl.ListColumns("category").Index
    pctCol = tbl.ListColumns("pct_change_12mo_avg").Index

    On Error Resume Next
    Set outWs = ThisWorkbook.Worksheets("PriceAlerts")
    On Error GoTo 0
    If outWs Is Nothing Then
        Set outWs = ThisWorkbook.Worksheets.Add(After:=ws)
        outWs.Name = "PriceAlerts"
    Else
        outWs.Cells.Clear
    End If

    outWs.Range("A1").Value = "Items up " & threshold & "%+ (12-month average basis)"
    outWs.Range("A2").Value = "Item"
    outWs.Range("B2").Value = "Category"
    outWs.Range("C2").Value = "% Change"
    outRow = 2

    For Each r In tbl.DataBodyRange.Rows
        If IsNumeric(r.Cells(1, pctCol).Value) Then
            If r.Cells(1, pctCol).Value >= threshold Then
                outRow = outRow + 1
                outWs.Cells(outRow, 1).Value = r.Cells(1, itemCol).Value
                outWs.Cells(outRow, 2).Value = r.Cells(1, catCol).Value
                outWs.Cells(outRow, 3).Value = r.Cells(1, pctCol).Value
            End If
        End If
    Next r

    outWs.Columns("A:C").AutoFit

    MsgBox (outRow - 2) & " item(s) matched. See sheet 'PriceAlerts'.", vbInformation

End Sub

Sub RunWhatIfSweep()
    ' Sweeps the WhatIf_Model's "Months ahead" lever (B14) from 3 to 60 months
    ' for whichever item is selected in B5, and logs each projected price -
    ' the same result the sensitivity grid shows, but generated on demand
    ' for any single rate/item combination.

    Dim ws As Worksheet
    Dim months As Long
    Dim outRow As Long

    Set ws = ThisWorkbook.Worksheets("WhatIf_Model")
    outRow = 33
    ws.Cells(outRow, 1).Value = "Months ahead (macro sweep)"
    ws.Cells(outRow, 2).Value = "Projected Price"

    For months = 3 To 60 Step 3
        ws.Range("B14").Value = months
        Application.Calculate
        outRow = outRow + 1
        ws.Cells(outRow, 1).Value = months
        ws.Cells(outRow, 2).Value = ws.Range("B15").Value
    Next months

    MsgBox "Swept 'Months ahead' from 3 to 60 and logged projections below row 33.", vbInformation

End Sub
