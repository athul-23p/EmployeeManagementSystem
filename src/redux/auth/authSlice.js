import {createSlice} from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticate: false,
    accessToken: null,
    role: null,
  },
  reducers: {
    login: (state, action) => {
      console.log('dispatchd login', action);
    },
    updatePassword: (state, action) => {
      console.log(action);
    },
  },
});

export const {login, updatePassword} = authSlice.actions;
export default authSlice.reducer;
