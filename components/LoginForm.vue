<template>
  <v-dialog v-model="dialog" max-width="400px" contentClass="login__form-dialog" hideOverlay eager>
    <v-card ref="card" class="login__form" light>
      <div ref="cardContent" class="login__form-content">
        <v-card-title class="login__form-head"> Войдите в Matchmaking или зарегистрируйтесь </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12"> Через VK ID или Яндекс — как удобно. </v-col>
            <v-col cols="12">
              <v-btn rounded large color="primary" minWidth="100%">через VK id</v-btn>
            </v-col>
            <v-col id="indexId" cols="12" />
          </v-row>
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
  mounted() {
    const oauthQueryParams = {
      client_id: `${process.env.CLIENT_ID}`,
      response_type: 'token',
      redirect_url: ''
    }
    const tokenPageOrigin = `${process.env.CLIENT_ID}`

    window.YaAuthSuggest.init(oauthQueryParams, tokenPageOrigin, {
      view: 'button',
      parentId: 'indexId',
      buttonSize: 'm',
      buttonView: 'main',
      buttonTheme: 'light',
      buttonBorderRadius: '22',
      buttonIcon: 'ya'
    })
      .then(({ handler }) => handler())
      .then((data) => console.log('Сообщение с токеном', data))
      .catch((error) => console.log('Обработка ошибки', error))
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
  methods: {},
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
