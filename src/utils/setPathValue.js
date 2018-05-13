import _ from 'lodash';
import Vue from 'vue';
import castPath from './castPath';
import toKey from './toKey';
import isIndex from './isIndex';

export default function setPathValue(object, path, value) {
  if (!_.isObject(object)) {
    return object;
  }
  // eslint-disable-next-line
  path = castPath(path, object);

  const length = path.length;
  const lastIndex = length - 1;

  let index = -1;
  let nested = object;

  // eslint-disable-next-line
  while (nested != null && ++index < length) {
    const key = toKey(path[index]);
    let newValue = value;

    if (index !== lastIndex) {
      const objValue = nested[key];
      // eslint-disable-next-line
      newValue = _.isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
    }

    // nested[key] = newValue;
    Vue.set(nested, key, newValue); // 添加属性时要遵循vue的响应式原则

    nested = nested[key];
  }
  return object;
}
