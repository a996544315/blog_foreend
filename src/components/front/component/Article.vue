<template>
    <div class='content'>
        <div class="article_title">
            <span>
                <p class='title'>{{article.title}}</p>
                &emsp;
                <p class="date">{{article.createDate | toDate}}</p>
            </span>
        </div>
        <div class="article_content">
            <p>&emsp;&emsp;{{ article.content.replace(/\n/g,'\n&emsp;&emsp;') }}</p>
        </div>
        <div class="line"><p>{{comments.length}}条评论</p></div>
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
            <div class="article_comment" v-for="(comment, index) in comments">
                <p>
                    <a class="comment_date">{{ comment.createDate | to_date }}</a>&emsp;
                    <a class="comment_user">{{ comment.user }} : </a>&emsp;&emsp;
                    <button @click="replyClick(comment)">回复</button>
                </p>
                <span class="reply_target" v-show="comment.targetType===1">{{ getTarget(comment.targetId) }}</span>
                <p class="comment_list_content">{{ comment.content }}</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            reply: {
                cotent: '',
                targetId: '',
                targetType: 0, // 0=article 1=comment
                user: '',
                email: ''
            },
            toReply: '',
            toReplyCommit: '',
            article: {},
            comments: [],
            showCancle: false,
            id: ''
        }
    },
    created () {
        this.id = this.$route.query.id
        this.reply.targetId = this.id
        this.toReplyId = this.id
        this.getArticle(this.id)
        this.getComments(this.id)
    },
    methods: {
        getComments: function (id) {
            this.$http.get('/api/article/' + this.id + '/comment')
            .then(response => {
                this.comments = response.data.data
            }).catch(e => {
                console.log(e)
            })
        },
        getArticle: function (id) {
            this.$http.get('/api/article/' + this.id)
            .then(response => {
                this.article = response.data.data
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
            this.reply.targetType = 0
            this.toReplyCommit = ''
            this.showCancle = false
        },
        submitComment: function () {
            if (this.reply.content.replace(/(^\s*)|(\s*$)/g, '') === '') {
                alert('请输入评论')
                return
            }
            if (this.reply.user === '') {
                this.reply.user = '网友' + Math.floor(Math.random() * (900) + 100)
            }
            let requestUrl = '/api/' + (this.reply.targetType === 1 ? 'comment' : ('article/' + this.id + '/comment'))
            this.$http({
                url: requestUrl,
                method: 'post',
                params: {
                    user: this.reply.user,
                    email: this.reply.email,
                    targetId: this.reply.targetId,
                    content: this.reply.content,
                    url: '/article/' + this.id
                }
            }).then(response => {
                if (response.data.success === false) {
                    alert('提交失败')
                }
                this.getComments(this.id)
                this.reply.content = ''
                this.cancelReply()
            }).catch(e => {
                alert(e)
                console.log(e)
            })
        },
        getTarget: function (commentId) {
            let result = '佚名网友'
            this.comments.forEach(element => {
                if (element.id === commentId) {
                    result = element.user + ': ' + element.content
                }
            })
            return '回复' + result
        }
    }
}
</script>
<style lang="scss" scoped>
.content{
    width: 100%;
    height: 100%;
    color: #777;
    button{
        background:rgb(91, 160, 151);
        border-radius: 2px;
        border: none;
        padding: 0 0.7rem 0 0.7rem;
        font-size: 0.97rem;
        color: #fff;
    }
    input,textarea{
        font-size: 1.2rem;
        padding: 0.5rem;
        border-radius: 0.3rem;
        border: rgba(119,119,119,0.4) solid 1px;
        color: #777;
    }
    .article_title{
        margin-top: 7rem;
        margin-bottom: 3rem;
        text-align: center;
        .title{
            color: #777;
            font-size: 1.5rem;
        }
        .date{
            padding: 0rem 30rem 0rem 30rem;
            text-align: right;
            font-size: 1rem;
            color: #999
        }
    }
    .article_content{
        font-size: 1.3rem;
        padding: 0rem 30rem 0rem 30rem;
        font-family: Arial, Helvetica, sans-serif;
        white-space: pre-line;
        p{
            line-height: 2.5rem;
        }
    }
    .line{
        border-top: 1px solid #eee;
        text-align: center;
        margin: 8rem 30rem 2rem 30rem;
    }
    .comment_commit{
        margin: 2rem 30rem 2rem 30rem;
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
            color: rgba(119,119,119,0.6);
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
        margin: 8rem 30rem 0 30rem ;
        .article_comment{
            padding-left: 0.6rem;
            margin-bottom: 0.3rem;
            a,p{
                color: #777;
                font-size: 1.2rem;
            }
            .reply_target{
                background: rgba(119,119,119,0.4);
                font-size: 0.9rem;
                padding: 0.3rem;
                border-radius: 0.2rem;
            }
            .comment_list_content{
                margin: 0.7rem 0 0 0 
            }
        }
    }
}
</style>

