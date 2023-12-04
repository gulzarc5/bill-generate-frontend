// store/index.js
// src/stores/index.js

import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import auth from "./modules/auth"; // Import your store modules

const store = createStore({
  modules: {
    auth,
  },
  plugins: [createPersistedState()], // Use createPersistedState plugin
  strict: process.env.NODE_ENV !== "production", // Enable strict mode in development
});

export default store;
