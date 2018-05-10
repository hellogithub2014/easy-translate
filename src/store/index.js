import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    messages: {
      en: {
        greet: 'hello world',
        variables: 'my name is {name}, my age is {age}',
        plural: 'You have {n, plural, =0{no messages} one{1 message}  other{# messages} }.', // other是必须滴
        selectordinal: 'You are {POS, selectordinal, one{#st} two{#nd} few{#rd} other{#th}}',
        select: '{gender, select, male{He} female{She} other{They}} liked this.',
        number: 'current is: {current} , percent is: {current, number, percent}',
        time: 'Current Time: {current, time, short}',
      },
      zh: {
        greet: '你好',
        variables: '姓名： {name}, 年龄： {age}',
        // other是必须滴。 中文环境下，不需要one的选项，因为one和other显示时没有区别.
        // 不同环境下使用不用plural参见：http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
        plural: '你 {n, plural, =0{没有消息}  other{# 条消息} } 未读.',
        selectordinal: '你是 {POS, selectordinal, other{第 #}} 名',
        select: '{gender, select, male{他} female{她} other{他们}} 喜欢这样.',
        number: '当前是: {current} , 转换为百分比是: {current, number, percent}',
        time: '当前时间: {current, time, short}',
      },
      fromLocale: 'zh',
      toLocale: 'en',
    },
  },
  getters: {
    messages(state) {
      return state.messages;
    },
    getTextByPath(state, messages) {
      return (locale, path) => messages[locale][path];
    },
  },
});

export default store;
