import { Auth } from 'aws-amplify'
import { ICognitoUser } from './AuthTypes'

interface ICheckAuthStateResult {
  data?: {
    user: ICognitoUser
  }
  error?: string
}

export const checkAuthState = async (): Promise<ICheckAuthStateResult> => {
  try {
    // get current user
    const user = await Auth.currentAuthenticatedUser()

    // console.log('Proxy checkAuthState Success ', user)
    return { data: { user } }
  } catch (error) {
    // console.log('Proxy checkAuthState Fail : ', error)
    return { error }
  }
}
