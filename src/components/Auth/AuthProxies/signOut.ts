import { Auth } from 'aws-amplify'

export const signOut = async (): Promise<null> => {
  try {
    Auth.signOut()
    console.log('Proxy SignOut Success')
    return null
  } catch (error) {
    console.log('Proxy SignOut Fail : ', error)
    return null
  }
}
