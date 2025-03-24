import { createSlice } from "@reduxjs/toolkit";
const User = createSlice(
    {
        name:"User",
        initialState:{
            data: JSON.parse(localStorage.getItem("user")) || null,
            token:JSON.parse(localStorage.getItem("token")) || null
        },
        reducers:{
            login(state,action){
                state.data= action.payload.user;
                state.token = action.payload.token;
            },
            register(state,action){
                state.data = action.payload.user;
                state.token = action.payload.token;
            },
            lsToAdmin(state){
                const user = localStorage.getItem("user");
                if(user){
                    state.data = JSON.parse(user)
                }
            },
            logout(state){
                state.data = null;
                state.token = null;
                localStorage.removeItem("token")
                localStorage.removeItem("user")
            },
        }
    }
)

export const {login,register,logout,lsToAdmin }= User.actions;
export default User.reducer;