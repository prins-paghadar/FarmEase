import {configureStore} from '@reduxjs/toolkit'
import loginReducer from '../features/loginSlicer.js'
import cartReducer from "../features/cartSlicer";

const store = configureStore({
    reducer: {
        login: loginReducer,
        cart: cartReducer,
    }
})

export default store