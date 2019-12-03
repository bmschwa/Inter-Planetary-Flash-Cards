import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist';

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  key: 'vuex', // The key to store the state on in the storage provider.
  storage: window.localStorage,
  // Function that passes the state and returns the state with only the objects you want to store.
  reducer: (state) => ({
    jwt: state.jwt
    // keepThisModule: state.keepThisModule,
    // keepThisModuleToo: state.keepThisModuleToo
  })
  // Function that passes a mutation and lets you decide if it should update the state in localStorage.
  // filter: mutation => (true)
})

const store = new Vuex.Store({
  state: {
    jwt: null,
    jwtValid: false
  },
  mutations: {
    updateJwt(state, newJwt) {
      state.jwt = newJwt
    },
    deleteJwt(state) {
      state.jwt = null
    },
    toggleJwtValid(state, bool) {
      state.jwtValid = bool
    }
  },
  actions: {
    logout(context) {
      context.commit('deleteJwt')
    },
    checkJwt(context) {
      let jwt = context.state.jwt
      if (!jwt || jwt.split('.').length < 3) {
        context.commit('toggleJwtValid', false)
      }
      const data = JSON.parse(atob(jwt.split('.')[1]))
      const exp = new Date(data.exp * 1000) // JS deals with dates in milliseconds since epoch
      const now = new Date()
      context.commit('toggleJwtValid', now < exp)
    }
  },
  getters: {
    isAuthenticated: state => state.jwtValid
  },
  plugins: [vuexLocal.plugin]
})

export default store
