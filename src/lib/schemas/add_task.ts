import { z } from "zod";
 
export const addTaskSchema = z.object({
    title: z.string().min(3,  { message: "Task title must be at least 3 characters" }).max(50, { message: "Task title can't exceed 50 characters" }),
    description: z.string().min(3,  { message: "Task description must be at least 3 characters" }).max(50, { message: "Task description can't exceed 100 characters" }).optional(),
    subtasks: z.array(z.string().min(3,  { message: "Sub-Task title must be at least 3 characters" }).max(50, { message: "Sub-Task title can't exceed 50 characters" })), 
    due_date: z.string()
}) 

export type AddTaskSchema = typeof addTaskSchema;