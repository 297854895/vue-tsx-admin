import { MutationTree  } from 'vuex'

import { AppState } from './types'


const mutations: MutationTree<AppState> = {
  TEST_CHANGE(state) {
    state.state += 1
  }
};

export default mutations;
