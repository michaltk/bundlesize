const firebase = require('firebase')

if (process.env.dev) {
  require('dotenv').config()
}

const { apiKey, databaseURL } = process.env

firebase.initializeApp({ apiKey, databaseURL })

const database = firebase.database()

const authenticate = token => {
  return firebase
    .auth()
    .signInWithEmailAndPassword(
      process.env.FIREBASE_EMAIL,
      process.env.FIREBASE_PW
    )
    .catch(error => console.log(error))
}

const logout = () => firebase.auth().signOut()

const set = async (repo, values, sha, token) => {
  await authenticate()
  values[0].sha = sha
  await database.ref(repo).push(values)
  logout()
}
const get = async (repo, token, sha) => {
  await authenticate()
  const snapshot = await database.ref(repo).once('value')
  const object = snapshot.val()
  logout()
  if (!sha) return Object.values(object).pop()
  const value = Object.values(object).find(result => result[0].sha === sha)
  if (!value) return []
  return value
}

module.exports = { set, get }
