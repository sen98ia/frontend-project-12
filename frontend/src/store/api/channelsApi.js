import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setActive, setDefault } from '../slices/channelsSlice.js';
import routes from '../../routes.js';

export const channelsApi = createApi({
  reducerPath: 'channelsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: routes.channelsPath(),
    prepareHeaders: (headers) => {
      const { token } = JSON.parse(localStorage.getItem('user'));
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Channel', 'Message'],
  endpoints: (builder) => ({
    getChannels: builder.query({
      query: () => '',
      providesTags: ['Channel'],
    }),
    addChannel: builder.mutation({
      query: (channelName) => ({
        method: 'POST',
        body: channelName,
        invalidatesTags: ['Channel'],
      }),
    }),
    editChannel: builder.mutation({
      query: ({ id, ...editedChannel }) => ({
        url: id,
        method: 'PATCH',
        body: editedChannel,
        invalidatesTags: ['Channel'],
      }),
      onQueryStarted: async (channelData, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setActive(data));
        } catch (error) {
          dispatch(setDefault());
        }
      },
    }),
    removeChannel: builder.mutation({
      query: (id) => ({
        url: id,
        method: 'DELETE',
        invalidatesTags: ['Channel', 'Message'],
      }),
      onQueryStarted: async (channelData, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setActive(data));
        } catch (error) {
          dispatch(setDefault());
        }
      },
    }),
  }),
});

const {
  useGetChannelsQuery,
  useAddChannelMutation,
  useEditChannelMutation,
  useRemoveChannelMutation,
} = channelsApi;

export {
  useGetChannelsQuery as getChannels,
  useAddChannelMutation as addChannel,
  useEditChannelMutation as editChannel,
  useRemoveChannelMutation as removeChannel,
};
