export function checkNumOfCompletedSubtasks(subtasks: Subtask[]){
    let count : number;
    subtasks.map((v) => {
        return v.is_completed ? count++ : null
    })
}