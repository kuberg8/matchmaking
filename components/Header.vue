<template>
  <header class="header">
    <h1 class="header__logo">
      <v-icon size="42">mdi-basketball</v-icon>
      MATCHMAKING
    </h1>

    <v-btn id="menu-activator" @click="loginHandler" text class="header__login">
      <v-avatar v-if="isAuth && getUserAvatarId" class="yandex__avatar">
        <v-img class="yandex__avatar-img" :src="getAvatar(getUserAvatarId, 'islands-middle')" />
      </v-avatar>
      <v-avatar v-else>
        <v-icon size="38">mdi-account-circle</v-icon>
      </v-avatar>
    </v-btn>

    <v-menu v-if="isAuth" activator="#menu-activator" light absolute left bottom>
      <v-card min-width="300">
        <v-list>
          <v-list-item class="header__login-list">
            <v-btn to="account" large text minWidth="100%" class="header__login-item">
              <div class="header__login-account">
                <v-avatar size="32">
                  <v-img :src="getAvatar(getUserAvatarId, 'islands-middle')" />
                </v-avatar>
                <div>
                  <div>
                    {{ getUserDisplayName }}
                  </div>
                  <div class="header__login-phone">
                    {{ getUserPhone }}
                  </div>
                </div>
              </div>
            </v-btn>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-item v-for="(item, i) in list" :key="i" class="header__login-list">
            <v-btn @click="item.event" large class="header__login-item" text minWidth="100%">
              <div class="header__login-item">
                <v-icon>mdi-{{ item.icon }}</v-icon>
                {{ item.title }}
              </div>
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>

    <LoginForm v-model="showLogin" />
  </header>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import getAvatar from '../utils/getAvatar'

export default {
  data() {
    return {
      showLogin: false,
      showMenu: true,
      list: [{ title: 'Выйти', icon: 'logout', event: this.logout }],
      getAvatar
    }
  },
  computed: {
    ...mapGetters('user', ['getUserAvatarId', 'getUserDisplayName', 'getUserPhone']),
    ...mapState('user', ['isAuth'])
  },
  methods: {
    ...mapActions('user', ['logout']),
    loginHandler() {
      if (!this.isAuth) {
        this.showLogin = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  width: 100%;
  position: fixed;
  z-index: 2;
  top: 0;
  padding: 0 10vw;
  backdrop-filter: blur(20px);

  &__logo {
    display: flex;
    align-items: center;
    column-gap: 10px;
  }

  &__login {
    min-width: 55px !important;
    width: 55px;
    height: 55px !important;
    border-radius: 12px;

    &-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 12px;
      column-gap: 8px;
      text-transform: none;
    }

    &-account {
      display: flex;
      text-align: left;
      align-items: center;
      column-gap: 8px;
    }

    &-phone {
      margin-top: 4px;
      color: rgba(0, 0, 0, 0.6);
      font-size: 12px;
    }

    &-list {
      padding: 0 8px !important;
    }
  }
}

.yandex__avatar {
  background: linear-gradient(90deg, #ff5c4d, #eb469f 30%, #8341ef 75%, #3f68f9);
  padding: 2px;

  &-img {
    border: 2px solid #fff;
    max-width: calc(100% - 2px);
    max-height: calc(100% - 2px);
  }
}
</style>
