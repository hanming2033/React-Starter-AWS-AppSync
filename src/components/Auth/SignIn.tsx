import * as React from 'react'
import { Form, Field, Formik, FormikActions, FormikProps } from 'formik'
import { Query, QueryResult } from 'react-apollo'
import { GetLocalStatesQuery } from '../../data/graphql-types'
import { GET_LOCAL_STATES } from '../../data/actions/Queries'
import { Auth, JS } from 'aws-amplify'
import * as yup from 'yup'
import { AUTH } from './authConstants'

// *1 define the form values interface
interface ISigninFormValues {
  email: string
  password: string
}

export interface IMySignInProps {}

export interface IMySignInState {}

// *2 define yup schema for form validation
const schemaSignup = yup.object().shape({
  email: yup
    .string()
    .email('Not a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Minimum 6 characters')
    .required('Password is required')
})

// *3 create actual form outsourced from Formik
const formSignin = ({ errors, touched, isSubmitting }: FormikProps<ISigninFormValues>) => (
  <Form>
    <Field name="email" placeholder="Email" />
    {touched.email && errors.email}
    <br />
    <Field type="password" name="password" placeholder="Password" />
    {touched.password && errors.password}
    <br />
    <button disabled={isSubmitting}>Submit</button>
  </Form>
)

// *Component
class MySignIn extends React.Component<any, IMySignInState> {
  public render() {
    // condition to show component
    if ([AUTH.SIGNIN, AUTH.SIGNED_OUT, AUTH.SIGNUP].indexOf(this.props.authState) === -1) return null

    return (
      <Query<GetLocalStatesQuery> query={GET_LOCAL_STATES} fetchPolicy="no-cache">
        {qryRes => {
          if (qryRes.error) return <h1>Error!!</h1>
          if (!qryRes.data || !qryRes.data.forms) return null

          return (
            <>
              {/* 5inject Formik component into view */}
              <h1>Sign In</h1>
              <Formik
                // get current user email from global state first
                initialValues={{
                  email: qryRes.data.forms.input_Email || '',
                  password: ''
                }}
                validationSchema={schemaSignup}
                onSubmit={(values, formikBag) => login(values, formikBag, qryRes, this.props.onStateChange)}
                component={formSignin}
              />
              <button onClick={() => this.props.onStateChange(AUTH.FORGOT_PASSWORD)}>Forgot Password</button>
              <button onClick={() => this.props.onStateChange(AUTH.SIGNUP)}>Go to SignUp</button>
            </>
          )
        }}
      </Query>
    )
  }
}

// *4 create onsubmit method
const login = async (
  values: ISigninFormValues,
  formikBag: FormikActions<ISigninFormValues>,
  qryRes: QueryResult<GetLocalStatesQuery>,
  changeState: (errMsg: string, userVal?: string) => void
) => {
  formikBag.setSubmitting(true)
  // store username in apollo link state on submit
  if (qryRes.data && qryRes.data.forms) {
    const newData: GetLocalStatesQuery = {
      ...qryRes.data,
      forms: {
        ...qryRes.data.forms,
        input_Email: values.email
      }
    }
    qryRes.client.writeData({ data: newData })
  }
  // sign in user to aws conginto
  try {
    const user = await Auth.signIn(values.email, values.password)
    if (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
      changeState(AUTH.CONFIRM_SIGNIN, user)
    } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
      changeState(AUTH.REQUIRE_NEW_PASSWORD, user)
    } else if (user.challengeName === 'MFA_SETUP') {
      changeState(AUTH.TOTP_SETUP, user)
    } else {
      checkContact(user, changeState)
    }
  } catch (err) {
    formikBag.setSubmitting(false)
    formikBag.setFieldValue('password', '', false)
    // check signin api for returned object
    formikBag.setErrors({
      email: err.code ? err.message : '',
      password: err.code === 'NotAuthorizedException' ? err.message : ''
    })

    if (err.code === 'UserNotConfirmedException') {
      changeState(AUTH.CONFIRM_SIGNUP)
    }
  }
}

const checkContact = (user: any, changeState: (errMsg: string, userVal?: string) => void) => {
  Auth.verifiedContact(user).then(data => {
    if (!JS.isEmpty(data.verified)) {
      changeState(AUTH.SIGNIN, user)
    } else {
      user = { ...user, ...data }
      changeState(AUTH.VERIFY_CONTACT, user)
    }
  })
}

export default MySignIn
