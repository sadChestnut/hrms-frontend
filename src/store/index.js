import Vuex from 'vuex';
import vue from 'vue';
import mutitions from './mutitions';
import actions from './actions';
import getters from './getters';

vue.use(Vuex)

const state = {
  goods: [
    {
      id: 0,
      name: 'iphone1',
      price: 200,
      num: 0
    },
     {
      id: 1,
      name: 'iphone2',
      price: 100,
      num: 0
     }
  ],
  totalPrice: 0,
  totalNum: 0
}
export default new Vuex.Store({
  state,
  mutitions,
  actions,
  getters,
})
