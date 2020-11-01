function deepClone (menu) {
  let arr = []
  for (let i = 0; i < menu.length; i++) {
    arr.push(Object.assign({}, menu[i]))
  }
  return arr
}
export default deepClone
