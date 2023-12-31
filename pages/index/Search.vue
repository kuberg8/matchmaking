<template>
  <div>
    <v-card-title class="main__dialog-head">
      <span class="text-h5 main__dialog-title"
        >Поиск матча
        <v-icon>mdi-{{ type }}</v-icon>
      </span>
      <v-btn text class="main__dialog-close" @click="$emit('close')">
        <v-icon> mdi-close </v-icon>
      </v-btn>
    </v-card-title>

    <v-row class="main__table-filter">
      <v-col cols="3">
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Поиск" hide-details />
      </v-col>
      <v-col cols="3">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="date"
          lazy
          transition="scale-transition"
          offset-y
          full-width
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
          <v-date-picker v-model="date" scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col>
        <v-autocomplete :items="['0-17', '18-29', '30-54', '54+']" label="Город" />
        </v-col>
      <v-col cols="2" class="main__table-ml-auto main__table-center">
        <v-switch label="Инвентарь"></v-switch>
      </v-col>
      <v-col cols="1" class="main__table-center">
        <v-btn @click="moreFilter = !moreFilter" text class="main__table-btn">
          <v-badge content="2" color="error">
            <v-icon>mdi-{{ moreFilter ? 'filter-off' : 'filter' }}</v-icon>
          </v-badge>
        </v-btn>
      </v-col>
    </v-row>

    <div v-if="moreFilter">
      <v-row class="main__table-filter">
        <v-col>
          <v-select :items="['0-17', '18-29', '30-54', '54+']" label="Возраст"></v-select>
        </v-col>
        <v-col>
          <v-select :items="['начинающие', 'Любители', 'Профи', 'Высшая лига']" label="Уровень"></v-select>
        </v-col>
        <v-col cols="3" class="main__table-rating">
          Рейтинг
          <v-icon
            v-for="star in 5"
            :key="star"
            @click.native="setCurrentRating(star)"
            @mouseover="rating = star"
            @mouseleave="rating = currentRating"
            class="main__table-rating-item"
          >
            mdi-star{{ rating >= star ? '' : '-outline' }}
          </v-icon>
        </v-col>
      </v-row>
    </div>

    <v-data-table
      :search="search"
      :headers="headers"
      :items="matches"
      item-value="name"
      class="main__table"
      :items-per-page="5"
      :footer-props="{
        'items-per-page-options': [5, 10]
      }"
    >
      <template v-slot:item.minAge="{ item }"> {{ item.age }} </template>
      <template v-slot:item.count="{ item }"> {{ item.count }}{{ `/${item.maxCount || defaultMaxCount}` }} </template>
      <template v-slot:item.level="{ item }">
        {{ getLevel(item.level) }}
      </template>
      <template v-slot:item.rating="{ item }">
        <v-icon v-for="star in item.rating" :key="star" size="13">mdi-star</v-icon>
      </template>
      <template v-slot:item.inventory="{ item }">
        {{ item.inventory ? 'Имеется' : 'Не имеется' }}
      </template>
    </v-data-table>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn v-if="moreFilter"> Сбросить фильтры </v-btn>
      <v-btn color="red" @click="$emit('close')"> Отмена </v-btn>
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
      defaultMaxCount: 31,
      currentRating: null,
      rating: null,
      moreFilter: false,

      headers: [
        {
          text: 'Город',
          sortable: false,
          value: 'name'
        },
        { text: 'Дата', value: 'date' },
        { text: 'Время', value: 'time' },
        { text: 'Кол-во игроков', value: 'count' },
        { text: 'Возраст', value: 'minAge' },
        { text: 'Место', value: 'place', sortable: false },
        { text: 'Рейтинг', value: 'rating' },
        { text: 'Уровень', value: 'level' },
        { text: 'Инвентарь', value: 'inventory' }
      ],
      matches: [
        {
          name: 'Учалы',
          date: new Date().toLocaleString().split(', ')[0],
          time: new Date().toLocaleString().split(', ')[1],
          count: 5,
          maxCount: 12,
          minAge: 10,
          maxMage: 15,
          age: 'от 10 до 15 лет',
          rating: 2,
          level: 1,
          place: 'Стадион горняк',
          inventory: true
        },
        ...new Array(20).fill({
          name: 'Уфа',
          date: new Date().toLocaleString().split(', ')[0],
          time: new Date().toLocaleString().split(', ')[1],
          count: 12,
          minAge: 18,
          age: 'от 18 лет',
          rating: 5,
          level: 2,
          place: 'Динамо',
          inventory: false
        })
      ],

      search: '',
      menu: false,
      date: null
    }
  },
  methods: {
    getLevel(level) {
      switch (level) {
        case 0:
          return 'Новички'
        case 1:
          return 'Любители'
        case 2:
          return 'Профи'
        default:
          return '-'
      }
    },
    setCurrentRating(star) {
      if (this.currentRating == star && star == 1) {
        this.currentRating = null
      } else {
        this.currentRating = star
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main__table {
  background: none !important;
  max-height: 80% !important;

  &-filter {
    margin: 0 15px;
  }

  &-rating {
    display: flex;
    align-items: center;

    &-item {
      cursor: pointer;

      &:first-of-type {
        margin-left: 10px;
      }
    }
  }

  &-ml-auto {
    margin-left: auto;
  }

  &-center {
    display: flex;
    align-items: center;
  }

  &-btn {
    border-radius: 50%;
    min-width: 35px !important;
    width: 35px !important;
    height: 35px !important;
  }
}
</style>
