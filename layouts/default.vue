<template>
  <v-app class="app__background">
    <Header />

    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'DefaultLayout',
  mounted() {
    const token = localStorage.getItem('asset_token')
    if (token) {
      this.getUserInfo(token)
    }

    // yanedx
    YaSendSuggestToken(`${process.env.REDIRECT_URI}`)
  },
  methods: {
    ...mapActions('user', ['getUserInfo'])
  },
}
</script>

<style lang="scss" scoped>
.app__background {
  background-color: #272727;
}
</style>
