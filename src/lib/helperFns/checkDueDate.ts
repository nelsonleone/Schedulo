function checkDueDate(dateValue: string): string | null {
    const currentDate = new Date()
    const dueDate = new Date(dateValue)

    const timeDifference = dueDate.getTime() - currentDate.getTime()

    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))

    if (daysDifference < 0) {
        return "The due date has passed.";
    } else if (daysDifference <= 3) {
        return `Due in ${daysDifference} day(s).`;
    } else {
        return null;
    }
}
