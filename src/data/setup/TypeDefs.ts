// *add new global state step 3: copy clientSchema.graphql into here
// this enables apollo dev tool to have the schma. not critical

const typeDefs = `
  type Query {
    forms: forms
    nav: nav
  }

  type forms {
    input_Email: String!
  }

  type nav {
    nextPath: String!
  }
`
export default typeDefs
