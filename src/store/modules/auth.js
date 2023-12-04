// store/modules/auth.js

const state = {
    user: null,
    token: null,
    user_type: null
};

const mutations = {
    SET_USER(state, user) {
        state.user = user;
    },
    SET_TOKEN(state, token) {
        state.token = token;
    },
    clearAuthState(state) {
        state.user = null;
        state.token = null;
        state.user_type = null;
    },
    SET_USER_TYPE(state, user_type) {
      state.user_type = user_type;
    },
};

const getters = {
    isAuthenticated(state) {
        return !!state.token && !!state.user;
    },
    getUser(state) {
        return state.user;
    },
    getToken(state) {
        return state.token;
    },
    getUserType(state) {
      return state.user_type;
    }
};

const actions = {
    loginDataSave({ commit }, { user, token,user_type }) {
        commit('SET_USER', user);
        commit('SET_TOKEN', token);
        commit('SET_USER_TYPE', user_type);
    },
    logout({ commit }) {
        commit('SET_USER', null);
        commit('SET_TOKEN', null);
        commit('SET_USER_TYPE', null);
    }
};

export default {
    namespaced: true, // Add this line to make the module namespaced
    state,
    mutations,
    actions,
    getters
};
