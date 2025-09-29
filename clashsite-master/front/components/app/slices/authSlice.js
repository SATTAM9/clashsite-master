import { apiSlice } from "../utils/apiService";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: { ...credentials },

      }),
    }),
    signup: builder.mutation({
      query: (credentials) => ({
        url: "/signup",
        method: "POST",
        body: { ...credentials },

      }),
    }),
    updateEmail: builder.mutation({
      query: (credentials) => ({
        url: "/updateEmail",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    updatePassword: builder.mutation({
      query: (credentials) => ({
        url: "/updatePassword",
        method: "POST",
        body: { ...credentials },
      }),
    }),
  }),
});

export const {useLoginMutation,useSignupMutation,useUpdateEmailMutation,useUpdatePasswordMutation}   = authApiSlice; 

