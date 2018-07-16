import { signUp } from './signUp'
import { confirmSignUp } from './confirmSignUp'
import { signIn } from './signIn'
import { signOut } from './signOut'
import { checkAuthState } from './checkAuthState'
import { requestForgotPasswordCode, resetPassword } from './forgotPassword'
import { setNewPassword } from './requireNewPassword'
import { verifyUser } from './verifyUser'

export const AuthProxy = {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  checkAuthState,
  requestForgotPasswordCode,
  resetPassword,
  setNewPassword,
  verifyUser
}
