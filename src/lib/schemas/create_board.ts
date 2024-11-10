import { z } from "zod";
 
export const createBoardSchema = z.object({
    name: z.string().min(3,  { message: "Board name must be at least 3 characters" }).max(35, { message: "Board name can't exceed 35 characters" }),
    columns: z.array(z.string().min(3,  { message: "Column name must be at least 3 characters" }).max(35, { message: "Column name can't exceed 35 characters" }))
}) 
 
export type CreateBoardSchema = typeof createBoardSchema;