<template>
  <v-app class="app__background">
    <Header />
    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
import Cookies from 'js-cookie'
import { mapState } from 'vuex'

export default {
  name: 'DefaultLayout',
  mounted() {
    const keys = ['access_token', 'provider']

    keys.forEach(key => {
      if (!Cookies.get(key) && this[key]) {
        console.log('тут', key)
        Cookies.set(key, this[key])
      }
    })
  },
  computed: {
    ...mapState('user', ['accessToken', 'provider'])
  }
}
</script>

<style lang="scss" scoped>
.app__background {
  background-color: #272727;
}
</style>
