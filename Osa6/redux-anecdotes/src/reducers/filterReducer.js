import { createSlice } from "@reduxjs/toolkit"

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    setFilter(state, action) {
      return action.payload
    },
    filterChange(state, action) {
      return action.payload
    }
  }
})

export const { setFilter, filterChange } = filterSlice.actions
export default filterSlice.reducer

