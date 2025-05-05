import { createTodolistTC, deleteTodolistTC } from "@/features/todolists/model/todolists-slice"
import { createAppSlice } from "@/common/utils"
import { tasksApi } from "@/features/todolists/api/tasksApi"
import { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types"
import { RootState } from "@/app/store"
import { setAppStatusAC } from "@/app/app-slice"

export type TasksState = Record<string, DomainTask[]>

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  selectors: {
    selectTasks: (sliceState) => sliceState,
  },
  reducers: (create) => ({
    fetchTasksTC: create.asyncThunk(
      async (todolistId: string, thunkAPI) => {
        try {
          thunkAPI.dispatch(setAppStatusAC({ status: "loading" }))
          const res = await tasksApi.getTasks(todolistId)
          thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }))
          return { todolistId, tasks: res.data.items }
        } catch (error) {
          thunkAPI.dispatch(setAppStatusAC({ status: "failed" }))
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks
        },
      },
    ),
    createTaskTC: create.asyncThunk(
      async (payload: { todolistId: string; title: string }, thunkAPI) => {
        try {
          thunkAPI.dispatch(setAppStatusAC({ status: "loading" }))
          const res = await tasksApi.createTask(payload)
          thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }))
          return { task: res.data.data.item }
        } catch (error) {
          thunkAPI.dispatch(setAppStatusAC({ status: "failed" }))
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.task.todoListId].unshift(action.payload.task)
        },
      },
    ),
    deleteTaskTC: create.asyncThunk(
      async (payload: { todolistId: string; taskId: string }, thunkAPI) => {
        try {
          thunkAPI.dispatch(setAppStatusAC({ status: "loading" }))
          await tasksApi.deleteTask(payload)
          thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }))
          return payload
        } catch (error) {
          thunkAPI.dispatch(setAppStatusAC({ status: "failed" }))
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const tasks = state[action.payload.todolistId]
          const index = tasks.findIndex((task) => task.id === action.payload.taskId)
          if (index !== -1) {
            tasks.splice(index, 1)
          }
        },
      },
    ),
    updateTaskTC: create.asyncThunk(
      async (
        payload: {
          todolistId: string
          taskId: string
          domainModel: Partial<UpdateTaskModel>
        },
        { dispatch, getState, rejectWithValue },
      ) => {
        const { todolistId, taskId, domainModel } = payload

        const allTodolistTasks = (getState() as RootState).tasks[todolistId]
        const task = allTodolistTasks.find((task) => task.id === taskId)

        if (!task) {
          return rejectWithValue(null)
        }
        const currentModel: UpdateTaskModel = {
          description: task.description,
          title: task.title,
          priority: task.priority,
          startDate: task.startDate,
          deadline: task.deadline,
          status: task.status,
          ...domainModel,
        }
        try {
          dispatch(setAppStatusAC({ status: "loading" }))
          const res = await tasksApi.updateTask({ todolistId, taskId, model: currentModel })
          dispatch(setAppStatusAC({ status: "succeeded" }))
          return { task: res.data.data.item }
        } catch (error) {
          dispatch(setAppStatusAC({ status: "failed" }))
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const task = state[action.payload.task.todoListId].find((task) => task.id === action.payload.task.id)

          if (task) {
            task.status = action.payload.task.status
            task.title = action.payload.task.title
          }
        },
      },
    ),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        if (action.payload) {
          delete state[action.payload.id]
        }
      })
  },
})

export const { fetchTasksTC, createTaskTC, deleteTaskTC, updateTaskTC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors
