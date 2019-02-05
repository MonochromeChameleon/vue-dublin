import VueRouter from 'vue-router';
import Vue from 'vue';

import markdownRouteGenerator from './generate-markdown-routes';
import allContent from './all-content';

const contentPages = markdownRouteGenerator(allContent);

const routes = [
  ...contentPages,
  {
    path: '*',
    redirect: '/'
  }
];

Vue.use(VueRouter);

export default new VueRouter({
  routes,
  linkActiveClass: 'active',
  mode: 'history'
});
