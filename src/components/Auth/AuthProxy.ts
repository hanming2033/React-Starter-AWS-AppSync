import { Auth, JS } from 'aws-amplify'
import { validComponents } from './AuthenticatorRouter'

interface IAuthResult {
  isAuthenticated: boolean
  data?: any
  error?: any
}

interface IAuthProxy {
  signIn: (username: string, password: string) => Promise<IAuthResult>
  signOut: () => Promise<IAuthResult>
  checkAuthState: () => Promise<IAuthResult>
  requestForgotPasswordCode: (email: string) => Promise<IAuthResult>
  resetPassword: (email: string, authCode: string, password: string) => Promise<IAuthResult>
}

export const AuthProxy: IAuthProxy = {
  signIn: async (username, password) => {
    try {
      const data = await Auth.signIn(username, password)
      console.log('Proxy signIn Try : ', data)
      return { isAuthenticated: true, data }
    } catch (error) {
      console.log('Proxy signIn Catch : ', error)
      return { isAuthenticated: false, error }
    }
  },
  signOut: async () => {
    try {
      Auth.signOut()
      return { isAuthenticated: false }
    } catch (error) {
      return { isAuthenticated: false, error }
    }
  },
  checkAuthState: async () => {
    try {
      const data = await Auth.currentSession()
      return { isAuthenticated: true, data }
    } catch (error) {
      return { isAuthenticated: false, error }
    }
  },
  requestForgotPasswordCode: async email => {
    try {
      const data = await Auth.forgotPassword(email)
      return { isAuthenticated: false, data }
      // this.setState({ delivery: data.CodeDeliveryDetails })
    } catch (error) {
      return { isAuthenticated: false, error }
    }
  },
  resetPassword: async (email, authCode, password) => {
    try {
      await Auth.forgotPasswordSubmit(email, authCode, password)
      return { isAuthenticated: false, data: { passwordChanged: true } }
    } catch (error) {
      return { isAuthenticated: false, error }
    }
  }
}

export const checkContact = async (user: any, changeComponentTo: (newComponent: validComponents) => void) => {
  const data = await Auth.verifiedContact(user)
  if (!JS.isEmpty(data.verified)) {
    changeComponentTo('signIn')
  } else {
    user = { ...user, ...data }
    changeComponentTo('verifyContact')
  }
}
