import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/pagelets/HelloWorld';
import Translate from '@/pagelets/Translate';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: Translate,
    },
    {
      path: '/hello-world',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    {
      path: '/translate',
      component: Translate,
    },
  ],
});
