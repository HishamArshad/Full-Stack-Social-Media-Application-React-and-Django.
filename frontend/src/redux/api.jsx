// Need to use the React-specific entry point to import createApi
import { useContext } from 'react'
import { Context } from '../context'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
 
const storedData = localStorage.getItem('bool');

// Parse the JSON string to get the object
const parsedData = JSON.parse(storedData);
// Access the individual properties
 
const tokenValue = parsedData !== null ? parsedData.token : null;
 
// Define a service using a base URL and expected endpoints
export const djangoApi = createApi({
  reducerPath: 'djangoApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://socialkindness-1c60d659e24d.herokuapp.com/' }),
  tagTypes: ['Posts'],
  endpoints: (builder) => ({
    likeReply: builder.mutation({
      query: (postId) => ({
        url: `api/replies/${postId}/like_reply/`,
        method: 'POST',
        headers: {
          'Authorization': `Token ${tokenValue}`,
        },
      }),
      
      invalidatesTags: ["Posts"]
    }),
    likeComment: builder.mutation({
      query: (postId) => ({
        url: `api/comments/${postId}/like_comment/`,
        method: 'POST',
        headers: {
          'Authorization': `Token ${tokenValue}`,
        },
      }),
      
      invalidatesTags: ["Posts"]
    }),
    like: builder.mutation({
      query: (postId) => ({
        url: `api/posts/${postId}/like_post/`,
        method: 'POST',
        headers: {
          'Authorization': `Token ${tokenValue}`,
        },
      }),
      
      invalidatesTags: ["Posts"]
    }),

    getCommentUser: builder.query({
      query: (post_id) => `api/comments/get_comments_for_post/?post_id=${post_id}`,
      providesTags: ['Posts'],
      headers: {
        'Authorization': `Token ${tokenValue}`,
      },
    }),
    getPost: builder.query({
      query: () => 'api/posts/',
      providesTags: ['Posts'],
      headers: {
        'Authorization': `Token ${tokenValue}`,
      },
      transformResponse: (response) => {
        // Reverse the order of posts before returning the data
        return response.slice().reverse();
      },
    }),
    getPostListUser: builder.query({
      query: () => 'api/allposts/',
      providesTags: ['Posts'],
      headers: {
        'Authorization': `Token ${tokenValue}`,
      },
      transformResponse: (response) => {
        // Reverse the order of posts before returning the data
        return response.slice().reverse();
      },
    }),
    allPost: builder.mutation({
      query: (credentials) => ({
        url: 'api/posts/',
        method: 'POST',
        body: credentials,
        headers: {
          'Authorization': `Token ${tokenValue}`,
        },
      }),
      invalidatesTags: ["Posts"]
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: 'api/accounts/login/',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ["Posts"]
    }),
    postDelete: builder.mutation({
      query: (id) => ({
        url: `api/posts/${id}`,
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${tokenValue}`,
        },
      }),
      invalidatesTags: ["Posts"]
    }),

    logout: builder.mutation({
      query: (token) => ({
        url: 'api/accounts/logout/',
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
        },
      }),
      invalidatesTags: ["Posts"]
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
  useLoginMutation, 
  useLogoutMutation, 
  useAllPostMutation, 
  useGetPostListUserQuery, 
  useGetCommentUserQuery, 
  useLikeMutation,
  useLikeCommentMutation,
  useLikeReplyMutation,
  useGetPostQuery,
  usePostDeleteMutation
  

} = djangoApi;
