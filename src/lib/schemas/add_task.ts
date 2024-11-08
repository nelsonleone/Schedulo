import { z } from "zod";
 
export const addTaskSchema = z.object({
    title: z.string().min(3,  { message: "Task title must be at least 3 characters" }).max(50, { message: "Task title can't exceed 50 characters" }),
    description: z
    .string()
    .optional()
    .refine(
      (value) => !value || (value.length >= 3 && value.length <= 100),
      { message: "Task description must be between 3 and 50 characters if provided" }
    ),
    subtasks: z.array(    
        z.string().optional()
        .refine(
        (value) => !value || (value.length >= 3 && value.length <= 50),
        { message: "Subtask must be between 3 and 50 characters if provided" }
    )).optional()
, 
    due_date: z.string(),
    status: z.string()
}) 

export type AddTaskSchema = typeof addTaskSchema;