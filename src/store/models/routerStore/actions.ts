import { ActionTree } from 'vuex';

import { RouterLocalStore } from './types';

const actions: ActionTree<RouterLocalStore, any> = {
  testAction({ commit }) {
    commit('TEST_CHANGE');
  }
};

export default actions;
