Attribute VB_Name = "ExportCategorySummary"
'==========================================================================
' ExportCategorySummary  (SOLUTION)
' Two macros:
'   1) ExportCategorySummary - prompts for a category (e.g. "Beef", "Energy"),
'      builds a summary sheet with item count and average 12-mo percent
'      change for that category.
'   2) RunWhatIfSweep - drives the WhatIf_Model's hypothetical gasoline
'      price (B13) through a range of values and logs the resulting
'      predicted milk price for each, i.e. automating the what-if lever.
'==========================================================================

Sub ExportCategorySummary()

    Dim category As String
    Dim ws As Worksheet, outWs As Worksheet
    Dim tbl As ListObject
    Dim r As Range
    Dim catCol As Long, pctCol As Long, currentCol As Long
    Dim n As Long, currentN As Long
    Dim totalPct As Double

    category = Application.InputBox("Enter category (e.g. Beef, Energy, Dairy and fats):", _
                                     "Category Summary", "Beef", Type:=2)
    If category = "False" Or category = "" Then Exit Sub

    Set ws = ThisWorkbook.Worksheets("ItemSummary")
    Set tbl = ws.ListObjects("tblItemSummary")
    catCol = tbl.ListColumns("category").Index
    pctCol = tbl.ListColumns("pct_change_12mo_avg").Index
    currentCol = tbl.ListColumns("is_current").Index

    For Each r In tbl.DataBodyRange.Rows
        If StrComp(r.Cells(1, catCol).Value, category, vbTextCompare) = 0 Then
            n = n + 1
            If r.Cells(1, currentCol).Value = True And IsNumeric(r.Cells(1, pctCol).Value) Then
                currentN = currentN + 1
                totalPct = totalPct + r.Cells(1, pctCol).Value
            End If
        End If
    Next r

    On Error Resume Next
    Set outWs = ThisWorkbook.Worksheets("Summary_" & category)
    On Error GoTo 0
    If outWs Is Nothing Then
        Set outWs = ThisWorkbook.Worksheets.Add(After:=ws)
        outWs.Name = "Summary_" & category
    Else
        outWs.Cells.Clear
    End If

    outWs.Range("A1").Value = category & " summary (" & n & " items)"
    outWs.Range("A2").Value = "Still-published items": outWs.Range("B2").Value = currentN
    If currentN > 0 Then
        outWs.Range("A3").Value = "Avg 12-mo % change": outWs.Range("B3").Value = totalPct / currentN
    End If

    MsgBox "Summary written to sheet 'Summary_" & category & "'.", vbInformation

End Sub

Sub RunWhatIfSweep()
    ' Drives the WhatIf_Model lever (B13, hypothetical gasoline price) across a
    ' range and records the model's predicted milk price for each value.

    Dim ws As Worksheet
    Dim gasPrice As Double
    Dim outRow As Long

    Set ws = ThisWorkbook.Worksheets("WhatIf_Model")
    outRow = 35
    ws.Cells(outRow, 1).Value = "Gasoline $ (macro sweep)"
    ws.Cells(outRow, 2).Value = "Predicted Milk Price"

    For gasPrice = 2 To 5.5 Step 0.25
        ws.Range("B13").Value = gasPrice
        Application.Calculate
        outRow = outRow + 1
        ws.Cells(outRow, 1).Value = gasPrice
        ws.Cells(outRow, 2).Value = ws.Range("B14").Value
    Next gasPrice

    MsgBox "Swept gasoline price from $2.00 to $5.50 and logged predictions below row 35.", _
           vbInformation

End Sub
