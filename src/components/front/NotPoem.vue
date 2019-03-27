<template>
    <div class="container">
        <div>
            <section class="newBlog">
                <div class="flex">
                    <div class="box_wrapper">
                        <div v-for="(poem, index) in poems" class="onePoem">
                            <div class="option">
                                <a>{{poem.title}}</a>
                            </div>
                            </br>
                            <p class="content">{{poem.content}}<br/></p>
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

<style lang="scss" rel="stylesheet/scss">
.container{
    background:#ffffff;
    width: 100%;
    height: 100%;
    margin-top: 6rem;
    .newBlog {
        padding-right: 7rem;
        padding-left: 7rem;
        column-count: 3;
        .flex{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            color: #777;
            width: 100%;
            .onePoem{
                background: rgba(129, 216, 208,0.2);
                break-inside: avoid;
                text-align: center;
                padding-bottom: 3rem;
                padding-top: 3rem;
                width: 28rem;
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
            }
        }
    }
}
</style>

