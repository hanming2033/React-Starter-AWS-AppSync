// this file sets the local state defaults
// *add new global state step 1: create interfaces and default states

export const types = {
  FORMS: 'forms',
  AUTH: 'auth',
  NAV: 'nav'
}

interface IState {
  forms: {
    __typename: string
    input_Email: string
  }
}

const defaultState: IState = {
  forms: {
    __typename: types.FORMS,
    input_Email: ''
  }
}

export default defaultState
