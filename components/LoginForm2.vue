<template>
  <v-dialog v-model="dialog" max-width="400px" contentClass="login__form-dialog" hideOverlay>
    <v-card ref="card" class="login__form" light>
      <div ref="cardContent" class="login__form-content">
        <v-card-title class="login__form-head"> {{ singup ? 'Регистрация' : 'Войти в аккаунт' }} </v-card-title>

        <v-card-text v-show="!singup">
          <v-form ref="loginForm" v-model="valid" lazy-validation>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="loginEmail"
                  :rules="loginEmailRules"
                  label="E-mail"
                  name
                  outlined
                  required
                  dense
                  hide-details
                />
              </v-col>
              <v-col cols="12">
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
                  @click:append="show1 = !show1"
                >
                  <template v-slot:message>
                    <nuxt-link to="#" class="login__form-link"> Забыли пароль? </nuxt-link>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn :disabled="!valid" color="primary" large minWidth="100%" @click="validate('loginForm')">
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

          <v-btn @click="setSingUp" text minWidth="100%">Завести аккаунт</v-btn>
        </v-card-text>

        <v-card-text v-show="singup">
          <v-form ref="singupForm" v-model="valid2" lazy-validation>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="firstName"
                  :rules="[rules.required, rules.min]"
                  label="Имя"
                  outlined
                  required
                  dense
                  hide-details
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="lastName"
                  :rules="[rules.required, rules.min]"
                  label="Фамилия"
                  outlined
                  required
                  dense
                  hide-details
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="singupEmail"
                  :rules="loginEmailRules"
                  label="E-mail"
                  outlined
                  required
                  dense
                  hide-details
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
                  @click:append="show2 = !show2"
                />
              </v-col>
              <v-col cols="12">
                <v-btn :disabled="!valid2" color="primary" large minWidth="100%" @click="validate('singupForm')">
                  Зарегестрироваться
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-btn @click="setSingUp" text minWidth="100%">Авторизоваться</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
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
    loginEmail: '',
    singupEmail: '',
    loginEmailRules: [(v) => !!v || 'Required', (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'],
    emailRules: [(v) => !!v || 'Required', (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'],

    show1: false,
    show2: false,
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
  transition: transform 1s;
  min-height: 431px;
  box-shadow: none !important;

  &-head {
    justify-content: center;
  }

  &-row {
    display: flex;
    align-items: center;
    margin: 20px 0;
    min-width: 100%;
    column-gap: 15px;

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
    padding-top: 0 !important;
  }
}
</style>
