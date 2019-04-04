<template>
    <div class="container">
        <div class="friend">
            <div v-for="(friend ,index) in friends">
                <p><a class="web_name" :href="friend.url" target="view_window"><u>{{friend.webName}}</u></a></p>
                <p>
                    <a class="friend_name">{{friend.name}}</a>&emsp;&emsp;&emsp;
                    <a class="tag" v-for="(t,index) in friend.tag.split(',')">{{t}}</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            friends: []
        }
    },
    created () {
        this.$http.get('/api/friend')
            .then(response => {
                this.friends = response.data.data
                console.log(this.friends)
            }).catch(e => {})
    }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.container{
    position: relative;
    width: 50%;
    margin-top: 10rem;
    margin-left: 35%;
    .friend{
        top: 10px;
        div{
            margin-top: 5rem;
            a{
                font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
                font-size: 1.5rem;
            }
            .web_name{
                font-size: 3rem;
                color: #222;
            }
            .friend_name{
                margin-top: 10px;
                color: #eee;
                line-height: 3rem;
                background: #222;
                padding: 0.3rem;
                border-radius: 50%;
            }
            .tag{
                padding-left: 0.3rem;
                background: #222;
                color: #eee;
                border-radius: 3px;
                margin-right: 1rem;
                line-height: 3rem;
            }           
        }
    }
}
</style>

