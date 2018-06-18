import TYPES from './mutation-types';
import apiService from '../utils/api-service';

export default {
  [TYPES.UPDATE_TO_LOCALE]({ commit, state }, newToLocale) {
    // 优先缓存
    if (state.messages[newToLocale]) {
      commit(TYPES.UPDATE_TO_LOCALE, newToLocale);
    } else {
      apiService[`fetch${newToLocale.toUpperCase()}`]()
        .then((message) => {
          commit(TYPES.ADD_LOCALE, { newLocale: newToLocale, message }); // 添加词包
          commit(TYPES.UPDATE_TO_LOCALE, newToLocale); // 切换目标语言
        })
        .catch((err) => {
          this.$message.error(err);
        });
    }
  },
  /**
   *
   *
   * @author liubin.frontend
   * @param {any} { commit }
   * @param {any} { locale, entryList }
   */
  [TYPES.BATCH_ADD_ENTRY]({ state, commit, getters }, { entryList, scene }) {
    // 每种语言中默认也塞入同样的内容
    getters.validToLocaleList.forEach((lo) => {
      if (!state.messages[lo]) {
        return; // 目标语言的词条还没有获取到本地
      }
      // 一批词条使用同一个场景列表
      entryList.forEach(({ path, text }) => {
        commit(TYPES.ADD_ENTRY, { locale: lo, path, text, scene });
      });
    });
  },
  [TYPES.DELETE_ENTRY]({ commit }, { path }) {
    // TODO: 需要发送请求删除所有语言的path词条
    commit(TYPES.DELETE_ENTRY, { path });
  },
  [TYPES.UPDATE_TEXT_SCENE]({ commit }, { path, scene }) {
    // TODO: 需要发送请求更新场景
    commit(TYPES.UPDATE_TEXT_SCENE, { path, scene });
  },
};
