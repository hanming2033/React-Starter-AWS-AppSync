import { Auth, JS } from 'aws-amplify'
import { TChangeComponent, TSetAuth } from './AuthenticatorRouter'

interface IAuthResult {
  isAuthenticated: boolean
  userVerified?: boolean
  data?: ICognitoUser & any
  error?: any
  passwordChanged?: boolean
}
export type TChanllenges = 'SMS_MFA' | 'MFA_SETUP' | 'SOFTWARE_TOKEN_MFA' | 'NEW_PASSWORD_REQUIRED' | 'TOTP' | 'SMS'

interface IUserProps {
  username: string
  password: string
  attributes: {
    name: string
    phone_number: string
    email: string
  }
}

export interface ICognitoUser {
  challengeName: TChanllenges
}

export const AuthProxy = {
  signUp: async (userProperties: IUserProps) => {
    try {
      const data = await Auth.signUp(userProperties)
      console.log('Proxy signUp Fail : ', data)
      return { isAuthenticated: false, data }
    } catch (error) {
      console.log('Proxy signUp Fail : ', error)
      return { isAuthenticated: false, error }
    }
  },
  signIn: async (username: string, password: string): Promise<IAuthResult> => {
    try {
      const data = await Auth.signIn(username, password)
      console.log('Proxy signIn Success : ', data)
      return { isAuthenticated: true, data }
    } catch (error) {
      console.log('Proxy signIn Fail : ', error)
      return { isAuthenticated: false, error }
    }
  },
  signOut: async (): Promise<IAuthResult> => {
    try {
      Auth.signOut()
      console.log('Proxy SignOut Success : ')
      return { isAuthenticated: false }
    } catch (error) {
      console.log('Proxy SignOut Fail : ', error)
      return { isAuthenticated: false, error }
    }
  },
  checkAuthState: async (): Promise<IAuthResult> => {
    try {
      const data = await Auth.currentSession()
      console.log('Proxy checkAuthState Success : ', data)
      return { isAuthenticated: true, data }
    } catch (error) {
      console.log('Proxy checkAuthState Fail : ', error)
      return { isAuthenticated: false, error }
    }
  },
  requestForgotPasswordCode: async (email: string): Promise<IAuthResult> => {
    try {
      const data = await Auth.forgotPassword(email)
      console.log('Proxy requestForgotPW Success : ', data)
      return { isAuthenticated: false, data }
      // this.setState({ delivery: data.CodeDeliveryDetails })
    } catch (error) {
      console.log('Proxy requestForgotPW Fail : ', error)
      return { isAuthenticated: false, error }
    }
  },
  resetPassword: async (email: string, authCode: string, password: string): Promise<IAuthResult> => {
    try {
      await Auth.forgotPasswordSubmit(email, authCode, password)
      return { isAuthenticated: false, data: { passwordChanged: true } }
    } catch (error) {
      console.log('Proxy resetPassword Fail : ', error)
      return { isAuthenticated: false, error }
    }
  },
  setNewPassword: async (user: any, password: string, requiredAttributes: any): Promise<IAuthResult> => {
    try {
      const data = await Auth.completeNewPassword(user, password, requiredAttributes)
      console.log('Proxy setNewPassword Success : ', data)
      return { isAuthenticated: false, data }
    } catch (error) {
      console.log('Proxy setNewPassword Fail : ', error)
      return { isAuthenticated: false, error }
    }
  }
}

// TODO: set auth here. this shld be the final check
export const verifyUser = async (user: any, changeComponentTo: TChangeComponent, setAuth: TSetAuth) => {
  const verification = await Auth.verifiedContact(user)
  console.log('VerifyContact Post-Verification Result : ', verification)
  if (!JS.isEmpty(verification.verified)) {
    setAuth(true)
  } else {
    setAuth(false)
    user = { ...user, ...verification }
    changeComponentTo('verifyContact', user)
  }
}
