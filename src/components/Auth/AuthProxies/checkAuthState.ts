import { Auth } from 'aws-amplify'
import { ICognitoUser, ICognitoUserSession } from './AuthTypes'

interface ICheckAuthStateResult {
  data?: {
    user: ICognitoUser
    session?: ICognitoUserSession
  }
  error?: string
}

export const checkAuthState = async (): Promise<ICheckAuthStateResult> => {
  try {
    // get current user
    const user = await Auth.currentAuthenticatedUser()
    // get current session
    const session = await Auth.currentSession()

    console.log('Proxy checkAuthState Success ', user, session)
    return { data: { user, session } }
    // !removed
    // check if current user is a verified user
    // const verificationDetail = await verifyUser(user)
    // if (JS.isEmpty(verificationDetail.unverified)) return { data: { user } }
  } catch (error) {
    console.log('Proxy checkAuthState Fail : ', error)
    return { error }
  }
}
