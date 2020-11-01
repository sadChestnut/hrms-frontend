import crypto from 'crypto'

function md5 (password) {
  const hash = crypto.createHash('md5')
  hash.update(password)
  return hash.digest('hex')
}

export default md5
