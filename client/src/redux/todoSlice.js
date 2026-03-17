import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../services/api';
import { toast } from 'react-hot-toast';

// Async Thunks
export const fetchTodos = createAsyncThunk('todos/fetchAll', async () => {
    const response = await api.getTodos();
    return response.data;
});

export const addTodo = createAsyncThunk('todos/add', async (todoData) => {
    const response = await api.createTodo(todoData);
    return response.data;
});

export const toggleTodo = createAsyncThunk('todos/toggle', async (todo) => {
    const response = await api.updateTodo(todo._id, { completed: !todo.completed });
    return response.data;
});

export const updateTodoThunk = createAsyncThunk('todos/update', async ({ id, updates }) => {
    const response = await api.updateTodo(id, updates);
    return response.data;
});

export const removeTodo = createAsyncThunk('todos/remove', async (id) => {
    await api.deleteTodo(id);
    return id;
});

const todoSlice = createSlice({
    name: 'todos',
    initialState: {
        items: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Todos
            .addCase(fetchTodos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                toast.error('Failed to fetch tasks');
            })
            // Add Todo
            .addCase(addTodo.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
                toast.success('Task added successfully');
            })
            .addCase(addTodo.rejected, () => {
                toast.error('Failed to add task');
            })
            // Toggle Todo
            .addCase(toggleTodo.fulfilled, (state, action) => {
                const index = state.items.findIndex(t => t._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(toggleTodo.rejected, () => {
                toast.error('Failed to update task');
            })
            // Update Todo (Edit)
            .addCase(updateTodoThunk.fulfilled, (state, action) => {
                const index = state.items.findIndex(t => t._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                toast.success('Task updated');
            })
            .addCase(updateTodoThunk.rejected, () => {
                toast.error('Failed to update task');
            })
            // Remove Todo
            .addCase(removeTodo.fulfilled, (state, action) => {
                state.items = state.items.filter(t => t._id !== action.payload);
                toast.success('Task deleted');
            })
            .addCase(removeTodo.rejected, () => {
                toast.error('Failed to delete task');
            });
    },
});

export default todoSlice.reducer;
