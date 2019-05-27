<template>
    <div class="container" v-if="$store.state.isAdmin">
        <p>今日访客:{{ visitNum[0] }}</p>
        <div v-for="(num,index) in visitNum" >
            {{ index | dateAgo}}: {{num}}
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            visitNum: []
        }
    },
    methods: {
        getVisitNum: function () {
            this.$http.get('/api/visitor/quantity/date/10')
            .then(response => {
                this.visitNum = response.data.data
            })
        }
    },
    created () {
        this.getVisitNum()
    }
}
</script>
