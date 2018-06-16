import _ from 'lodash';
import { MODE } from '../const/store';

export default {
  /**
   * 翻译列表中的每一条key. 会返回类似 'a.b.c' 的数组
   *
   * @author liubin.frontend
   * @param {any} state
   * @returns 例如['a', 'b']之类的数组
   */
  textPathList(state) {
    return locale => Object.keys(state.messages[locale]);
  },

  /**
   * 获取目标语言所有词包
   *
   * @author liubin.frontend
   * @param {*} state
   * @returns
   */
  getLocaleMessages(state) {
    return locale => state.messages[locale];
  },

  /**
   * 根据path获取对应的词条文本
   *
   * @author liubin.frontend
   * @param {any} state
   * @returns
   */
  getTextByPath(state) {
    return (locale, path) => _.get(state.messages[locale], path).text;
  },

  /**
   * 获取词条场景图片
   *
   * @author liubin.frontend
   * @param {*} state
   * @returns
   */
  getTextScene(state) {
    return (locale, path) => _.get(state.messages[locale], path).scene;
  },

  /**
   * 可选的目标语言
   *
   * @author liubin.frontend
   * @param {any} state
   * @returns
   */
  validToLocaleList(state) {
    const { availableLocales } = state;
    return Object.keys(availableLocales).map(key => availableLocales[key]);
  },

  /**
   * 是否为普通模式
   *
   * @author liubin.frontend
   */
  isNormalMode(state) {
    return state.mode === MODE.NORMAL;
  },

  isExpertMode(state) {
    return state.mode === MODE.EXPERT;
  },
};
