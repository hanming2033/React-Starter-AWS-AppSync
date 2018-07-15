import { IUserProps, ICognitoUser, ICognitoError } from './AuthTypes'
import { Auth } from 'aws-amplify'

interface ISignUpResult {
  userConfirmed?: boolean
  data?: {
    user: ICognitoUser
    userConfirmed: false
    userSub: string
  }
  userSub?: string
  error?: ICognitoError
}

export const signUp = async (userProperties: IUserProps): Promise<ISignUpResult> => {
  try {
    const data = await Auth.signUp(userProperties)
    console.log('Proxy signUp Success : ', data)
    return { data }
  } catch (error) {
    console.log('Proxy signUp Fail : ', error)
    return { error }
  }
}
