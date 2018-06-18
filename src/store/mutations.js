import Vue from 'vue';
import TYPES from './mutation-types';

export default {
  [TYPES.UPDATE_TEXT](state, { locale, path, newText }) {
    const { messages } = state;
    const { text: pathValue } = messages[locale][path];
    if (messages[locale] && pathValue !== undefined && pathValue !== null) {
      messages[locale][path].text = newText;
    }
  },
  [TYPES.UPDATE_TO_LOCALE](state, newToLocale) {
    state.toLocale = newToLocale;
  },
  [TYPES.ADD_LOCALE](state, { newLocale, message }) {
    // 遵循响应规则： https://vuex.vuejs.org/zh-cn/mutations.html
    state.messages = {
      ...state.messages,
      [newLocale]: message,
    };
  },
  [TYPES.ADD_ENTRY](state, { locale, path, text, scene }) {
    const localeMessage = state.messages[locale];
    state.messages[locale] = {
      ...localeMessage,
      [path]: {
        text,
        scene,
      },
    };
  },
  [TYPES.UPDATE_MODE](state, mode) {
    state.mode = mode;
  },
  [TYPES.DELETE_ENTRY](state, { path }) {
    Object.keys(state.messages).forEach((locale) => {
      Vue.delete(state.messages[locale], path);
    });
  },
  [TYPES.UPDATE_TEXT_SCENE](state, { path, scene }) {
    Object.keys(state.messages).forEach((locale) => {
      const message = state.messages[locale];
      message[path].scene = scene;
    });
  },
};
