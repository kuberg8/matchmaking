<template>
  <v-dialog v-model="dialog" max-width="400px" contentClass="login__form-dialog" hideOverlay eager>
    <v-card ref="card" class="login__form" light>
      <div ref="cardContent">
        <v-card-title class="login__form-head"> Войдите в Matchmaking или зарегистрируйтесь </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12"> Через VK ID или Яндекс — как удобно. </v-col>
            <v-col id="vkId" cols="12" />
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
    this.initYandex()
    this.initVK()
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
    ...mapActions('user', ['getYandexUserData', 'setUserData']),
    initYandex() {
      YaSendSuggestToken(`${process.env.REDIRECT_URI}`)

      const oauthQueryParams = {
        client_id: `${process.env.CLIENT_ID}`,
        response_type: 'token',
        redirect_url: `${process.env.REDIRECT_URI}`
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
        .then(({ access_token }) => {
          this.dialog = false
          this.getYandexUserData(access_token)
        })
        .catch((error) => console.log('Обработка ошибки', error))
    },
    initVK() {
      const { Connect, Config, ConnectEvents } = window.SuperAppKit
      const vkId = `${process.env.VK_ID}`

      if (vkId) {
        Config.init({
          appId: +vkId
        })

        const oneTapButton = Connect.buttonOneTapAuth({
          callback: (e) => {
            this.dialog = false
            const type = e.type

            if (!type) {
              return false
            }

            switch (type) {
              case ConnectEvents.OneTapAuthEventsSDK.LOGIN_SUCCESS:
                const { user, uuid, token } = e.payload
                this.setUserData({ data: user, provider: e.provider, uuid, silent_token: token })
                return false
              // Для этих событий нужно открыть полноценный VK ID чтобы
              // пользователь дорегистрировался или подтвердил телефон
              case ConnectEvents.OneTapAuthEventsSDK.FULL_AUTH_NEEDED: //  = 'VKSDKOneTapAuthFullAuthNeeded'
              case ConnectEvents.OneTapAuthEventsSDK.PHONE_VALIDATION_NEEDED: // = 'VKSDKOneTapAuthPhoneValidationNeeded'
              case ConnectEvents.ButtonOneTapAuthEventsSDK.SHOW_LOGIN: // = 'VKSDKButtonOneTapAuthShowLogin'
                return Connect.redirectAuth({ url: 'https://...', state: 'dj29fnsadjsd82...' }) // url - строка с url, на который будет произведён редирект после авторизации.
              // state - состояние вашего приложение или любая произвольная строка, которая будет добавлена к url после авторизации.
              // Пользователь перешел по кнопке "Войти другим способом"
              case ConnectEvents.ButtonOneTapAuthEventsSDK.SHOW_LOGIN_OPTIONS: // = 'VKSDKButtonOneTapAuthShowLoginOptions'
                // Параметр url: ссылка для перехода после авторизации. Должен иметь https схему. Обязательный параметр.
                return Connect.redirectAuth({ url: 'https://...' })
            }

            return false
          },

          options: {
            showAlternativeLogin: false,
            displayMode: 'default',
            buttonStyles: {
              borderRadius: 22,
              backgroundColor: '#0077FF'
            }
          }
        })

        document.querySelector('#vkId')?.appendChild(oneTapButton.getFrame())
      }
    }
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

  #yandexId,
  #vkId {
    max-height: 68px;

    iframe {
      max-height: 44px;
    }
  }
}
</style>
