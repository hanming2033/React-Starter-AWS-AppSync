import { SetAuthMutation, SetAuthMutationVariables, GetLocalStatesQuery } from '../graphql-types'
import { Context } from '../../../node_modules/react-apollo'
import { GET_LOCAL_STATES } from '../actions/Queries'

// fieldName: (obj, args, context, info) => result;

// args: An object containing all of the arguments passed into the field. For example, if you called a mutation with updateNetworkStatus(isConnected: true), the args object would be { isConnected: true }.

// context: The context object, which is shared by all links in the Apollo Link chain. The most important thing to note here is that we’ve added the Apollo cache to the context for you, so you can manipulate the cache with cache.writeData({}).

export const mutationResolvers = {
  Mutation: {
    // ! figure out what context should be typed to
    setAuth: (_: any, variables: SetAuthMutationVariables, context: Context): SetAuthMutation => {
      const localState: GetLocalStatesQuery = context.cache.readQuery({ query: GET_LOCAL_STATES })
      const newData = {
        ...localState,
        auth: {
          ...localState.auth,
          isAuthenticated: variables.status
        }
      }
      context.cache.writeData({ data: newData })
      return { setAuth: variables.status }
    }
  }
}
