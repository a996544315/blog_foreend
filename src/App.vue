<template>
  <div id="app">
    <router-view></router-view>
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <dialog-box v-if="dialog.show"></dialog-box>
    </transition>
  </div>
</template>

<script>
import DialogBox    from './components/share/DialogBox'
import {mapState}   from 'vuex'

export default {
    mounted () {
        document.addEventListener('visibilitychange', this.changeTitle, false)
        document.querySelector('body').setAttribute('style', 'overflow-y: scroll')
    },
    components: {
        DialogBox
    },
    computed: {
        ...mapState(['isLoading', 'dialog'])
    },
    methods: {
        changeTitle () {            // 切换标签页后，改变title
            if (document.hidden) {
                document.title = 'BYE!'
            } else {
                document.title = 'HELLO？'
            }
        }
    }
}
</script>

<style>
    
    #app {
        margin: 0;
        padding: 0;
        overflow: hidden;
        min-height: 100%;
        width: 100%;
    }
    #app::-webkit-scrollbar {
	    width: 0px;
    }
    @media screen and (max-width: 440px) {
        .fire {
            display: none;
        }
        #app {
            background: #000;
        }
    }
</style>
