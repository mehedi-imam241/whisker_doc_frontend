import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const stripeSlice = createSlice({
  name: "stripe",
  initialState: initialState,
  reducers: {
    setReturnUrl: (state, action) => {
      state.return_url = action.payload;
    },
  },
});

export const { setReturnUrl } = stripeSlice.actions;
export default stripeSlice.reducer;
