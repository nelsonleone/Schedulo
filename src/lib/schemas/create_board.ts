import { z } from "zod";
 
export const createBoardSchema = z.object({
    name: z.string().min(3,  { message: "Board name must be at least 3 characters" }).max(50, { message: "Board name can't exceed 50 characters" }),
    columns: z.array(z.string().min(3,  { message: "Column name must be at least 3 characters" }).max(50, { message: "Column name can't exceed 50 characters" }))
}) 
 
export type CreateBoardSchema = typeof createBoardSchema;