<template>
    <div class="container">
        <div>
            <section class="newBlog">
                <div class="posts animated fadeIn">
                    <div class="flex">
                        <div v-for="(article, index) in reducedArticles" class="oneArticle">
                            <div class="option">
                                <time>{{article.createDate | toDate}}</time>
                                <a>{{article.title}}</a>
                                <button v-show="$store.state.isAdmin">编辑</button>
                                <button v-show="$store.state.isAdmin" @click="deleteArticle(article.id)">删除</button>
                            </div>
                            <p class="content">{{'&emsp;&emsp;'+article.content.substring(0,article.content.substring(0,600).lastIndexOf('\n')).replace(/\n/g,'\n&emsp;&emsp;')}}<br/>&emsp;&emsp;......</p>
                            <router-link :to="{name: 'article', query: {id: article.id}}" tag="button" exact>
                                <span>Read More</span>
                            </router-link> 
                        </div>
                    </div>
                </div>
            </section>
            <!-- <div class="more_div"><p  id="more" @click="more()">---M O R E---</p></div> -->
        </div>
    </div>
</template>

<script>
// import {mapMutations, mapActions, mapGetters}   from 'vuex'

export default {
    data () {
        return {
            reducedArticles: [],
            toDay: new Date(),
            numPerPage: 5,
            totalNum: -1
        }
    },
    created () {
        this.totalNum = this.numPerPage
        this.getArticles()
    },
    computed: {
    },
    methods: {
        more: function () {
            this.totalNum += this.numPerPage
            this.getArticles()
        },
        getArticles: function () {
            this.$http.get('/api/article', {
                params: {
                    g: '1',
                    pn: '1',
                    pp: this.totalNum
                }
            }).then((response) => {
                this.reducedArticles = response.data.data
            }).catch(e => {
                console.log(e)
            })
        },
        deleteArticle: function (id) {
            this.$http.delete('/api/article/' + id).then(r => this.getArticles())
        }
    },
    mounted () {
    }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.container {
    background:#ffffff;
    width: 100%;
    height: 100%;
    .newBlog {
        min-height: 43.75rem;
        .posts {
            margin-top:1rem;
            .flex {
                align-content: space-between;
                color: #777;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                padding-left: 2rem;
                padding-right: 2rem;
                div.oneArticle {
                    background: #ffffff;
                    flex-shrink: 1;
                    width: 60rem;
                    white-space: pre-line;
                    border: none;
                    padding: 0 2rem 1.25rem;
                    margin: 1rem 2rem 2rem 2rem;
                    .option {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: flex-start;
                        padding-top: 6.3rem;
                        time {
                            flex-shrink: 1;
                            width: 16rem;
                            padding-bottom: 1rem;
                            display: inline-block;
                            font-size: 1.25rem;
                        }
                        a{
                            color: #777;
                            flex-shrink: 1;
                            margin-right: 2rem;
                            padding-bottom: 1rem;
                            display: inline-block;
                            font-size: 1.25rem;
                        }
                        button{
                            background:#fff;
                            border-radius: 2px;
                            border: none;
                            padding: 0 0.1rem 0 0.1rem;
                            font-size: 0.9rem;
                            color: #777;
                            display: inline-block;
                            margin: 0 0.2rem 0 0.2rem;
                        }
                    }
                    .content{
                        word-break:normal;
                        white-space:pre-warp;
                    }
                    p:nth-child(2) {
                        font-size: 1.1rem;
                        padding-top: 1.25rem;
                        border-top: 0.125rem dashed rgb(129, 216, 208);
                    }
                    p:nth-child(3) {
                        margin-top: 1.875rem;
                    }
                }
            }
        }
    }
    .more_div{
        text-align: center;
        margin-top: 20rem;
        background-color:red;
    }
}
@media screen and (max-width: 440px) {
    .oneArticle {
        flex-grow: 1;
        margin-left: 0 !important;
        margin-right: 0 !important;
    }
    .email {
        width: 100% !important;
    }
}
</style>
