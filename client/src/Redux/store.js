import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";

 // Combine all reducers into one rootReducer
const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer, 
  auth: authReducer,
  user: userReducer,
});
//  Passing rootReducer into configureStore
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
