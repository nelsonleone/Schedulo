interface Board {
    id: string,
    user_id: string,
    name: string,
    board_columns: Board_Column[],
    tasks: Task[],
    created_at?: string,
    updated_at?: string,
}


interface Board_Column {
    id: string,
    board_id: string,
    name: string,
    position: number,
    created_at: string,
}


interface Subtask {
    id: string,
    title: string,
    is_completed: boolean
}

interface Task {
    id: string,
    board_id: string,
    user_id: string,
    title: string,
    description: string,
    position: number,
    due_date: string,
    is_completed: boolean,
    sub_tasks: Subtask[],
    created_at: string,
    updated_at: string,
}