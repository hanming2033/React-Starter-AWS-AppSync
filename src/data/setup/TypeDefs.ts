// *add new global state step 3: copy clientSchema.graphql into here
// this enables apollo dev tool to have the schma. not critical

const typeDefs = `
  type Query {
    forms: forms
    nav: nav
    auth: auth
  }

  type forms {
    input_Email: String!
  }

  type nav {
    nextPath: String!
  }

  type auth {
    isAuthenticated: Boolean!
  }
  type Mutation {
    setAuth(status: Boolean!): Boolean!
  }
`
export default typeDefs
