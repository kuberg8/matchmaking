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
    const userData = localStorage.getItem('user_data')
    const token = localStorage.getItem('asset_token')
    const provider = localStorage.getItem('provider')

    if (userData) {
      this.setUserData({ data: JSON.parse(userData), provider })
    } else if (token) {
      this.getUserData(token)
    }
  },
  methods: {
    ...mapActions('user', ['getUserData', 'setUserData'])
  }
}
</script>

<style lang="scss" scoped>
.app__background {
  background-color: #272727;
}
</style>
