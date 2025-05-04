import { createAsyncThunk } from "@reduxjs/toolkit"
import { Todolist } from "@/features/todolists/api/todolistsApi.types"
import { todolistsApi } from "@/features/todolists/api/todolistsApi"
import { createAppSlice } from "@/common/utils"

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
      async (_, thunkApi) => {
        try {
          const res = await todolistsApi.getTodolists()
          return { todolists: res.data }
        } catch (error) {
          return thunkApi.rejectWithValue(error)
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
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state[index].title = action.payload.title
        }
      })
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state.unshift({
          ...action.payload,
          filter: "all",
        })
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        console.log(action.payload)
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state.splice(index, 1)
        }
      })
  },
})

export const changeTodolistTitleTC = createAsyncThunk(
  `${todolistSlice.name}/changeTodolistTitleTC`,
  async (payload: { id: string; title: string }, thunkAPI) => {
    try {
      await todolistsApi.changeTodolistTitle(payload)
      return { id: payload.id, title: payload.title }
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const createTodolistTC = createAsyncThunk(
  `${todolistSlice.name}/createTodolistTC`,
  async (title: string, thunkAPI) => {
    try {
      const res = await todolistsApi.createTodolist(title)
      console.log("API Response:", res)
      return res.data.data.item
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const deleteTodolistTC = createAsyncThunk(
  `${todolistSlice.name}/deleteTodolistTC`,
  async (id: string, thunkAPI) => {
    try {
      await todolistsApi.deleteTodolist(id)
      return { id }
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
)

export const { fetchTodolistsTC, changeTodolistFilterAC } = todolistSlice.actions
export const todolistsReducer = todolistSlice.reducer
export const { selectTodolists } = todolistSlice.selectors
