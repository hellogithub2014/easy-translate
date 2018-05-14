import Vue from 'vue';
import Vuex from 'vuex';

import mutations from './mutations';
import actions from './actions';
import getters from './getters';

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

// 获取英文词包， TODO: 去除mock接口
const fetchEN = fetch('http://www.mocky.io/v2/5af8ec1f320000971086af3c').then((resp) => {
  if (!resp.ok) {
    return Promise.reject('fetch en failed');
  }
  return resp.json();
});
// 获取中文词包， TODO: 去除mock接口
const fetchZH = fetch('http://www.mocky.io/v2/5af8ec81320000151186af3d').then((resp) => {
  if (!resp.ok) {
    return Promise.reject('fetch zh.json failed');
  }
  return resp.json();
});
Promise.all([fetchEN, fetchZH])
  .then(([en, zh]) => {
    store.state.messages.en = { ...en };
    store.state.messages.zh = { ...zh };
  })
  .catch(console.error); // eslint-disable-line

export default store;
