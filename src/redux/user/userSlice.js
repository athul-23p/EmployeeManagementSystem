import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  shouldRefresh: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setShouldRefresh: (state, action) => {
      return {...state, shouldRefresh: true};
    },
    unsetShouldRefresh: (state, action) => {
      return {...state, shouldRefresh: false};
    },
  },
});

export const {setShouldRefresh, unsetShouldRefresh} = userSlice.actions;
export default userSlice.reducer;
