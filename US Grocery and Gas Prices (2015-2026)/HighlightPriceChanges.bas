Attribute VB_Name = "HighlightPriceChanges"
'==========================================================================
' HighlightPriceChanges
' Loops through the tblSummary table on the ItemSummary sheet and colors
' each row by pct_change_12mo_avg: >=50% = red (big riser), 20-50% = amber,
' 0-20% = light green, negative = blue-green (got cheaper), discontinued
' (blank) = grey. Demonstrates VBA reading a Table (ListObject) and doing
' threshold-based conditional formatting instead of Excel's built-in rules.
'==========================================================================
Sub HighlightPriceChanges()

    Dim ws As Worksheet
    Dim tbl As ListObject
    Dim r As Range
    Dim pctCol As Long
    Dim pctVal As Variant

    Set ws = ThisWorkbook.Worksheets("ItemSummary")
    Set tbl = ws.ListObjects("tblSummary")
    pctCol = tbl.ListColumns("pct_change_12mo_avg").Index

    Application.ScreenUpdating = False

    For Each r In tbl.DataBodyRange.Rows
        pctVal = r.Cells(1, pctCol).Value
        If Not IsNumeric(pctVal) Or pctVal = "" Then
            r.Interior.Color = RGB(217, 217, 217)          ' grey: discontinued
        ElseIf pctVal >= 50 Then
            r.Interior.Color = RGB(255, 199, 206)           ' red: big riser
        ElseIf pctVal >= 20 Then
            r.Interior.Color = RGB(255, 235, 156)           ' amber: moderate riser
        ElseIf pctVal >= 0 Then
            r.Interior.Color = RGB(198, 239, 206)           ' green: mild riser
        Else
            r.Interior.Color = RGB(189, 215, 238)           ' blue: got cheaper
        End If
    Next r

    Application.ScreenUpdating = True

    MsgBox "Color-coded " & tbl.DataBodyRange.Rows.Count & " items by 12-month price change.", _
           vbInformation, "Highlight complete"

End Sub
