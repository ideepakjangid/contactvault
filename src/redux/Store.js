import { configureStore } from "@reduxjs/toolkit";
import User from "./Slices/User.js"

const Store = configureStore({
    reducer: {
        user: User,
    },
});

export default Store;
