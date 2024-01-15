<template>
  <div>
    <v-card-title class="main__dialog-head">
      <span class="text-h5 main__dialog-title"
        >Создание матча
        <v-icon>mdi-{{ type }}</v-icon>
      </span>
      <v-btn text class="main__dialog-close" @click="$emit('close')">
        <v-icon> mdi-close </v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-autocomplete :items="['0-17', '18-29', '30-54', '54+']" label="Город" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-menu
              ref="menu"
              v-model="menu"
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
                  label="Дата"
                  append-icon="mdi-calendar-month"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-menu
              ref="menu2"
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="time"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field v-model="time" label="Время" append-icon="mdi-clock" readonly v-on="on"></v-text-field>
              </template>
              <v-time-picker
                v-if="menu2"
                v-model="time"
                format="24hr"
                @click:minute="$refs.menu2.save(time)"
              ></v-time-picker>
            </v-menu>
          </v-col>

          <v-col cols="6">
            <v-text-field
              label="Адрес"
              append-icon="mdi-map-marker"
              :messages="['Также можно указать ссылку на карту']"
            />
          </v-col>
          <v-col cols="6">
            <v-autocomplete :items="['Начинающие', 'Любители', 'Профи', 'Высшая лига']" label="Уровень" />
          </v-col>

          <v-col cols="6">
            <v-switch label="Приватный" :messages="['Матч будет доступен только по прямой ссылке']" />
            <v-switch
              label="Подтверждение участников"
              :messages="['Игроки не смогут участвовать в матче без вашего подтверждения']"
            ></v-switch>
            <v-switch label="Инвентарь" :messages="['Организатор матча имеет инвентарь для игры']"></v-switch>
          </v-col>
          <v-col cols="6">
            <div class="create__label">Возраст</div>
            <v-range-slider v-model="range" :max="50" :min="0" step="5" hide-details class="align-center">
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
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue-darken-1" variant="text" @click="() => {}"> Создать </v-btn>
      <v-btn color="red" variant="text" @click="$emit('close')"> Отмена </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
export default {
  props: {
    type: String,
    require: true
  },
  data() {
    return {
      range: [0, 50],
      menu: false,
      date: '',
      time: null,
      menu2: false
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
