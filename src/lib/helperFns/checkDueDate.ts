export function checkDueDate(dateValue: string): { is_due?: boolean; message: string | null, is_due_soon?: boolean } {
    const currentDate = new Date()
    const dueDate = new Date(dateValue)

    const timeDifference = dueDate.getTime() - currentDate.getTime()
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))

    if (daysDifference < 0) {
        return {
            is_due: true,
            message: "The due date has passed.",
        }
    } else if (daysDifference <= 3) {
        return {
            is_due_soon: true,
            message: `Due in ${daysDifference} day(s).`,
        }
    } else {
        return {
        is_due: false,
            message: null,
        }
    }
}
