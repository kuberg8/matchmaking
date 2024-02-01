<template>
  <div>
    <v-card-title class="main__dialog-head">
      <span class="text-h5 main__dialog-title"
        >Поиск матча
        <v-icon>mdi-{{ screen.type }}</v-icon>
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
          <v-date-picker v-model="date" scrollable>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn color="primary" @click="$refs.menu.save(date)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col>
        <v-autocomplete
          v-model="city"
          :items="cities"
          @change="getEvents"
          item-value="city"
          item-text="city"
          label="Город"
          no-data-text="Город не найден"
        />
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
        <v-col cols="4">
          <v-select :items="['0-17', '18-29', '30-54', '54+']" label="Возраст"></v-select>
        </v-col>
        <v-col cols="4">
          <v-select :items="['начинающие', 'Любители', 'Профи', 'Высшая лига']" label="Уровень"></v-select>
        </v-col>
      </v-row>
    </div>

    <v-data-table
      :search="search"
      :headers="headers"
      :items="matches"
      :loading="loading"
      item-value="name"
      class="main__table"
      loading-text="Загрузка матчей..."
      :items-per-page="limit"
      :serverItemsLength="totalCount"
      :footer-props="{
        'items-per-page-options': [5, 10],
        'items-per-page-text': 'Матчей на странице:'
      }"
      @click:row="rowClick"
      @update:options="getEventsByOptions"
    >
      <template #item.place="{ item }">
        <div class="text-overflow">{{ item.place }}</div>
      </template>
      <template #item.time="{ item }">{{ item.time.substring(0, 5) }}</template>
      <template #item.minAge="{ item }">
        <span v-if="item.minAge && item.maxAge"> от {{ item.minAge }} до {{ item.maxAge }} </span>
        <span v-else>-</span>
      </template>
      <template #item.count="{ item }">
        {{ item.memberCount || '-' }}{{ item.memberCount && item.maxMemberCount ? `/${item.maxMemberCount}` : '' }}
      </template>
      <template #item.level="{ item }">
        {{ getLevel(item.level) }}
      </template>
      <template #item.inventory="{ item }">
        {{ item.inventory ? 'Имеется' : 'Не имеется' }}
      </template>

      <template slot="no-data"> Матчи не найдены. </template>
    </v-data-table>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn v-if="moreFilter"> Сбросить фильтры </v-btn>
      <v-btn color="red" @click="$emit('close')"> Отмена </v-btn>
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
  data() {
    return {
      moreFilter: false,

      headers: [
        {
          text: 'Город',
          value: 'city',
          sortable: false
        },
        { text: 'Место', value: 'place', sortable: false },
        { text: 'Дата', value: 'date' },
        { text: 'Время', value: 'time' },
        { text: 'Кол-во игроков', value: 'count', sortable: false },
        { text: 'Возраст', value: 'minAge', sortable: false },
        { text: 'Уровень', value: 'level' },
        { text: 'Инвентарь', value: 'inventory' }
      ],
      city: null,
      cities,
      matches: [],

      search: '',
      menu: false,
      date: null,
      loading: false,

      page: 1,
      limit: 5,
      sort: 'date',
      sortType: 'asc',
      totalCount: null
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
    async getEvents() {
      try {
        this.loading = true

        const params = {
          page: this.page - 1,
          limit: this.limit,
          sort: this.sort,
          sort_type: this.sortType,
          city: this.city
        }

        const { items, totalCount } = await this.$axios.$get('events', { params })
        this.matches = items
        this.totalCount = totalCount
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    rowClick(e) {
      this.$router.push(`/match/${e.id}`)
    },
    getEventsByOptions({ itemsPerPage, page, sortBy, sortDesc }) {
      this.page = page
      this.limit = itemsPerPage
      this.sort = sortBy[0] || ''
      this.sortType = sortDesc[0] ? 'desc' : 'asc'
      this.getEvents()
    }
  }
}
</script>

<style lang="scss">
tr {
  cursor: pointer;
}

.v-application .accent--text {
  color: #1976d2 !important;
}
</style>

<style lang="scss" scoped>
.text-overflow {
  max-width: 150px;
  text-overflow: ellipsis;
  overflow: hidden;
  // white-space: nowrap;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.main__table {
  background: none !important;
  max-height: 80% !important;

  &-filter {
    margin: 0 15px;
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
