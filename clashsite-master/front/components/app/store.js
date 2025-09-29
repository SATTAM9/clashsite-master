import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "./utils/apiService";
import { setupListeners } from "@reduxjs/toolkit/query";

 export  const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});


// export default store;
setupListeners(store.dispatch);
