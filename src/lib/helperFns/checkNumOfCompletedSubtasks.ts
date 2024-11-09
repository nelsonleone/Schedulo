export function checkNumOfCompletedSubtasks(subtasks: Subtask[]){
    let count : number = 0;
    subtasks.map((v) => {
        return v.is_completed ? count++ : null
    })

    return count;
}