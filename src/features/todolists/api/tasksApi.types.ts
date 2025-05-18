import { TaskPriority, TaskStatus } from "@/common/enums/enums"
import { z } from "zod"

export const DomainTaskSchema = z.object({
  description: z.string(),
  title: z.string(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  startDate: z.string(),
  deadline: z.string(),
  id: z.string(),
  todoListId: z.string(),
  order: z.number(),
  addedDate: z.string(),
})
export type DomainTask = z.infer<typeof DomainTaskSchema>

export type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: DomainTask[]
}

export type UpdateTaskModel = {
  description: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  startDate: string
  deadline: string
}
