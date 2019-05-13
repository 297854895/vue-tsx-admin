import { MutationTree  } from 'vuex'

import { HomeState } from './types'


const mutations: MutationTree<HomeState> = {
  GET_PROGRAM_STATIS(state, data) {
    state.programStatis = data
  },
  GET_MOMENT(state, data) {
    state.moment = data
  },
  GET_TEAM(state, data) {
    state.team = data
  }
};

export default mutations;
