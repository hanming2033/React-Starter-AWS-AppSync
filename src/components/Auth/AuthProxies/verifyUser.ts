import { Auth } from 'aws-amplify'
import { ICognitoUser } from './AuthTypes'

export const verifyUser = async (user: ICognitoUser) => {
  const verification = await Auth.verifiedContact(user)
  console.log('VerifyUser Post-Verification Result : ', verification)
  return verification
}
