Attribute VB_Name = "RefreshAll"
'==========================================================================
' RefreshAll  (SOLUTION)
' Refreshes every PivotTable in the workbook and forces a full recalculation
' of the Dashboard / WhatIf_Model formulas. Wire this to a button.
'==========================================================================
Sub RefreshAll()

    Dim ws As Worksheet
    Dim pt As PivotTable
    Dim pivotCount As Long

    Application.ScreenUpdating = False
    Application.StatusBar = "Refreshing pivot tables..."

    For Each ws In ThisWorkbook.Worksheets
        For Each pt In ws.PivotTables
            pt.RefreshTable
            pivotCount = pivotCount + 1
        Next pt
    Next ws

    Application.CalculateFullRebuild

    Application.StatusBar = False
    Application.ScreenUpdating = True

    MsgBox pivotCount & " PivotTable(s) refreshed and workbook recalculated.", _
           vbInformation, "Refresh complete"

End Sub
