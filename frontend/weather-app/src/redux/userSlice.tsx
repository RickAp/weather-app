import { createSlice, PayloadAction  } from '@reduxjs/toolkit';

interface UserState {
  token: string | null;
  user: any | null; 
  favorites: string[];
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: null,
    user: null,
    favorites: [],
  } as UserState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.favorites = action.payload.favorites ? action.payload.favorites.filter((fav: any) => fav && fav.trim() !== "") : [];
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.favorites = [];
    },
    addFavorite: (state, action: PayloadAction<string>) => {
      if (state.favorites.length < 5 && !state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(city => city !== action.payload);
    },
  },
});

export const { login, logout, addFavorite, removeFavorite } = userSlice.actions;

export default userSlice.reducer;