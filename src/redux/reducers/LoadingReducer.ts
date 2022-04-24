import { createSlice } from '@reduxjs/toolkit'

export interface loadingState {
  spinning: boolean
}
const initialState: loadingState = {
  spinning: false,
}

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    showLoading: (state) => {
      console.log('showLoading')
      state.spinning = true
    },
    hideLoading: (state) => {
      console.log('hideLoading')
      state.spinning = false
    },
  },
})

// reducer方法的每一个case都会生成一个Action
export const { showLoading, hideLoading } = loadingSlice.actions

export default loadingSlice.reducer
