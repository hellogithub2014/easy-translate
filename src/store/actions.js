import TYPES from './mutation-types';

function fetchLocaleMessage(locale) {
  // TODO: 通过接口获取词包
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const r = Math.random();
      if (r > 0.5) {
        resolve({
          greet: `ホーム ${locale}`,
          variables: 'ブランド広告 {name} , {age}',
          plural: 'レポート {n, plural, =0{トラッキングツール}  other{# アカウント一覧} }.',
          selectordinal: 'セットコピー {POS, selectordinal, other{#クリックして更新}}',
          select:
            '{gender, select, male{認証コード} female{同意する} other{新規登録}} ログインできない場合.',
          number: '現地時間: {current} , アニメ: {current, number, percent}',
          time: '興味関心一覧: {current, time, short}',
        });
      } else {
        reject('获取对应词包失败');
      }
    }, 2000);
  });
}

export default {
  [TYPES.UPDATE_TO_LOCALE]({ commit, state }, newToLocale) {
    // 优先缓存
    if (state.messages[newToLocale]) {
      commit(TYPES.UPDATE_TO_LOCALE, newToLocale);
    } else {
      fetchLocaleMessage(newToLocale)
        .then((message) => {
          commit(TYPES.ADD_LOCALE, { newLocale: newToLocale, message }); // 添加词包
          commit(TYPES.UPDATE_TO_LOCALE, newToLocale); // 切换目标语言
        })
        // eslint-disable-next-line
        .catch(console.error);
    }
  },
  /**
   *
   *
   * @author liubin.frontend
   * @param {any} { commit }
   * @param {any} { locale, entryList }
   */
  [TYPES.BATCH_ADD_ENTRY]({ state, commit, getters }, { entryList }) {
    // 每种语言中默认也塞入同样的内容
    getters.validToLocaleList.forEach((lo) => {
      if (!state.messages[lo]) {
        return; // 目标语言的词条还没有获取到本地
      }
      entryList.forEach(({ path, text }) => {
        commit(TYPES.ADD_ENTRY, { locale: lo, path, text });
      });
    });
  },
};
