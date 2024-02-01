<template>
  <div>
    <v-card-title class="main__dialog-head">
      <span class="text-h5 main__dialog-title"
        >Редактирование матча
        <v-icon>mdi-{{ screen.type }}</v-icon>
      </span>
      <v-btn text class="main__dialog-close" @click="$emit('close')">
        <v-icon> mdi-close </v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-form ref="updateFormRef">
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-autocomplete
                v-model="city"
                :rules="required"
                item-value="city"
                :items="cities"
                item-text="city"
                label="Город"
                no-data-text="Город не найден"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-menu
                ref="dateMenu"
                v-model="dateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="date"
                    :rules="required"
                    label="Дата"
                    append-icon="mdi-calendar-month"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="dateMenu = false">Отмена</v-btn>
                  <v-btn color="primary" @click="$refs.dateMenu.save(date)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-menu
                ref="timeMenu"
                v-model="timeMenu"
                :rules="required"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="time"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="time"
                    :rules="required"
                    label="Время"
                    append-icon="mdi-clock"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="timeMenu"
                  v-model="time"
                  format="24hr"
                  @click:minute="$refs.timeMenu.save(time)"
                ></v-time-picker>
              </v-menu>
            </v-col>

            <v-col cols="6">
              <v-text-field
                v-model="place"
                :rules="required"
                label="Адрес"
                append-icon="mdi-map-marker"
                :messages="['Также можно указать ссылку на карту']"
              />
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                v-model="level"
                :rules="required"
                item-text="label"
                item-value="id"
                :items="levels"
                label="Уровень"
              />
            </v-col>

            <v-col cols="6">
              <v-switch
                v-model="isPrivate"
                label="Приватный"
                :messages="['Матч будет доступен только по прямой ссылке']"
              />
              <v-switch
                v-model="confirmation"
                label="Подтверждение участников"
                :messages="['Игроки не смогут участвовать в матче без вашего подтверждения']"
              ></v-switch>
              <v-switch
                v-model="inventory"
                label="Инвентарь"
                :messages="['Организатор матча имеет инвентарь для игры']"
              ></v-switch>
            </v-col>
            <v-col cols="6">
              <div class="create__label">Возраст</div>
              <v-range-slider v-model="range" :max="50" :min="0" hide-details class="align-center">
                <template v-slot:prepend>
                  <v-text-field
                    v-model="range[0]"
                    hide-details
                    type="number"
                    outlined
                    label="От"
                    min="0"
                    style="width: 70px"
                  ></v-text-field>
                </template>
                <template v-slot:append>
                  <v-text-field
                    v-model="range[1]"
                    hide-details
                    label="До"
                    type="number"
                    max="50"
                    outlined
                    style="width: 70px"
                  ></v-text-field>
                </template>
              </v-range-slider>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue-darken-1" variant="text" @click="updateMatch" :loading="loading"> Сохранить </v-btn>
      <v-btn color="red" variant="text" @click="$router.go(-1)"> Отмена </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import cities from '@/utils/cities'

export default {
  props: {
    screen: Object,
    default: () => ({})
  },
  async asyncData({ $axios, params }) {
    try {
      const { time, maxAge, minAge, ...data } = await $axios.$get(`events/${params.id}`)
      return {
        ...data,
        time: time.substring(0, 5),
        range: [minAge, maxAge]
      }
    } catch (e) {
      console.error(e)
    }
  },
  inject: ['setScreen'],
  mounted() {
    this.eventType?.id && this.setScreen(this.eventType.id)
  },
  data() {
    return {
      dateMenu: false,
      timeMenu: false,
      cities,
      levels: [
        { id: 1, label: 'Начинающий' },
        { id: 2, label: 'Любительский' },
        { id: 3, label: 'Профессиональный' },
        { id: 4, label: 'Высшая лига' }
      ],
      loading: false,
      required: [(e) => !!e || 'Поле обязательно']
    }
  },
  methods: {
    async updateMatch() {
      if (!this.$refs.updateFormRef.validate()) return

      const match = {
        city: this.city,
        place: this.place,
        date: this.date,
        time: this.time + ':00',
        level: this.level,
        isPrivate: this.isPrivate,
        confirmation: this.confirmation,
        inventory: this.inventory,
        minAge: this.range[0],
        maxAge: this.range[1]
      }
      try {
        this.loading = true
        await this.$axios.$put(`events/${this.id}`, match)
        this.$router.push(`/match/${this.id}`)
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.create__label {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 10px;
}
</style>
