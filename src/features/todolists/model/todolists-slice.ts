import { Todolist } from "@/features/todolists/api/todolistsApi.types"
import { todolistsApi } from "@/features/todolists/api/todolistsApi"
import { createAppSlice } from "@/common/utils"
import { setAppStatusAC } from "@/app/app-slice"

export type TodolistType = {
  id: string
  title: string
  filter: FilterValues
}
export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"

export const todolistSlice = createAppSlice({
  name: "todolists",
  initialState: [] as Array<DomainTodolist>,
  selectors: {
    selectTodolists: (sliceState) => sliceState,
  },
  reducers: (create) => ({
    fetchTodolistsTC: create.asyncThunk(
      async (_, thunkAPI) => {
        try {
          thunkAPI.dispatch(setAppStatusAC({ status: "loading" }))
          const res = await todolistsApi.getTodolists()
          thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }))
          return { todolists: res.data }
        } catch (error) {
          thunkAPI.dispatch(setAppStatusAC({ status: "failed" }))
          return thunkAPI.rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          action.payload?.todolists.forEach((tl) => {
            state.push({ ...tl, filter: "all" })
          })
        },
      },
    ),
    createTodolistTC: create.asyncThunk(
      async (title: string, thunkAPI) => {
        try {
          thunkAPI.dispatch(setAppStatusAC({ status: "loading" }))
          const res = await todolistsApi.createTodolist(title)
          thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }))
          return res.data.data.item
        } catch (error) {
          thunkAPI.dispatch(setAppStatusAC({ status: "failed" }))
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.unshift({
            ...action.payload,
            filter: "all",
          })
        },
      },
    ),
    deleteTodolistTC: create.asyncThunk(
      async (id: string, thunkAPI) => {
        try {
          thunkAPI.dispatch(setAppStatusAC({ status: "loading" }))
          await todolistsApi.deleteTodolist(id)
          thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }))
          return { id }
        } catch (error) {
          thunkAPI.dispatch(setAppStatusAC({ status: "failed" }))
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload?.id)
          if (index !== -1) {
            state.splice(index, 1)
          }
        },
      },
    ),
    changeTodolistTitleTC: create.asyncThunk(
      async (payload: { id: string; title: string }, thunkAPI) => {
        try {
          thunkAPI.dispatch(setAppStatusAC({ status: "loading" }))
          await todolistsApi.changeTodolistTitle(payload)
          thunkAPI.dispatch(setAppStatusAC({ status: "succeeded" }))
          return { ...payload }
        } catch (error) {
          thunkAPI.dispatch(setAppStatusAC({ status: "failed" }))
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload.id)
          if (index !== -1) {
            state[index].title = action.payload.title
          }
        },
      },
    ),
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),
  }),
})

export const { fetchTodolistsTC, changeTodolistFilterAC, createTodolistTC, deleteTodolistTC, changeTodolistTitleTC } =
  todolistSlice.actions

export const todolistsReducer = todolistSlice.reducer
export const { selectTodolists } = todolistSlice.selectors
