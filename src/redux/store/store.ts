import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../slices/userSlice";

const store = configureStore({
  reducer: {
    userInfo: userSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
