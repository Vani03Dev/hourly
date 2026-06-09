import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  isSidebarOpen: boolean;
  activeBookingId: string | null;
}

const initialState: AppState = {
  isSidebarOpen: false,
  activeBookingId: null,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    setActiveBooking: (state, action: PayloadAction<string | null>) => {
      state.activeBookingId = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setActiveBooking } = appSlice.actions;

export default appSlice.reducer;
