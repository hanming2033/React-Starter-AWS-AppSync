export const AUTH = {
  FORGOT_PASSWORD: 'forgotPassword',
  SIGNIN: 'signIn',
  SIGNUP: 'signUp',
  CONFIRM_SIGNIN: 'confirmSignIn',
  REQUIRE_NEW_PASSWORD: 'requireNewPassword',
  TOTP_SETUP: 'TOTPSetup',
  CONFIRM_SIGNUP: 'confirmSignUp',
  VERIFY_CONTACT: 'verifyContact',
  SIGNED_OUT: 'signedOut',
  SIGNED_UP: 'signedUp'
}

export interface IAmplifyReact {
  onStateChange: (authStage: string, data?: any) => void
  authState: string
  authData: any
}
