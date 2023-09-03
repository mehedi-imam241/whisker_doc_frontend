import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/user";

// import storage from "redux-persist/lib/storage";

// import { persistReducer } from "redux-persist";

// const persistConfig = {
//   key: "root",
//   version: 1,
//   storage,
// };

const reducer = combineReducers({
  user: userReducer,
});

// const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: reducer,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: false,
  //   }),
});

export default store;
