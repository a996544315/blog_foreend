<template>
    <div class="container">
        <div v-show="!isEditing">
            <section class="newBlog">
                <div class="posts animated fadeIn">
                    <div class="flex">
                        <div v-for="(article, index) in reducedArticles" class="oneArticle">
                            <div class="option">
                                <time>{{article.createDate | toDate}}</time>
                                <a>{{article.title}}</a>
                                <button v-show="$store.state.isAdmin" @click="edtingTarget.id=article.id;edtingTarget.title=article.title;edtingTarget.content=article.content;isEditing=true;">编辑</button>
                                <button v-show="$store.state.isAdmin" @click="deleteArticle(article.id)">删除</button>
                                <button v-show="$store.state.isAdmin" @click="edtingTarget.id=null;edtingTarget.title='';edtingTarget.content='';isEditing=true;">新增</button>
                            </div>
                            <p class="content">{{'&emsp;&emsp;'+article.content.substring(0,article.content.substring(0,600).lastIndexOf('\n')).replace(/\n/g,'\n&emsp;&emsp;')}}<br/>&emsp;&emsp;......</p>
                            <router-link :to="{name: 'article', query: {id: article.id}}" tag="button" exact>
                                <span>Read More</span>
                            </router-link> 
                        </div>
                        <button v-show="$store.state.isAdmin&&reducedArticles.length==0" @click="edtingTarget.id=null;edtingTarget.title='';edtingTarget.content='';isEditing=true;">新增</button>
                    </div>
                </div>
            </section>
            <!-- <div class="more_div"><p  id="more" @click="more()">---M O R E---</p></div> -->
        </div>
        <!-- 浮动编辑栏 -->
        <div class="fore_back" v-if="isEditing" >
            <div class="edit_content">
                <div style="">
                    <input v-model="edtingTarget.title"/>
                </div>
                <div>
                    <textarea v-model="edtingTarget.content"/>
                </div>
                <div>
                    <button @click="submitArticle()">SUBMIT</button>
                    <button @click="edtingTarget.title=undefined;edtingTarget.content=undefined">CLEAR</button>
                    <button @click="isEditing=false;">CANCEL</button>
                </div>
            </div>
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
            totalNum: -1,
            isEditing: false,
            edtingTarget: {
                id: undefined,
                title: undefined,
                content: undefined
            }
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
        },
        submitArticle: function () {
            if (this.edtingTarget.id === null || this.edtingTarget.id === undefined || this.edtingTarget.id === '') {
                this.$http({
                    url: '/api/article/',
                    method: 'post',
                    params: {
                        title: this.edtingTarget.title,
                        content: this.edtingTarget.content,
                        group: 1
                    }
                }).then((response) => {
                    if (response.data.success === false) {
                        alert('添加失败')
                    } else {
                        this.getArticles()
                        this.isEditing = false
                    }
                })
            } else {
                this.$http({
                    url: '/api/article/' + this.edtingTarget.id,
                    method: 'patch',
                    params: {
                        title: this.edtingTarget.title,
                        content: this.edtingTarget.content,
                        group: 1
                    }
                }).then((response) => {
                    if (response.data.success === false) {
                        alert('提交失败')
                    } else {
                        this.getArticles()
                        this.isEditing = false
                    }
                })
            }
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
    .fore_back{
        background:rgba(255, 255, 255, 0.3);
        text-align:  center;
        max-height: 100%;
        .edit_content{
            z-index: 9999;
            position: fixed;
            display: inline-block;
            width: 80%;
            text-align: center;
            height: 40rem;
            top: 0;
            background: #777;
            padding: 4rem 10% 8rem 10%;
            margin-left: -50%; //margin-left = - (width + padding-left + padding-right) / 2
            //border-radius: 1rem;
            margin-top: 5rem;
            textarea,input{
                border: none;
                padding: 0.6rem;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 1.11rem;
            }
            textarea,input:focus{outline: none;}
            textarea{
                resize: none;
                margin-top: 5rem;
                height: 32rem;
                width: 100%;
                font-size: 1.11rem;
                padding: 1rem;
                font-family: Arial, Helvetica, sans-serif;
                line-height: 2rem;
            }
            button{
                padding: 0 1rem 0 1rem;
                margin-left: 0.6rem;
                margin-right: 0.6rem;
            }
        }
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
