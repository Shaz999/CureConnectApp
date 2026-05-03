import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    // Define actions for showing and hiding loading
    showLoading: (state) => {
      state.loading = true;
    },
    hideLoading: (state) => {
      state.loading = false;
    },
  },
});

// Export the actions and the reducer
export const { showLoading, hideLoading } = alertSlice.actions;
export default alertSlice.reducer;
