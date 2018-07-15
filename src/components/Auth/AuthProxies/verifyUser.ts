import { GetLocalStatesQuery } from '../../../data/graphql-types'
import { client } from '../../../index'
import { GET_LOCAL_STATES } from '../../../data/actions/Queries'
import { Auth, JS } from 'aws-amplify'
import { IVerification } from './AuthTypes'

export const verifyUser = async (user: any) => {
  const verification = await Auth.verifiedContact(user)
  console.log('VerifyContact Post-Verification Result : ', verification)
  const newData = getAuthState(verification)
  // write auth state to local state
  client.writeQuery({
    query: GET_LOCAL_STATES,
    data: newData
  })
  return verification
}

// set auth on local starte
export const getAuthState = (verification: IVerification): GetLocalStatesQuery | null => {
  // get local states from
  const res: GetLocalStatesQuery | null = client.readQuery({ query: GET_LOCAL_STATES })
  // return null(means not verified) if no data from local state
  if (!res || !res.auth) return null
  // create a new dummy object
  const newData: GetLocalStatesQuery = {
    ...res,
    auth: {
      ...res.auth
    }
  }
  // change the authentication based on if user is verified
  if (!JS.isEmpty(verification.verified)) {
    if (newData.auth) {
      newData.auth.isAuthenticated = true
    }
  } else {
    if (newData.auth) {
      newData.auth.isAuthenticated = false
    }
  }
  return newData
}
