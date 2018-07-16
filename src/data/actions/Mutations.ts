// *add new global state step 4: add queries, mutations and subscriptions

import gql from 'graphql-tag'

// export const SIGNUP_USER = gql`
//   mutation SignupUser($email: String!, $name: String!, $password: String!) {
//     signup(email: $email, name: $name, password: $password) {
//       token
//     }
//   }
// `

// export const LOGIN_USER = gql`
//   mutation LoginUser($email: String!, $password: String!) {
//     login(email: $email, password: $password) {
//       payload {
//         token
//       }
//       error {
//         field
//         msg
//       }
//     }
//   }
// `

export const SET_AUTH = gql`
  mutation SetAuth($status: Boolean!) {
    setAuth(status: $status) @client
  }
`
