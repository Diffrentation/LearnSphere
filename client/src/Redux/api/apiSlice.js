import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearCredentials, setCredentials } from "../slices/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL || "http://localhost:3000/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    headers.set("Accept", "application/json");
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshResult = await baseQuery(
      { url: "/refresh-token", method: "POST" },
      api,
      extraOptions
    );
    const tokenData = refreshResult.data?.data;

    if (tokenData?.accessToken) {
      const currentAuth = api.getState().auth;
      const auth = {
        user: currentAuth.user,
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken || currentAuth.refreshToken || null,
      };
      api.dispatch(setCredentials(auth));
      if (typeof window !== "undefined") {
        localStorage.setItem("auth", JSON.stringify(auth));
      }
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearCredentials());
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth");
      }
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Auth", "Course"],
  endpoints: () => ({}),
});
