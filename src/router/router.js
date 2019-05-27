/* eslint-disable standard/object-curly-even-spacing */
import Vue from 'vue'
import Router from 'vue-router'

const index = resolve => require(['@/components/front/index'], resolve)
// const AboutMe = resolve => require(['@/components/front/AboutMe'], resolve)
const Nothing = resolve => require(['@/components/front/Nothing'], resolve)
const Article = resolve => require(['@/components/front/component/Article'], resolve)
const NotPoem = resolve => require(['@/components/front/NotPoem'], resolve)
const Friend = resolve => require(['@/components/front/Friend'], resolve)
const VisitLook = resolve => require(['@/components/manage/VisitLook'], resolve)
// const Articles = resolve => require(['@/components/front/Articles'], resolve)
// const contact = resolve => require(['@/components/front/contact'], resolve)
// const login = resolve => require(['@/components/back/login'], resolve)
// const admin = resolve => require(['@/components/back/admin'], resolve)
// const posts = resolve => require(['@/components/back/posts'], resolve)
// const editor = resolve => require(['@/components/back/editor'], resolve)
// const drafts = resolve => require(['@/components/back/drafts'], resolve)
// const search = resolve => require(['@/components/back/search'], resolve)
// const article = resolve => require(['@/components/front/article'], resolve)
// const account = resolve => require(['@/components/back/account'], resolve)
// const SearchResult = resolve => require(['@/components/front/SearchResult'], resolve)

Vue.use(Router)

const router = new Router({
    mode: 'history',
    scrollBehavior (to, from, savedPosition) {
        if (to.hash) {
            return {
                selector: to.hash
            }
        } else {
            return { x: 0, y: 0 }
        }
    },
    routes: [
        {
            path: '/',
            redirect: '/nothing',
            component: index,
            children: [
                { path: 'nothing', name: 'nothing', component: Nothing, meta: { title: 'HELLO?' } },
                { path: 'article', name: 'article', component: Article, meta: { title: 'HELLO?' } },
                { path: 'notpoem', name: 'notpoem', component: NotPoem, meta: { title: 'HELLO?' } },
                { path: 'friend', name: 'friend', component: Friend, meta: { title: 'HELLO?' } },
                { path: 'visit', name: 'visit', component: VisitLook, meta: { title: 'HELLO?' }}
            ]
        },
        {
            path: '/login',
            name: 'login',
            // component: login,
            meta: { title: '登录页面' }
        },
        {
            path: '/article',
            redirect: '/article'
            // component: Article
        }
        // {
        //     this.set_dialog({
        //         info: '',
        //         show: false
        //     })
        // },
        // confirm () {
        //     this.dialog.show = false
        //     this.dialog.resolveFn()
        // },
        // cancel () {
        //     path: '/admin',
        //     redirect: '/admin/posts',
        //     component: admin,
        //     children: [
        //         { path: 'posts', name: 'posts', component: posts, meta: { requireAuth: true, title: '博客文章' } },
        //         { path: 'editor', name: 'editor', component: editor, meta: { requireAuth: true, title: '编辑文章' } },
        //         { path: 'drafts', name: 'drafts', component: drafts, meta: { requireAuth: true, title: '博客草稿' } },
        //         { path: 'search', name: 'search', component: search, meta: { requireAuth: true, title: '搜索结果' } },
        //         { path: 'account', name: 'account', component: account, meta: { requireAuth: true, title: '修改账户' } }
        //     ]
        // }
    ]
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    next()
})

export default router
