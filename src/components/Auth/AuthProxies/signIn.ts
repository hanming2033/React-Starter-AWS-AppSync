import { Auth } from 'aws-amplify'
import { ICognitoUser, ICognitoError } from './AuthTypes'

interface ISignInResult {
  data?: ICognitoUser
  error?: ICognitoError
}

export const signIn = async (username: string, password: string): Promise<ISignInResult> => {
  try {
    const data = await Auth.signIn(username, password)
    console.log('Proxy signIn Success : ', data)
    return { data }
  } catch (error) {
    console.log('Proxy signIn Fail : ', error)
    return { error }
  }
}
