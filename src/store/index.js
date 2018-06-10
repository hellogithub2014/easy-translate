import Vue from 'vue';
import Vuex from 'vuex';

import mutations from './mutations';
import actions from './actions';
import getters from './getters';
import apiService from '../utils/api-service';

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
  .catch(err => this.$message.error(err));

export default store;
