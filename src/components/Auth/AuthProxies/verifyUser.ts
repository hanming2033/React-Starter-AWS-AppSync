import { Auth } from 'aws-amplify'

export const verifyUser = async (user: any) => {
  const verification = await Auth.verifiedContact(user)
  console.log('VerifyUser Post-Verification Result : ', verification)
  return verification
}
