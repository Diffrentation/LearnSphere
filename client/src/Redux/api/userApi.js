import { apiSlice } from "./apiSlice";

export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE COURSE
    createCourse: builder.mutation({
      query: (data) => ({
        url: "/createCourse",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Course"],
    }),

    // GET ALL COURSES
    getAllCourses: builder.query({
      query: () => "/getAllCourse",
      providesTags: ["Course"],
    }),

    getDashboardStats: builder.query({
      query: () => "/dashboard-stats",
      providesTags: ["Course"],
    }),

    // GET SINGLE COURSE
    getCourseById: builder.query({
      query: (id) => `/getCourse/${id}`,
      providesTags: (result, error, id) => [{ type: "Course", id }],
    }),

    // UPDATE COURSE
      updateCourse: builder.mutation({
      query: ({ id, body }) => ({
        url: `/updateCourse/${id}`,
        method: "PUT",
        body,
      }),
    }),


    // DELETE COURSE
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/deleteCourse/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),

    // PUBLISH COURSE
    publishCourse: builder.mutation({
      query: (id) => ({
        url: `/course/${id}/publish`,
        method: "PATCH",
      }),
      invalidatesTags: ["Course"],
    }),

    // UNPUBLISH COURSE
    unpublishCourse: builder.mutation({
      query: (id) => ({
        url: `/course/${id}/unpublish`,
        method: "PATCH",
      }),
      invalidatesTags: ["Course"],
    }),

    generateTest: builder.mutation({
      query: (data) => ({
        url: "/generate-test",
        method: "POST",
        body: data,
      }),
    }),

      getTests: builder.query({
        query: () => ({
          url: "/get-tests",
          method: "GET",
        }),
        providesTags: (result = [], error) =>
          result
            ? [...result.data.map(({ _id }) => ({ type: "Test", id: _id })), "Test"]
            : ["Test"],
      }),

      deleteTest: builder.mutation({
        query: (id) => ({
          url: `/delete-test/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Test"], // ✅ invalidate cache to refresh getTests
      }),

  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useGetDashboardStatsQuery,
  useGetCourseByIdQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGenerateTestMutation,
  useDeleteTestMutation,
  useGetTestsQuery,
  usePublishCourseMutation,
  useUnpublishCourseMutation,
} = courseApi;
