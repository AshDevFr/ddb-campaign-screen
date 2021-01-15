import { createSlice } from '@reduxjs/toolkit';

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    isOpen: false
  },
  reducers: {
    openMenu: state => {
      state.isOpen = true;
    },
    closeMenu: state => {
      state.isOpen = false;
    },
    toogleMenu: state => {
      state.isOpen = !state.isOpen;
    }
  }
});

export const { openMenu, closeMenu, toogleMenu } = menuSlice.actions;

export default menuSlice.reducer;
