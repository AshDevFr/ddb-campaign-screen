import { createSlice } from '@reduxjs/toolkit';
import { sendMessage } from '../../common/utils';

function startLoading(state) {
  state.isLoading = true;
}

function loadingFailed(state, error) {
  state.isLoading = false;
  state.error = error;
}

const characterSlice = createSlice({
  name: 'characters',
  initialState: {
    isLoading: false,
    error: null,
    characters: {}
  },
  reducers: {
    getCharacterStart: startLoading,
    getCharacterSuccess: (state, { payload }) => {
      state.characters = {
        ...state.characters,
        [payload.character.id]: payload.character
      };
      state.isLoading = false;
      state.error = null;
    },
    getCharacterFailure: loadingFailed
  }
});

export const {
  getCharacterStart,
  getCharacterSuccess,
  getCharacterFailure
} = characterSlice.actions;
export default characterSlice.reducer;

export const fetchCharacter = (id, tabId) => async dispatch => {
  try {
    dispatch(getCharacterStart());
    sendMessage(tabId, 'fetch', id).then(character => {
      if (!character)
        return dispatch(
          getCharacterFailure(`Failed to fetch the character ${id}`)
        );
      dispatch(getCharacterSuccess({ character }));
    });
  } catch (err) {
    dispatch(getCharacterFailure(err.toString()));
  }
};
