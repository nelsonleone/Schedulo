const COLORS = [
    "#4caf50", // Green - often represents "Done" or "Completed"
    "#2196f3", // Blue - often represents "In Progress" or "Doing"
    "#ff9800", // Orange - often represents "Backlog" or "Todo"
    "#9c27b0", // Purple - flexible for additional columns
    "#e91e63", // Pink - flexible for additional columns
    "#ffc107", // Amber - flexible for additional columns
    "#03a9f4", // Light Blue - flexible for additional columns
]

export function assignColorsToColumns(columnsArray: Board_Column[], columnID: string) {
    const columnIndex = columnsArray.findIndex(v => v.id === columnID)
    
    if (columnIndex === -1) return "#b0bec5";

    return COLORS[columnIndex]
}