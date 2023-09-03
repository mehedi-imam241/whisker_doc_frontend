import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.profile = action.payload;
      Cookies.set("user", JSON.stringify(action.payload));
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
