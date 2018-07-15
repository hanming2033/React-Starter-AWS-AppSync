import { Auth } from 'aws-amplify'

export const verifyUser = async (user: any) => {
  // const res: GetLocalStatesQuery | null = client.readQuery({ query: GET_LOCAL_STATES })
  // if (!res || !res.auth) return { verified: {}, unverified: {} }
  const verification = await Auth.verifiedContact(user)
  console.log('VerifyUser Post-Verification Result : ', verification)
  // const newData: GetLocalStatesQuery = {
  //   ...res,
  //   auth: {
  //     ...res.auth
  //   }
  // }

  // if (!JS.isEmpty(verification.verified)) {
  //   if (newData.auth) {
  //     newData.auth.isAuthenticated = true
  //   }
  // } else {
  //   if (newData.auth) {
  //     newData.auth.isAuthenticated = false
  //   }
  // }
  // client.writeQuery({
  //   query: GET_LOCAL_STATES,
  //   data: newData
  // })
  return verification
}
