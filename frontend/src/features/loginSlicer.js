import { createSlice } from "@reduxjs/toolkit"

const loginSlicer = createSlice({
    name: "login",
    initialState: {
        isLogin: false,
        user: null
    },
    reducers: {
        login: (state, action) => {
            state.isLogin = true,
            state.user = action.payload
        },
        logout: (state, action) => {
            state.isLogin = false,
            state.user = null
        }
    }
})


export const {login, logout} =  loginSlicer.actions

export default loginSlicer.reducer