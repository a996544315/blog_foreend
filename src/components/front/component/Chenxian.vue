<template>
    <div class="container">
        <p>DARK IS NEW LIGHT</p>
        <canvas class="scope"></canvas>
    </div>
</template>


<script>
export default {
    data () {
        return {
            friends: [],
            areaSide: 1000,
            scopeRadius: 150,
            scopeX: 500,
            scopeY: 500
        }
    },
    created () {
        this.init()
        this.drawUrl()
    },
    methods: {
        init: function () {
            this.$http.get('/api/friend')
            .then(response => {
                this.friends = response.data.data
                this.friends.array.forEach(element => {
                    element.x = Math.floor(Math.random() * this.areaSide)
                    element.y = Math.floor(Math.random() * this.areaSide)
                })
            }).catch(e => {})
        },
        drawUrl: function () {
        }
    }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.container{
    background: #fff;
    text-align: center;
    padding-top: 2vw;
    .scope{   
        margin: auto;
        background: #111;
        border-radius: 15vw;
        width: 30%;
        height: 30vw;;
    }
}
</style>

