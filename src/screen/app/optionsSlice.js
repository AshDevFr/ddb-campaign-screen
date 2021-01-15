import { createSlice } from '@reduxjs/toolkit';

const optionsSlice = createSlice({
  name: 'options',
  initialState: {
    characterIds: []
  },
  reducers: {
    addId: (state, { payload }) => {
      if (!payload) return;

      state.characterIds.push({
        id: payload,
        uid: Math.random()
          .toString(36)
          .substring(2, 15)
      });
    },
    removeId: (state, { payload }) => {
      state.characterIds = state.characterIds.filter(
        char => char.uid !== payload.uid
      );
    }
  }
});

export const { addId, removeId } = optionsSlice.actions;

export default optionsSlice.reducer;
