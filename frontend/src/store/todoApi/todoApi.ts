import { rtkBaseQuery } from '@/utils/rtk';
import { createApi } from '@reduxjs/toolkit/query/react';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export const TODO_TAG = 'todos';

export const todoApi = createApi({
  reducerPath: 'todo',
  baseQuery: rtkBaseQuery(),
  tagTypes: [TODO_TAG],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => ({ url: 'todos', method: 'get' }),
      providesTags: [TODO_TAG],
    }),
    postTodo: builder.mutation<Todo, Todo>({
      query: (todo) => ({ url: 'todos', method: 'post', data: todo }),
      invalidatesTags: [TODO_TAG],
    }),
    deleteTodo: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({ url: `todos/${id}`, method: 'delete' }),
      invalidatesTags: [TODO_TAG],
    }),
  }),
});

export const {
  useGetTodosQuery,
  usePostTodoMutation,
  useDeleteTodoMutation,
  useLazyGetTodosQuery,
} = todoApi;
