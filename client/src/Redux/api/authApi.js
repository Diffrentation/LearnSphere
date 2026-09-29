import { apiSlice } from "./apiSlice.js";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    verifyOTPRegister: builder.mutation({
      query: (data) => ({
        url: "/verify-otp-registration",
        method: "POST",
        body: data,
      }),
    }),

    loginUser: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    verifyOTPLogin: builder.mutation({
      query: (data) => ({
        url: "/verify-otp-login",
        method: "POST",
        body: data,
      }),
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    verifyOTPForgotPass: builder.mutation({
      query: (data) => ({
        url: "/verify-otp-forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    resendPasswordResetOTP: builder.mutation({
      query: (data) => ({
        url: "/resend-password-reset-otp",
        method: "POST",
        body: data,
      }),
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    refreshToken: builder.mutation({
      query: () => ({
        url: "/refresh-token",
        method: "POST",
      }),
    }),

    getCurrentUser: builder.query({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
    // ✅ Update current user (including profile image if present)
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "/me/update",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Auth"],
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/change-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useUpdateProfileMutation,
  useVerifyOTPRegisterMutation,
  useLoginUserMutation,
  useVerifyOTPLoginMutation,
  useForgotPasswordMutation,
  useVerifyOTPForgotPassMutation,
  useResetPasswordMutation,
  useResendPasswordResetOTPMutation,
  useLogoutUserMutation,
  useRefreshTokenMutation,
  useChangePasswordMutation,
  useGetCurrentUserQuery
} = authApi;
