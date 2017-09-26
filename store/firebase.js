const firebase = require('firebase')

if (process.env.dev) {
  require('dotenv').config()
}

const { apiKey, databaseURL } = process.env

firebase.initializeApp({ apiKey, databaseURL })

const database = firebase.database()

// const authenticate = token => {
//   const credential = firebase.auth.GithubAuthProvider.credential(token)
//   return firebase
//     .auth()
//     .signInWithCredential(credential)
//     .catch(error => console.log(error))
// }

const logout = () => firebase.auth().signOut()

const set = (repo, values, sha, token) => {
  // authenticate(token)
  database
    .ref(repo)
    .child(sha)
    .set(values)
  logout()
}
const get = async (repo, token) => {
  //  authenticate(token)
  const snapshot = await database
    .ref(repo)
    .limitToLast(1)
    .once('value')

  const object = snapshot.val()
  if (!object) return []
  return Object.values(object)[0]
}

module.exports = { set, get }
