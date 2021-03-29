import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    listLastFivePokemons: [],
  },
  getters: {
    getListLastFivePokemons(state) {
      return state.listLastFivePokemons;
    },
  },
  mutations: {
    loadListFivePokemon(state, arrPesquisasFeitas) {
      state.listLastFivePokemons = arrPesquisasFeitas;
    },

    setNomePokemon(state, namePokemon) {
      let arrPesquisasFeitas =
        JSON.parse(
          localStorage.getItem("@pokeminListRomulo:listLastFivePokemons")
        ) || [];

      if (
        Array.isArray(arrPesquisasFeitas) &&
        arrPesquisasFeitas.length <= 5 &&
        namePokemon.length > 0
      ) {
        if (arrPesquisasFeitas.length === 5) {
          arrPesquisasFeitas.pop();
          arrPesquisasFeitas.unshift(namePokemon);
        } else {
          arrPesquisasFeitas.push(namePokemon);
        }
      }

      state.listLastFivePokemons = arrPesquisasFeitas;
      localStorage.setItem(
        "@pokeminListRomulo:listLastFivePokemons",
        JSON.stringify(arrPesquisasFeitas)
      );
    },
  },
  actions: {
    loadListFivePokemon({ commit }) {
      const arrPesquisasFeitas = commit(
        "loadListFivePokemon",
        arrPesquisasFeitas
      );
    },
    setNomePokemon({ commit }, namePokemon) {
      commit("setNomePokemon", namePokemon);
    },
  },
});
