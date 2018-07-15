import { Auth } from 'aws-amplify'
import { ICognitoError } from './AuthTypes'

interface IConfirmSignUpResult {
  data?: string
  error?: ICognitoError
}

export const confirmSignUp = async (email: string, authCode: string): Promise<IConfirmSignUpResult> => {
  try {
    const data = await Auth.confirmSignUp(email, authCode)
    console.log('Proxy confirmSignup Success : ', data)
    return { data }
  } catch (error) {
    console.log('Proxy confirmSignup Fail : ', error)
    return { error }
  }
}
