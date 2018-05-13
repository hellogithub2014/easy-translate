import _ from 'lodash';

/**
 *
 *
 * @author liubin.frontend
 * @param {any} obj
 * @param {string[]} result
 */
function getKeysDeep(obj, result, prefix) {
  const curLevelKeys = Object.keys(obj);
  result.push(
    ...curLevelKeys
      .filter(key => !_.isObject(obj[key]))
      .map(key => (prefix ? `${prefix}.${key}` : key)),
  );

  curLevelKeys.forEach((key) => {
    if (_.isObject(obj[key])) {
      getKeysDeep(obj[key], result, prefix ? `${prefix}.${key}` : key);
    }
  });
}

/**
 * 获取对象的所有值为普通值类型的键。
 * @example
 * deepKeys({ a: 1, b: { c: 2, d: [1, 2, 3] } })
 * // [ 'a', 'b.c', 'b.d.0', 'b.d.1', 'b.d.2' ]
 *
 * deepKeys({a: 1, b: 2})
 * // ['a', 'b']
 *
 * deepKeys({a: [1, 2, 3]})
 * // ['a.0', 'a.1']
 *
 * @author liubin.frontend
 * @export
 * @param {any} obj
 */
export default function deepKeys(obj) {
  const keys = [];
  getKeysDeep(obj, keys);
  return keys;
}

// use Quokka plugin to test the followings
// console.log(deepKeys({ a: 1, b: { c: 2, d: [1, 2, 3] } }));
// console.log(deepKeys({ a: 1, b: 2 }));
// console.log(deepKeys({ a: [1, 2, 3] }));
