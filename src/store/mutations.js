import TYPES from './mutation-types';
import setPathValue from '../utils/setPathValue';

export default {
  [TYPES.UPDATE_TEXT](state, { locale, path, newText }) {
    const { messages } = state;
    const pathValue = messages[locale][path];
    if (messages[locale] && pathValue !== undefined && pathValue !== null) {
      messages[locale][path] = newText;
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
  [TYPES.ADD_ENTRY](state, { locale, path, text }) {
    const localeMessage = state.messages[locale];
    setPathValue(localeMessage, path, text);
  },
};
