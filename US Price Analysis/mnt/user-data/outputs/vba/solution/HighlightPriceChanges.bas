Attribute VB_Name = "HighlightPriceChanges"
'==========================================================================
' HighlightPriceChanges  (SOLUTION)
' Loops through tblItemSummary on the ItemSummary sheet and colors each row
' by its 12-month-average percent change: >50% = red (steep inflation),
' 20-50% = amber, <20% = green. Discontinued items (blank pct change) are
' left unformatted.
'==========================================================================
Sub HighlightPriceChanges()

    Dim ws As Worksheet
    Dim tbl As ListObject
    Dim r As Range
    Dim pctCol As Long
    Dim pctVal As Variant

    Set ws = ThisWorkbook.Worksheets("ItemSummary")
    Set tbl = ws.ListObjects("tblItemSummary")
    pctCol = tbl.ListColumns("pct_change_12mo_avg").Index

    Application.ScreenUpdating = False

    For Each r In tbl.DataBodyRange.Rows
        pctVal = r.Cells(1, pctCol).Value
        If IsNumeric(pctVal) And pctVal <> "" Then
            Select Case pctVal
                Case Is > 50
                    r.Interior.Color = RGB(255, 199, 206)   ' red - steep rise
                Case Is > 20
                    r.Interior.Color = RGB(255, 235, 156)   ' amber - moderate rise
                Case Else
                    r.Interior.Color = RGB(198, 239, 206)   ' green - mild/flat
            End Select
        Else
            r.Interior.ColorIndex = xlNone                  ' discontinued item, no data
        End If
    Next r

    Application.ScreenUpdating = True

    MsgBox "Formatted " & tbl.DataBodyRange.Rows.Count & " items by price-change severity.", _
           vbInformation, "Highlight complete"

End Sub
