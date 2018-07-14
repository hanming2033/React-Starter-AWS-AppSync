import { Auth, JS } from 'aws-amplify'
import { GetLocalStatesQuery } from '../../data/graphql-types'
import { GET_LOCAL_STATES } from '../../data/actions/Queries'
import { client } from '../../index'

export type TChanllenges = 'SMS_MFA' | 'MFA_SETUP' | 'SOFTWARE_TOKEN_MFA' | 'NEW_PASSWORD_REQUIRED' | 'TOTP' | 'SMS'

interface IAuthResult {
  userVerified?: boolean
  data?: {
    user: ICognitoUser // signup
    userConfirmed: false // signup
    userSub: string // signup
    CodeDeliveryDetails?: any // forget
  }
  error?: ICognitoError
  passwordChanged?: boolean
}

export interface ICognitoError {
  code: string
  name: string
  message: string
}

export interface ICognitoUser {
  challengeName?: TChanllenges
  Session: string | null
  authenticationFlowType: string
  client: {
    endpoint: string
    userAgent: string
  }
  pool: {
    advancedSecurityDataCollectionFlag: boolean
    client: {
      endpoint: string
      userAgent: string
    }
    clientId: string
    storage: { [key: string]: string }
    userPoolId: string
  }
  signInUserSession: string | null
  storage: { [key: string]: string }
  username: string
  userConfirmed: boolean
  userSub: string
}

interface IUserProps {
  username: string
  password: string
  attributes: {
    name: string
    phone_number: string
    email: string
  }
}

export const AuthProxy = {
  signUp: async (userProperties: IUserProps) => {
    try {
      const data = await Auth.signUp(userProperties)
      console.log('Proxy signUp Success : ', data)
      return { data }
    } catch (error) {
      console.log('Proxy signUp Fail : ', error)
      return { error }
    }
  },
  confirmSignUp: async (email: string, authCode: string) => {
    try {
      const data = await Auth.confirmSignUp(email, authCode)
      console.log('Proxy confirmSignup Success : ', data)
      return { data }
    } catch (error) {
      console.log('Proxy confirmSignup Fail : ', error)
      return { error }
    }
  },
  signIn: async (username: string, password: string): Promise<IAuthResult> => {
    try {
      const data = await Auth.signIn(username, password)
      console.log('Proxy signIn Success : ', data)
      return { data }
    } catch (error) {
      console.log('Proxy signIn Fail : ', error)
      return { error }
    }
  },
  signOut: async (): Promise<IAuthResult> => {
    try {
      Auth.signOut()
      console.log('Proxy SignOut Success : ')
      return {}
    } catch (error) {
      console.log('Proxy SignOut Fail : ', error)
      return { error }
    }
  },
  checkAuthState: async (): Promise<IAuthResult> => {
    try {
      // get current user
      const user = await Auth.currentAuthenticatedUser()
      // check if current user is a verified user
      const verificationDetail = await verifyUser(user)
      if (JS.isEmpty(verificationDetail.unverified)) return { userVerified: false }
      // check current session
      const data = await Auth.currentSession()
      console.log('Proxy checkAuthState Success ', user, data)
      return { data }
    } catch (error) {
      console.log('Proxy checkAuthState Fail : ', error)
      return { error }
    }
  },
  requestForgotPasswordCode: async (email: string): Promise<IAuthResult> => {
    try {
      const data = await Auth.forgotPassword(email)
      console.log('Proxy requestForgotPW Success : ', data)
      return { data }
    } catch (error) {
      console.log('Proxy requestForgotPW Fail : ', error)
      return { error }
    }
  },
  resetPassword: async (email: string, authCode: string, password: string): Promise<IAuthResult> => {
    try {
      await Auth.forgotPasswordSubmit(email, authCode, password)
      return { passwordChanged: true }
    } catch (error) {
      console.log('Proxy resetPassword Fail : ', error)
      return { error }
    }
  },
  setNewPassword: async (user: any, password: string, requiredAttributes: any): Promise<IAuthResult> => {
    try {
      const data = await Auth.completeNewPassword(user, password, requiredAttributes)
      console.log('Proxy setNewPassword Success : ', data)
      return { data }
    } catch (error) {
      console.log('Proxy setNewPassword Fail : ', error)
      return { error }
    }
  }
}

export const verifyUser = async (user: any) => {
  const res: GetLocalStatesQuery | null = client.readQuery({ query: GET_LOCAL_STATES })
  if (!res || !res.auth) return { verified: {}, unverified: {} }
  const verification = await Auth.verifiedContact(user)
  console.log('VerifyContact Post-Verification Result : ', verification)
  const newData: GetLocalStatesQuery = {
    ...res,
    auth: {
      ...res.auth
    }
  }

  if (!JS.isEmpty(verification.verified)) {
    if (newData.auth) {
      newData.auth.isAuthenticated = true
    }
  } else {
    if (newData.auth) {
      newData.auth.isAuthenticated = false
    }
  }
  client.writeQuery({
    query: GET_LOCAL_STATES,
    data: newData
  })
  return verification
}
