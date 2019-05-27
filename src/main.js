import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import router from './router/router'
import store from './store'
import axios from './components/http/http'
import './assets/css/index.scss'
import querystring from 'querystring'

Vue.config.productionTip = false
Vue.prototype.$qs = querystring
Vue.prototype.$http = axios
Vue.use(VueResource)

Vue.filter('toDate', (date) => {
    if (date) {
        const d = new Date(date)
        const minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
        const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
        return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' +
            d.getDate() + '日 ' + hours + ' : ' + minutes
    }
})

Vue.filter('to_date', (date) => {
    if (date) {
        const d = new Date(date)
        const minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
        const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' +
            d.getDate() + ' ' + hours + ': ' + minutes
    }
})

Vue.filter('toTag', (arr) => {
    if (arr) {
        return arr.join('，')
    }
})

Vue.filter('dateAgo', (num) => {
    const curDate = new Date()
    const ago = new Date(curDate.getTime() - num * 24 * 60 * 60 * 1000)
    return (ago.getMonth() + 1) + '/' + ago.getDate()
})

Vue.http.interceptors.push((request, next) => {
    if (window.localStorage.getItem('token')) {
        request.headers.set('authorization', 'Bearer ' + window.localStorage.getItem('token'))
    }
    next((response) => {
        if (response.status === 401) {
            store.commit('unset_user')
            router.go({ name: 'login' })
        }
        return response
    })
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})
