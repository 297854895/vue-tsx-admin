import { MutationTree  } from 'vuex'

import { RouterLocalStore } from './types'


const mutations: MutationTree<RouterLocalStore> = {
  TEST_CHANGE(state) {
    state.state += 1
  }
};

export default mutations;
