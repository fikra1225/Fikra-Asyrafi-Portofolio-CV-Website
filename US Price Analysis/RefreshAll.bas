Attribute VB_Name = "RefreshAll"
'==========================================================================
' RefreshAll  (PRACTICE — fill in the TODOs)
' Goal: refresh every PivotTable in the workbook, then force a full
' recalculation, then tell the user how many PivotTables were refreshed.
'==========================================================================
Sub RefreshAll()

    Dim ws As Worksheet
    Dim pt As PivotTable
    Dim pivotCount As Long

    ' TODO 1: turn off screen updating for speed (Application.ScreenUpdating)

    ' TODO 2: loop through every worksheet in ThisWorkbook.Worksheets, and
    '         within each one, loop through ws.PivotTables, calling
    '         pt.RefreshTable on each and incrementing pivotCount

    ' TODO 3: force a full recalculation (hint: Application.CalculateFullRebuild)

    ' TODO 4: turn screen updating back on

    ' TODO 5: show a MsgBox reporting pivotCount

End Sub
