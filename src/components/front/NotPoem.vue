<template>
    <div class="container">
        <div v-show="!isEditing">
            <section class="newPoem">
                <div class="flex">
                    <div class="box_wrapper">
                        <div v-for="(poem, index) in poems" class="onePoem">
                            <div class="option">
                                <a>{{poem.title}}</a>
                            </div>
                            </br>
                            <p class="content">{{poem.content}}<br/></p>
                            </br>
                            <button @click="showComment = false;getComment(poem)">REPLY</button>
                            <br>
                            <button v-if="$store.state.isAdmin" @click="editingTarget.id=poem.id;editingTarget.title=poem.title;editingTarget.content=poem.content;isEditing=true">EDIT</button>
                            <button v-if="$store.state.isAdmin" @click="editingTarget.id=null;editingTarget.title=null;editingTarget.content=null;isEditing=true">ADD</button>
                            <br>
                            <button v-if="$store.state.isAdmin" @click="deletePoem(poem.id)">DELETE</button>
                        </div>
                        <button v-if="$store.state.isAdmin&&poems.length==0" @click="editingTarget.id=null;editingTarget.title=null;editingTarget.content=null;isEditing=true">ADD</button>
                    </div>
                </div>
            </section>
        </div>
        <div class="fore_back">
            <div class="scroller" v-if="showComment">
                <div class="comment_div">
                    <a class="poem_to_reply">{{ toComment.title }} &emsp; {{ comments.length }}条评论&emsp;</a>
                    <div class="comment_commit">
                        <p class="reply_info">
                            回复 <u>{{ toReply }}</u>:&emsp;
                            <button class="reply_cancel" v-show="showCancle" @click="cancelReply()">取消</button>
                        </p>
                        <p v-show="showCancle" class="last_comment">{{ toReplyCommit }}</p>
                        <div class="comment_content">
                            <textarea ref="commentInput" autofocus="autofocus" class="content_input" @keyup.enter="submitComment()" placeholder="......" v-model="reply.content"/>
                        </div>
                        <p class="comment_user_info">
                            昵称&emsp;<input class="tag_info" @keyup.enter="submitComment()" v-model="reply.user"/>&emsp;&emsp;
                            邮箱&emsp;<input class="tag_info" @keyup.enter="submitComment()" v-model="reply.email"/>&emsp;&emsp;
                            <button class="submit" @click="submitComment()">提交</button>
                        </p>
                    </div>
                    <div class="comment_list">
                        <div class="poem_comment" v-for="(comment, index) in comments">
                            <p>
                                <a class="comment_date">{{ comment.createDate | to_date }}</a>&emsp;
                                <a class="comment_user">{{ comment.user }} : </a>&emsp;&emsp;
                                <button @click="replyClick(comment)">回复</button>
                                <button v-if="$store.state.isAdmin" @click="deleteComment(comment.id)">删除</button>
                            </p>
                            <span class="reply_target" v-show="comment.targetType===1">{{ getTarget(comment.targetId) }}</span>
                            <p class="comment_list_content">{{ comment.content }}</p>
                        </div>
                    </div>
                    <div class="comment_oprate"　v-show="showComment">
                        <img class="close_comment" src="/static/close.png" @click="showComment=false"/>
                    </div>
                </div>
            </div>
        </div>

        <div class="fore_back1" v-if="isEditing" >
            <div class="edit_content">
                <div style="">
                    <input v-model="editingTarget.title"/>
                </div>
                <div>
                    <textarea v-model="editingTarget.content"/>
                </div>
                <div>
                    <button @click="submitPoem()">SUBMIT</button>
                    <button @click="editingTarget.title=undefined;editingTarget.content=undefined">CLEAR</button>
                    <button @click="isEditing=false;">CANCEL</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            isEditing: false,
            editingTarget: {},
            poems: [],
            toDay: new Date(),
            numPerPage: 10,
            totalNum: -1,
            showComment: false,
            toComment: {},
            comments: [],
            toReply: '',
            toReplyCommit: '',
            reply: {
                targetId: -1,
                targetType: 3,
                user: '',
                email: ''
            },
            showCancle: false
        }
    },
    created () {
        this.totalNum = this.numPerPage
        this.getPoems()
    },
    methods: {
        submitPoem: function () {
            if (this.editingTarget.id === null || this.editingTarget.id === undefined || this.editingTarget.id === '') {
                this.$http({
                    url: '/api/poem/',
                    method: 'post',
                    params: {
                        title: this.editingTarget.title,
                        content: this.editingTarget.content,
                        group: 1
                    }
                }).then((response) => {
                    if (response.data.success === false) {
                        alert('添加失败')
                    } else {
                        this.getPoems()
                        this.isEditing = false
                    }
                })
            } else {
                this.$http({
                    url: '/api/poem/' + this.editingTarget.id,
                    method: 'patch',
                    params: {
                        title: this.editingTarget.title,
                        content: this.editingTarget.content,
                        group: 1
                    }
                }).then((response) => {
                    if (response.data.success === false) {
                        alert('提交失败')
                    } else {
                        this.getPoems()
                        this.isEditing = false
                    }
                })
            }
        },
        getPoems: function () {
            this.$http.get('/api/poem', {
                pn: '1',
                pp: this.totalNumedtingTarget
            }).then(response => {
                this.poems = response.data.data
            }).catch(e => {
                console.log(e)
            })
        },
        getComment: function (poem) {
            this.toComment = poem
            this.targetId = poem.id
            this.$http.get('/api/poem/' + poem.id + '/comment')
            .then(response => {
                if (response.data.success === true) {
                    this.comments = response.data.data
                    this.showComment = true
                } else {
                    console.log('内部错误，请联系他。')
                }
            }).catch(e => {
                console.log(e)
            })
        },
        replyClick: function (a) {
            this.toReply = a.user
            this.reply.targetId = a.id
            this.reply.targetType = 1
            this.toReplyCommit = a.content
            this.showCancle = true
            this.$refs.commentInput.focus()
        },
        cancelReply: function () {
            this.toReply = ''
            this.reply.targetId = this.id
            this.reply.targetType = 3
            this.toReplyCommit = ''
            this.showCancle = false
        },
        getTarget: function (commentId) {
            let result = '佚名网友'
            this.comments.forEach(element => {
                if (element.id === commentId) {
                    result = element.user + ': ' + element.content
                }
            })
            return '回复' + result
        },
        submitComment: function () {
            if (this.reply.content.replace(/(^\s*)|(\s*$)/g, '') === '') {
                alert('请输入评论')
                return
            }
            if (this.reply.user === '') {
                this.reply.user = '网友' + Math.floor(Math.random() * (900) + 100)
            }
            let requestUrl = '/api/' + (this.reply.targetType === 1 ? 'comment' : ('poem/' + this.toComment.id + '/comment'))
            this.$http({
                url: requestUrl,
                method: 'post',
                params: {
                    user: this.reply.user,
                    email: this.reply.email,
                    targetId: this.reply.targetId,
                    content: this.reply.content,
                    url: '/poem/' + this.id
                }
            }).then(response => {
                if (response.data.success === false) {
                    alert('提交失败')
                }
                this.getComment(this.toComment)
                this.reply.content = ''
                this.cancelReply()
            }).catch(e => {
                console.log(e)
            })
        },
        deletePoem: function (id) {
            this.$http({
                url: 'api/poem/' + id,
                params: {},
                method: 'delete'
            }).then(response => {
                if (response.data.success === false) {
                    alert('删除失败')
                } else {
                    this.getPoems()
                }
            }).catch(e => {
                console.log(e)
            })
        },
        deleteComment: function (commentId) {
            this.$http({
                url: '/api/comment/' + commentId,
                method: 'delete'
            }).then(response => {
                if (response.data.success === false) {
                    alert('删除失败')
                }
                this.getComment(this.toComment)
            })
        }
    }
}
</script>

<style lang="scss" rel="stylesheet/scss">
.container{
    background:#ffffff;
    width: 100%;
    height: 100%;
    margin-top: 6rem;
    
    button{
        background:rgb(91, 160, 151);
        border-radius: 2px;
        border: none;
        padding: 0 0.7rem 0 0.7rem;
        font-size: 0.97rem;
        color: #fff;
    }

    .newPoem {
        padding-right: 7rem;
        padding-left: 7rem;
        column-count: 3;
        .flex{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            width: 100%;
            .onePoem{
                background: rgba(129, 216, 208,0.2);
                color: #555;
                break-inside: avoid;
                text-align: center;
                padding-bottom: 6rem;
                padding-top: 3rem;
                width: 30.6rem;
                font-size: 1.11rem;
                border-radius: 0.5rem;
                white-space: pre-line;
                margin-bottom: 3rem;
                .option{
                    a{
                        color:#777;  
                        font-size: 1.56rem;
                    }
                }
                .commentIcon{
                    margin-top: 2rem;
                    width: 24px;
                    border: none;
                    cursor: pointer;
                }
            }
        }
    }
    .fore_back{
        background:rgba(255, 255, 255, 0.3);
        text-align:  center;
        max-height: 100%;
        textarea,input{
            border: none;
            padding: 0.6rem;
            border-radius: 10px;
        }
        textarea,input:focus{outline: none;}
        .scroller::-webkit-scrollbar {
             width: 1rem !important;
             background: #222;
        }
        .scroller::-webkit-scrollbar-button{
            display: none;
        }
        .scroller::-webkit-scrollbar-thumb{
            background: #eee
        }
        .scroller{
            z-index: 9999;
            position: fixed;
            display: inline-block;
            width: 46rem;
            padding: 4rem 6rem 8rem 6rem;
            margin-left: -29rem; //margin-left = - (width + padding-left + padding-right) / 2
            //border-radius: 1rem;
            margin-top: 5rem;
            top: 0;
            max-height: 60%;
            color: #eee;
            overflow-y:scroll;
            background: #222;
            .comment_div{
                .poem_to_reply{
                    margin-bottom: 1rem;
                    font-size: 1.34rem;
                    color:#eee;
                }
                .close_comment{
                    color:#4f8fa8;
                    
                }.close_comment:hover{
                    cursor: pointer;
                }
                .comment_commit{
                    text-align: left;
                    .reply_info{
                        padding: 0.1rem;
                        font-size: 1.22rem;
                    }   
                    .last_comment{
                        word-wrap: break-word;
                        word-break: break-all;
                        overflow: hidden;
                        background: rgba(119,119,119,0.1);
                        width: 100%;
                        border: rgba(0,119,119,0.4) solid 1px;
                        color: rgba(234,234,234,0.6);
                        padding: 0.6rem;
                        font-size: 0.6rem;
                        margin: 1rem 0 1rem 0;
                        border-radius: 0.3rem;
                    }
                    .comment_content{
                        vertical-align: middle;
                        margin: 1rem 0 1rem 0;
                        .content_input{
                            resize: none;
                            height: 7rem;
                            width: 100%;
                        }
                        .comment_user_info{
                            margin-bottom: 10rem；
                        }
                    }
                }
                .comment_list{
                    text-align: left;
                    .poem_comment{
                        padding-left: 0.6rem;
                        margin-bottom: 0.3rem;
                        a,p{
                            color: #eee;
                            font-size: 1.2rem;
                        }
                        .reply_target{
                            background: rgba(119,119,119,0.4);
                            font-size: 0.9rem;
                            padding: 0.3rem;
                            border-radius: 0.2rem;
                        }
                    }
                }
            }
            .comment_oprate{
                position: fixed;
                top: 6.5rem;
                right: 30.5rem;
                font-size: 1.2rem;
                .close_comment{
                    width: 24px;
                    border: none;
                    cursor: pointer;
                }
            }
        }
    }
    .fore_back1{
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
</style>

