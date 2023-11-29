import { createSlice } from '@reduxjs/toolkit';

const user = {
  URL: '',
  method: '',
  URL_SORTEOS: ''
};

export const userSlice = createSlice({
  name: 'user',
  initialState: user,
  reducers: {
    modifyUser: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    resetUser: () => user
  },
});

export const {
  modifyUser,
  resetUser
} = userSlice.actions;

export default userSlice.reducer;
