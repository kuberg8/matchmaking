export const state = () => ({})

export const getters = {}

export const mutations = {}

export const actions = {
  async getUserInfo(token) {
    const { data } = await this.$axios.$get(
      `https://login.yandex.ru/info?format=json&jwt_secret=${process.env.JWT_SECRET}`,
      {
        headers: {
          Authorization: 'OAuth ' + token
        }
      }
    )
    console.log(data)
  }
}
