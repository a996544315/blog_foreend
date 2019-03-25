<template>
    <div class="container">
        <div>
            <section class="newBlog">
                <div class="posts animated fadeIn">
                    <div class="flex">
                        <div v-for="(poem, index) in poems" class="oneArticle">
                            <div class="option">
                                <time>{{poem.createDate | toDate}}</time>
                                <a>{{poem.title}}</a>
                            </div>
                            <p class="content">{{poem.content}}<br/>......</p>
                            <router-link :to="{name: 'poem', query: {id: poem.id}}" tag="button" exact>
                                <span>Read More</span>
                            </router-link> 
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            poems: [],
            toDay: new Date(),
            numPerPage: 10,
            totalNum: -1
        }
    },
    created () {
        this.totalNum = this.numPerPage
        this.getPoems()
    },
    methods: {
        getPoems: function () {
            this.$http.get('/api/poem', {
                pn: '1',
                pp: this.totalNum
            }).then(response => {
                this.poems = response.data.data
            }).catch(e => {
                console.log(e)
            })
        }
    }
}
</script>

<style>

</style>

