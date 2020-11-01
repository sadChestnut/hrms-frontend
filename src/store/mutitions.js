import { ADD_CART, REDUCE_CART } from './mutation-types'
export default {
  [ADD_CART](state, id) {
    state[id].num++;
    state[id].totalNum++;
    state[id].totalPrice += state[id].price
  },
  [REDUCE_CART](state, id) {
    if (state[id].num > 0) {
      state[id].num--;
      state[id].totalNum--;
      state[id].totalPrice += state[id].price
    }
  }
}