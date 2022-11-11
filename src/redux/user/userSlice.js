import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  shouldRefresh: false,
  updateDashboard: true,
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
    setUpdateDashboard: (state, action) => {
      return {...state, updateDashboard: true};
    },
    unsetUpdateDashboard: (state, action) => {
      return {...state, updateDashboard: false};
    },
  },
});

export const {
  setShouldRefresh,
  unsetShouldRefresh,
  setUpdateDashboard,
  unsetUpdateDashboard,
} = userSlice.actions;
export default userSlice.reducer;
