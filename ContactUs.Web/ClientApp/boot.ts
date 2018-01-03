import './css/site.css';
import 'bootstrap';
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

const routes = [
    { path: '/', component: require('./components/home/home.vue') },
    { path: '/contactus', component: require('./components/contactus/contactus.vue') }
];

new Vue({
    el: '#app-root',
    router: new VueRouter({ mode: 'history', routes: routes }),
    render: h => h(require('./components/app/app.vue'))
});
