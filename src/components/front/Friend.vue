<template>
    <div class="container">
        <div class="friend">
            <div v-for="(friend ,index) in friends">
                <p><a class="web_name" :href="friend.url" target="view_window"><u>{{friend.webName}}</u></a></p>
                <p>
                    <a class="friend_name">{{friend.name}}</a>&emsp;&emsp;&emsp;
                    <a class="tag" v-for="(t,index) in friend.tag==null?[]:friend.tag.split(',')">{{t}}</a>
                    <button v-if="$store.state.isAdmin" @click="toEdit(friend)">EDIT</button>
                    <button v-if="$store.state.isAdmin" @click="deleteLink(friend.id)">DELETE</button>
                </p>
            </div>
        </div>
        <button v-if="$store.state.isAdmin" @click="isEditing=true;target={}">ADD</button>
        <div class="friend_foreback" v-if="isEditing">
            </br>
            －－－－－－－－－－－－－－－－－－－－－－－－－－－</br>
            网站名&emsp;<input v-model="target.webName" placeholder="web name"/></br>
            地&emsp;址&emsp;<input v-model="target.url" placeholder="url"/></br>
            简&emsp;称&emsp;<input v-model="target.name" placeholder="名字简写，长度＝１"/></br>
            标&emsp;签&emsp;<input v-model="target.tag" placeholder="标签，英文逗号分隔"/></br>
            优先级&emsp;<input v-model="target.stage" placeholder="优先级，越小越靠前"/></br>
            <button @click="submit()">SUBMIT</button>
            <button @click="isEditing=false">CANCEL</button>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            isEditing: false,
            friends: [],
            target: {}
        }
    },
    created () {
        this.getFriends()
    },
    methods: {
        getFriends: function () {
            this.$http.get('/api/friend')
            .then(response => {
                this.friends = response.data.data
            }).catch(e => {})
        },
        toEdit: function (friend) {
            this.isEditing = true
            this.target.id = friend.id
            this.target.url = friend.url
            this.target.webName = friend.webName
            this.target.name = friend.name
            this.target.tag = friend.tag
            this.target.stage = friend.stage
        },
        submit: function () {
            let addOrEdit = this.target.id === null || this.target.id === undefined || this.target.id === ''
            this.$http({
                url: '/api/friend' + (addOrEdit ? '' : '/' + this.target.id),
                method: addOrEdit ? 'post' : 'patch',
                params: this.target
            }).then((response) => {
                if (response.data.success === false) {
                    alert('添加失败')
                } else {
                    this.getFriends()
                    this.isEditing = false
                }
            })
        },
        deleteLink: function (id) {
            this.$http({
                url: '/api/friend/' + id,
                method: 'delete'
            }).then((response) => {
                if (response.data.success === false) {
                    alert('删除失败')
                } else {
                    this.getFriends()
                }
            })
        }
    }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.container{
    position: relative;
    width: 50%;
    margin-top: 10rem;
    margin-left: 40%;
    .friend{
        top: 10px;
        div{
            margin-top: 4rem;
            a{
                font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
                font-size: 1rem;
            }
            .web_name{
                font-size: 1.8rem;
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
    .friend_foreback{
        width: 100%;
        #input{
            width: 100%
        }
    }
}
</style>

