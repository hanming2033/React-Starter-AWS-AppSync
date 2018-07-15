import { Auth } from 'aws-amplify'
import { ICognitoUser, ICognitoError } from './AuthTypes'

interface IResetNewPassword {
  data?: ICognitoUser
  error?: ICognitoError
}

export const setNewPassword = async (user: any, password: string, requiredAttributes: any): Promise<IResetNewPassword> => {
  try {
    const data = await Auth.completeNewPassword(user, password, requiredAttributes)
    console.log('Proxy setNewPassword Success : ', data)
    return { data }
  } catch (error) {
    console.log('Proxy setNewPassword Fail : ', error)
    return { error }
  }
}
