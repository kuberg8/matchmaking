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
    if (!Cookies.get('access_token') && this.accessToken) {
      Cookies.set('access_token', this.accessToken)
    }
    if (!Cookies.get('provider') && this.provider) {
      Cookies.set('provider', this.provider)
    }
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
