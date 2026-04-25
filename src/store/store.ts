import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';

export const store = configureStore({
    reducer:{
        auth: authReducer,
        cart: cartReducer,
    },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof  store.dispatch;

export const useAppSelector = <TSelected>(
    selector: (state: RootState) => TSelected): TSelected => useSelector(selector) ;

