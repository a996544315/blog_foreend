<template>
    <div class="container" v-if="$store.state.isAdmin">
        <p>今日访客:{{ visitNum[0] }}</p>
        <div v-for="(num,index) in visitNum" >
            {{ index | dateAgo}}: {{num}}
        </div>
        <div class="comment_list">
            <table style="align:center" v-for="(comment,index) in comments">
                <tr>
                    <th>{{comment.createDate | toDay}}</th>
                    <th>{{comment.targetUrl}}</th>
                    <th>{{comment.user}}</th>
                    <th>{{comment.content}}</th>
                </tr>
            </table>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            visitNum: [],
            comments: []
        }
    },
    methods: {
        getVisitNum: function () {
            this.$http.get('/api/visitor/quantity/day/10')
            .then(response => {
                this.visitNum = response.data.data
            })
        },
        getComments: function () {
            this.$http.get('/api/comment/latest')
            .then(response => {
                this.comments = response.data.data
            })
        }
    },
    created () {
        this.getVisitNum()
        this.getComments()
    }
}
</script>
