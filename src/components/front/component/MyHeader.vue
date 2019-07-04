<template>
    <div id="nav">
        <div class="flexDiv">
            <div class="search">
                <input type="text" v-model="text" placeholder="GATE OF MY HEART" @keydown.enter="search">
                <i class="iconfont icon-search" @click="search"></i>
            </div>
            <nav>
                <ul class="catalog">
                    <router-link to="/nothing" tag="li">NOTHING</router-link>
                    <router-link to="/notpoem" tag="li">NOTPOEM</router-link>
                    <router-link to="/friend" tag="li">HEAVENS</router-link>
                    <!-- <router-link to="/about" tag="li">ABOUTME</router-link> -->
                </ul>
            </nav>
            <div>
                <a class="iconfont icon-github" target="view_window" href="https://github.com/sheepzh"></a>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import store from '../../../store/index'
export default {
    data  () {
        return {
            text: ''
        }
    },
    computed: mapState(['headline']),
    methods: {
        search () {
            let cmd = this.text
            if (cmd.indexOf('ad ') === 0) {
                this.$http.get('/api/command/admin', {
                    params: {
                        k: cmd.substring(3)
                    }
                }).then(response => {
                    store.state.isAdmin = response.data.data
                }).catch(e => {
                    console.log(e)
                })
            } else if (cmd === 'exit') {
                store.state.isAdmin = false
            } else if (store.state.isAdmin && cmd === 'visit') {
                this.$router.push({path: '/visit'})
            }
            this.text = ''
        }
    }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#nav {
  .flexDiv {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap-reverse;
    background:#fff;
    width: 100%;
    .search {
      margin-top: 0.55rem;
      margin-left: 0.625rem;
      position: relative;
      width: calc(45%-0.625rem);
      input {
        color:rgba(226, 28, 21, 0.712);
        outline: none;
        font-family:Arial, Helvetica, sans-serif;
        background: 233, 233, 233;
        width: 15.625rem;
        height: 1.875rem;
        line-height: 1.875rem;
        border-radius: 0.2rem;
        font-size: 1.125rem;
        padding-left: 0.625rem;
        border: none;
      }
      .icon-search {
        cursor: pointer;
        font-size: 1.875rem;
        color: #dddddd;
        position: absolute;
        right: 0.3rem;
        top: 0rem;
      }
    }
    nav {
      width: 50%;
      height: 3.125rem;
      ul {
        color: #777777;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-around;
        list-style: none;
        width: 100%;
        li {
          width: 7rem;
          font-size: 1rem;
          font-family: "Haas Grot Text R Web", "Helvetica Neue", Helvetica,
            Arial, sans-serif;
          text-align: center;
          margin-right: 1.2rem;
          height: 2.9375rem;
          line-height: 3.3125rem;
          cursor: pointer;
          border-bottom: 0.1875rem solid transparent;
          &:hover {
            border-bottom: 0.1875rem solid rgb(129, 216, 208);
            transition: all 0.8s;
          }
          &.router-link-active {
            border-bottom: 0.1875rem solid rgb(129, 216, 208);
          }
        }
      }
    }
    div {
      .iconfont {
        font-size: 2.5rem;
        margin-right: 1rem;
        color: #aaa;
      }
      .icon-github:hover {
        color:gray;
      }
      .icon-cion15 {
        font-size: 1.625rem;
      }
      .icon-cion15:hover {
        color:deepskyblue;
      }
      .icon-iconsf:hover {
        color:green;
      }
      div {
        text-align: center;
        padding-top: 0.625rem;
        line-height: 2.5rem;
        position:absolute;
        width: 100%;
        background: rgba(55, 57, 65, 0.5);
      }
    }
  }
  .container {
    overflow: hidden;
    width: 100%;
    height: 37.5rem;
  }
  .bgImage {
    display: block;
    width: 100%;
    height: 37.5rem;
    transform: perspective(62.5rem) translateZ(0);
    transition: 8s;
    &:hover {
      transform: perspective(62.5rem) translateZ(6.25rem);
      transition: 8s;
    }
  }
  #title {
    font-family: Georgia, "Microsoft YaHei", "微软雅黑", STXihei, "华文细黑",
      serif;
    color: #fff;
    text-align: center;
    font-size: 3.125rem;
    width: 31.25rem;
    height: 3.125rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -0.625rem;
    margin-left: -15.625rem;
  }
}
@media screen and (max-width: 980px) {
  nav {
    width: 60% !important;
  }
}
@media screen and (max-width: 440px) {
  .container,
  .bgImage {
    height: 18rem !important;
  }
  #title {
    font-size: 2rem !important;
  }
  nav {
    width: 100% !important;
    ul {
      width: 100% !important;
      padding-left: 0 !important;
      li {
        font-size: 0.9rem !important;
        margin-right: 0 !important;
      }
    }
  }
  .search {
    z-index: 2;
    position: absolute !important;
    top: 3.2rem;
    left: 50%;
    margin-left: -8.125rem !important;
  }
}
</style>
