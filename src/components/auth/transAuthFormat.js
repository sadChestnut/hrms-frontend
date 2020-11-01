function transAuthFormat (auths) {
  return auths.map(item => item.auth.replace('/', '').replace(/\//g, '-'))
}
export default transAuthFormat
