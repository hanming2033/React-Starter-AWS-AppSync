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

// export const verifyUser = async (user: any) => {
//   const verification = await Auth.verifiedContact(user)
//   console.log('VerifyContact Post-Verification Result : ', verification)
//   // get local states from
//   const res: GetLocalStatesQuery | null = client.readQuery({ query: GET_LOCAL_STATES })
//   // return null(means not verified) if no data from local state
//   if (!res || !res.auth) return { verified: {}, unverified: {} }
//   // create a new dummy object
//   const newData: GetLocalStatesQuery = {
//     ...res,
//     auth: {
//       ...res.auth
//     }
//   }
//   // change the authentication based on if user is verified
//   if (!JS.isEmpty(verification.verified)) {
//     if (newData.auth) {
//       newData.auth.isAuthenticated = true
//     }
//   } else {
//     if (newData.auth) {
//       newData.auth.isAuthenticated = false
//     }
//   }
//   // write auth state to local state
//   client.writeQuery({
//     query: GET_LOCAL_STATES,
//     data: newData
//   })
//   return verification
// }
