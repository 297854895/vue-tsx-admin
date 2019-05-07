import { ActionTree } from 'vuex';

import { AppState } from './types';

const actions: ActionTree<AppState, any> = {
  testAction({ commit }) {
    commit('TEST_CHANGE');
  }
};

export default actions;
