// *add new global state step 4: add queries, mutations and subscriptions

// import gql from 'graphql-tag'

// export const ON_NEW_LINK_ADDED_SUB = gql`
//   subscription OnNewLinkAdded {
//     newLink {
//       node {
//         id
//         url
//         description
//         createdAt
//         postedBy {
//           id
//           name
//         }
//         votes {
//           id
//           user {
//             id
//           }
//         }
//       }
//     }
//   }
// `

// export const ON_NEW_VOTE_ADDED_SUB = gql`
//   subscription OnNewVoteAddedSub {
//     newVote {
//       node {
//         id
//         link {
//           id
//           url
//           description
//           createdAt
//           postedBy {
//             id
//             name
//           }
//           votes {
//             id
//             user {
//               id
//             }
//           }
//         }
//         user {
//           id
//         }
//       }
//     }
//   }
// `
