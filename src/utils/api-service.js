import fetchUtil from './fetch-util';
import api from '../const/api';

export default {
  fetchEN() {
    return fetchUtil.get(api.lang.en);
  },
  fetchZH() {
    return fetchUtil.get(api.lang.zh);
  },
  fetchJA() {
    return fetchUtil.get(api.lang.ja);
  },
};
