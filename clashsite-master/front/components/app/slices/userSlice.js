import { apiSlice } from "../utils/apiService";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    mydata: builder.mutation({
      query: (credentials) => ({
        mydata: "/mydata",
        method: "GET",
        body: { ...credentials },

      }),
    }),
    addlinkedplayers: builder.mutation({
      query: (credentials) => ({
        url: "/addlinkedplayers",
        method: "POST",
        body: { ...credentials },

      }),
    }),
    users: builder.mutation({
      query: (credentials) => ({
        url: "/users",
        method: "GET",
        body: { ...credentials },
      }),
    }),
    
  }),
});

export const {useAddlinkedplayersMutation,useMydataMutation,useUsersMutation}   = userApiSlice; 