import { ActionTree } from 'vuex';

import { HomeState } from './types';

import { homeApi } from '@/api'

const actions: ActionTree<HomeState, any> = {
  async getProgramStatis({ commit }) {
    const res = await homeApi.getProgramStatis()
    commit('GET_PROGRAM_STATIS', res);
  },
  async getMoment({ commit }) {
    const res = await homeApi.getMoment()
    commit('GET_MOMENT', res);
  },
  async getTeam({ commit }) {
    const res = await homeApi.getTeam()
    commit('GET_TEAM', res);
  },
};

export default actions;
