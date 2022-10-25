import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  accessToken: null,
  user: null,
};
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      // console.log('dispatchd login', action);
      return {...state, ...action.payload};
    },
    updatePassword: (state, action) => {
      console.log(action);
    },
    logout: (state, action) => {
      return initialState;
    },
  },
});

export const {login, updatePassword, logout} = authSlice.actions;
export default authSlice.reducer;
