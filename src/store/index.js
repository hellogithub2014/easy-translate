import Vue from 'vue';
import Vuex from 'vuex';

import mutations from './mutations';
import actions from './actions';
import getters from './getters';
import apiService from '../utils/api-service';
import { MODE } from '../const/store';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    messages: {
      en: {},
      zh: {},
    },
    availableLocales: {
      zh: 'zh',
      en: 'en',
      ja: 'ja',
    },
    fromLocale: 'zh',
    toLocale: 'en',
    mode: MODE.NORMAL,
  },
  getters,
  mutations,
  actions,
});

// 默认加载英文和中文
Promise.all([apiService.fetchEN(), apiService.fetchZH()])
  .then(([en, zh]) => {
    store.state.messages.en = { ...en };
    store.state.messages.zh = { ...zh };
  })
  // eslint-disable-next-line
  .catch(console.error);

export default store;
