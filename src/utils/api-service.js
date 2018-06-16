import fetchUtil from './fetch-util';
import api from '../const/api';

/**
 * 将后端返回的词条数组转为对象
 *
 * @author liubin.frontend
 * @param {{path:string,value:string}[]} list
 * @returns
 */
function langListToObject(list) {
  return list.reduce(
    (result, item) =>
      Object.assign(result, {
        [item.path]: {
          text: item.value,
          scene: item.scene,
        },
      }),
    {},
  );
}

export default {
  fetchEN() {
    return fetchUtil.get(api.lang.en).then(resp => langListToObject(resp.data));
  },
  fetchZH() {
    return fetchUtil.get(api.lang.zh).then(resp => langListToObject(resp.data));
  },
  fetchJA() {
    return fetchUtil.get(api.lang.ja).then(resp => langListToObject(resp.data));
  },
};
