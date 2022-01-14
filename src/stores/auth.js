const state = {
  loggedIn: false,
};

const getters = {
  loggedIn(state) {
    return state.loggedIn;
  },
};

const mutations = {
  setLoggedIn(state, loggedIn) {
    state.loggedIn = loggedIn;
  },
};

const actions = {
  setLoggedIn({ commit }, loggedIn) {
    commit("setLoggedIn", loggedIn);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
