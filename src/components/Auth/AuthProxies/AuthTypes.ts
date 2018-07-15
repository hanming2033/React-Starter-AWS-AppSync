export type TChanllenges = 'SMS_MFA' | 'MFA_SETUP' | 'SOFTWARE_TOKEN_MFA' | 'NEW_PASSWORD_REQUIRED' | 'TOTP' | 'SMS'

export interface IUserProps {
  username: string
  password: string
  attributes: {
    name: string
    phone_number: string
    email: string
  }
}

export interface ICognitoError {
  code: string
  name: string
  message: string
}

export interface ICognitoUser {
  challengeName?: TChanllenges
  challengeParam?: {
    requiredAttributes: [string]
    userAttributes: {
      email: string
      phone_number: string
      phone_number_verified: string
    }
  }
  Session: string | null
  attributes?: {
    email: string
    email_verified: boolean
    name: string
    phone_number: string
    phone_number_verified: boolean
  }
  authenticationFlowType: string
  client: {
    endpoint: string
    userAgent: string
  }
  pool?: ICognitoUserPool
  signInUserSession: ICognitoUserSession | null
  storage: { [key: string]: string }
  username: string
  userConfirmed?: boolean
  userSub?: string
}

export interface ICognitoUserSession {
  accessToken: ICognitoAccessToken
  clockDrift: number
  idToken: ICognitoIdToken
  refreshToken: { token: string }
}

export interface ICodeDeliveryDetails {
  AttributeName: string
  DeliveryMedium: string
  Destination: string
}

export interface IVerification {
  verified: { [key: string]: string }
  unverified: { [key: string]: string }
}

interface ICognitoUserPool {
  advancedSecurityDataCollectionFlag: boolean
  client: {
    endpoint: string
    userAgent: string
  }
  clientId: string
  storage: { [key: string]: string }
  userPoolId: string
}

interface ICognitoAccessToken {
  jwtToken: string
  payload: {
    auth_time: number
    client_id: string
    event_id: string
    exp: number
    iat: number
    iss: string
    jti: string
    scope: string
    sub: string
    token_use: string
    username: string
  }
}

interface ICognitoIdToken {
  jwtToken: string
  payload: {
    aud: string
    auth_time: number
    'cognito:username': string
    email: string
    email_verified: boolean
    event_id: string
    exp: number
    iat: number
    iss: string
    name: string
    phone_number: string
    phone_number_verified: boolean
    sub: string
    token_use: string
  }
}
