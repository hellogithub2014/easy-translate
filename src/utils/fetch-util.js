export default {
  get(url, options) {
    return fetch(url, options).then((resp) => {
      if (!resp.ok) {
        return Promise.reject('fetch en failed');
      }
      return resp.json();
    });
  },
};
