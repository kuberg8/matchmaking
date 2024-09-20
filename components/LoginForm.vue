<template>
  <v-dialog v-model="dialog" max-width="400px" contentClass="login__form-dialog" hideOverlay eager>
    <v-card ref="card" class="login__form" light>
      <div ref="cardContent" class="login__form-content">
        <v-card-title class="login__form-head">
          {{ singup ? 'Регистрация' : 'Войдите в Matchmaking или зарегистрируйтесь' }}
        </v-card-title>

        <v-card-text v-show="!singup" class="py-0">
          <v-form ref="loginForm" v-model="valid" lazy-validation>
            <v-row>
              <v-col class="pa-2" cols="12">
                <v-text-field
                  v-model="loginEmail"
                  :rules="loginEmailRules"
                  label="E-mail"
                  name
                  outlined
                  required
                  rounded
                  dense
                  hide-details
                />
              </v-col>
              <v-col class="pa-2" cols="12">
                <v-text-field
                  v-model="loginPassword"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.min]"
                  :type="show1 ? 'text' : 'password'"
                  name="input-10-1"
                  label="Пароль"
                  :messages="['forgot password']"
                  outlined
                  dense
                  rounded
                  @click:append="show1 = !show1"
                >
                  <template v-slot:message>
                    <nuxt-link to="#" class="login__form-link"> Забыли пароль? </nuxt-link>
                  </template>
                </v-text-field>
              </v-col>
              <v-col class="pa-2" cols="12">
                <v-btn :disabled="!valid" color="primary" large minWidth="100%" rounded @click="validate('loginForm')">
                  Войти
                </v-btn>
              </v-col>
            </v-row>
          </v-form>

          <div class="login__form-row">
            <hr />
            или
            <hr />
          </div>

          <div>
            <div id="vkId" cols="12" />
            <div id="yandexId" cols="12" />
            <div cols="12">
              <v-btn @click="setSingUp" text rounded minWidth="100%">Завести аккаунт</v-btn>
            </div>
          </div>
        </v-card-text>

        <v-card-text v-show="singup" class="py-0">
          <v-form ref="singupForm" v-model="valid2" lazy-validation>
            <v-row>
              <v-col class="pr-1" cols="6">
                <v-text-field
                  v-model="firstName"
                  :rules="[rules.required]"
                  label="Имя"
                  name="name"
                  outlined
                  required
                  dense
                  rounded
                  hide-details
                />
              </v-col>
              <v-col class="pl-1" cols="6">
                <v-text-field
                  v-model="lastName"
                  :rules="[rules.required, rules.min]"
                  label="Фамилия"
                  name="lastname"
                  outlined
                  required
                  dense
                  rounded
                  hide-details
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="singupEmail"
                  :rules="loginEmailRules"
                  label="E-mail"
                  name="email"
                  outlined
                  required
                  dense
                  rounded
                  hide-details
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="singupPhone"
                  :rules="[rules.required]"
                  label="Телефон"
                  name="phone"
                  type="tel"
                  outlined
                  required
                  dense
                  rounded
                  hide-details
                  v-mask="'+7 (###) ###-####'"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="singupPassword"
                  :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.min]"
                  :type="show2 ? 'text' : 'password'"
                  name="input-10-1"
                  label="Пароль"
                  outlined
                  hide-details
                  dense
                  rounded
                  @click:append="show2 = !show2"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="singupPasswordRepeat"
                  :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.min]"
                  :type="show3 ? 'text' : 'password'"
                  name="input-10-1"
                  label="Повторите пароль"
                  outlined
                  hide-details
                  dense
                  rounded
                  @click:append="show3 = !show3"
                />
              </v-col>
              <v-col cols="12">
                <v-btn
                  rounded
                  :disabled="!valid2"
                  color="primary"
                  large
                  minWidth="100%"
                  @click="validate('singupForm')"
                >
                  Зарегестрироваться
                </v-btn>
              </v-col>
            </v-row>
          </v-form>

          <div class="login__form-row" />

          <v-btn rounded @click="setSingUp" text minWidth="100%">Авторизоваться</v-btn>
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
    passwordMatch() {
      return () => this.singupPassword === this.verify || 'Password must match'
    },
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
                const { uuid, token } = e.payload
                this.getVkUserData({uuid, silent_token: token})
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
    },
    validate(formName) {
      if (this.$refs[formName].validate()) {
        // submit form to server/API here...
      }
    },
    reset(formName) {
      this.$refs[formName]?.reset()
    },
    resetValidation(formName) {
      this.$refs[formName]?.resetValidation()
    },
    setSingUp() {
      this.resetValidation('loginForm')
      this.resetValidation('singupForm')
      this.$refs.cardContent.style.opacity = '0'
      this.$refs.card.$el.classList.toggle('login__form-animation')
      setTimeout(() => {
        this.$refs.cardContent.classList.toggle('login__form-content-reverse')
        this.$refs.cardContent.style.opacity = '1'
        this.singup = !this.singup
      }, 500)
    }
  },
  data: () => ({
    valid: true,
    valid2: true,

    firstName: '',
    lastName: '',
    verify: '',
    loginPassword: '',
    singupPassword: '',
    singupPasswordRepeat: '',
    loginEmail: '',
    singupEmail: '',
    singupPhone: '',
    loginEmailRules: [(v) => !!v || 'Required', (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'],
    emailRules: [(v) => !!v || 'Required', (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'],

    show1: false,
    show2: false,
    show3: false,
    rules: {
      required: (value) => !!value || 'Required.',
      min: (v) => (v && v.length >= 8) || 'Min 8 characters'
    },

    singup: false
  }),
  watch: {
    dialog(value) {
      if (!value) {
        setTimeout(() => {
          this.reset('loginForm')
          this.reset('singupForm')
          this.resetValidation('loginForm')
          this.resetValidation('singupForm')
          this.singup = false
        }, 500)
      }
    }
  }
}
</script>

<style lang="scss">
.login__form {
  border-radius: 24px !important;
  padding: 20px 40px !important;
  transform: rotate3d(0, 0, 0, 0deg);
  transition: all 1s;
  min-height: 531px !important;
  box-shadow: none !important;
  display: flex;

  &-head {
    justify-content: center;
    word-break: normal;
    text-align: center;
  }

  &-row {
    display: flex;
    align-items: center;
    margin: auto 0;
    min-width: 100%;
    column-gap: 15px;
    color: grey;
    flex-grow: 1;

    hr {
      width: 100%;
    }
  }

  &-animation {
    transform: perspective(600px) rotateY(-180deg);
  }

  &-dialog {
    overflow: visible !important;
    box-shadow: none !important;
  }

  &-content {
    transition: opacity 0.5s;
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    &-reverse {
      transform: perspective(600px) rotateY(-180deg);
    }
  }

  &-link {
    text-align: right;
    display: block;
  }

  fieldset {
    border-width: 1px !important;
  }

  .v-card__text {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  #yandexId,
  #vkId {
    height: 60px !important;

    iframe {
      max-height: 44px;
    }
  }
}
</style>
