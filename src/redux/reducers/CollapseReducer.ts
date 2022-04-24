import { createSlice } from '@reduxjs/toolkit'

export interface collapseState {
  collapseStatus: boolean
}
const initialState: collapseState = {
  collapseStatus: false,
}

export const collapseSlice = createSlice({
  name: 'collapse',
  initialState,
  reducers: {
    setTrue: (state) => {
      // Redux Toolkit允许我们在reducers中直接写改变state的逻辑.
      // 由于使用了Immer库,所以并没有真的改变state
      // 而是检测到“草稿state”的更改并根据这些更改生成一个全新的不可变state
      state.collapseStatus = true
    },
    setFalse: (state) => {
      state.collapseStatus = false
    },
    reverse: (state) => {
      state.collapseStatus = !state.collapseStatus
    },
  },
})

// reducer方法的每一个case都会生成一个Action
export const { setTrue, setFalse, reverse } = collapseSlice.actions

export default collapseSlice.reducer
