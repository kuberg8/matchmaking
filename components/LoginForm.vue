<template>
  <v-dialog v-model="dialog" max-width="400px" contentClass="login__form-dialog" hideOverlay eager>
    <v-card ref="card" class="login__form" light>
      <div ref="cardContent">
        <v-card-title class="login__form-head"> Войдите в Matchmaking или зарегистрируйтесь </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12"> Через VK ID или Яндекс — как удобно. </v-col>
            <v-col cols="12">
              <v-btn rounded large color="primary" minWidth="100%">через VK id</v-btn>
            </v-col>
            <v-col id="yandexId" cols="12" />
          </v-row>
        </v-card-text>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    const oauthQueryParams = {
      client_id: `${process.env.CLIENT_ID}`,
      response_type: 'token',
      redirect_url: ''
    }
    const tokenPageOrigin = `${process.env.CLIENT_ID}`

    window.YaAuthSuggest.init(oauthQueryParams, tokenPageOrigin, {
      view: 'button',
      parentId: 'yandexId',
      buttonSize: 'm',
      buttonView: 'main',
      buttonTheme: 'light',
      buttonBorderRadius: '22',
      buttonIcon: 'ya'
    })
      .then(({ handler }) => handler())
      .then(({ access_token }) => this.getUserInfo(access_token))
      .catch((error) => console.log('Обработка ошибки', error))
      .finally(() => this.dialog = false)
  },
  computed: {
    dialog: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    ...mapActions('user', ['getUserInfo'])
  },
  data: () => ({})
}
</script>

<style lang="scss">
.login__form {
  border-radius: 24px !important;
  padding: 20px 40px !important;
  transform: rotate3d(0, 0, 0, 0deg);
  transition: transform 1s;
  min-height: auto !important;
  box-shadow: none !important;

  &-head {
    text-align: center;
    word-break: normal;
    justify-content: center;
  }

  &-dialog {
    overflow: visible !important;
    box-shadow: none !important;
  }

  #yandexId {
    max-height: 68px;
  }
}
</style>
