import * as React from 'react'
import { Form, Field, Formik, FormikActions } from 'formik'
import { Query, QueryResult } from 'react-apollo'
import { GetLocalStatesQuery } from '../../data/graphql-types'
import { GET_LOCAL_STATES } from '../../data/actions/Queries'
import * as yup from 'yup'
import { AuthProxy } from './AuthProxies/AuthProxy'
import { TtoComp, TsetAuth } from './AuthenticatorRouter'
import { verifyUser } from './AuthProxies/verifyUser'
import { updateCacheForm } from '../../utils/AuthUtils'

export interface ISignInProps {
  toComp: TtoComp
  setAuth: TsetAuth
}

export interface ISignInState {}

// *1 define interface for form values
interface ISigninFormValues {
  email: string
  password: string
}

type TsubmitFn = (
  values: ISigninFormValues,
  formikBag: FormikActions<ISigninFormValues>,
  qryRes: QueryResult<GetLocalStatesQuery>,
  props: ISignInProps
) => void

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

// *3 create actual formik form component
export const FormikSignIn = (qryRes: QueryResult<GetLocalStatesQuery>, submit: TsubmitFn, props: ISignInProps) => (
  <Formik
    // get current user email from global state first
    initialValues={{
      email: (qryRes.data && qryRes.data.forms && (qryRes.data.forms.input_Email as string)) || '',
      password: ''
    }}
    validationSchema={schemaSignup}
    onSubmit={(values, formikBag) => submit(values, formikBag, qryRes, props)}
    render={formikProps => (
      <Form>
        <Field name="email" placeholder="Email" />
        {formikProps.touched.email && <span>{formikProps.errors.email}</span>}
        <br />
        <Field type="password" name="password" placeholder="Password" />
        {formikProps.touched.password && <span>{formikProps.errors.password}</span>}
        <br />
        <button type="submit" disabled={formikProps.isSubmitting}>
          Sign In
        </button>
      </Form>
    )}
  />
)

// *4 create onsubmit method
const loginSubmit = async (
  values: ISigninFormValues,
  formikBag: FormikActions<ISigninFormValues>,
  qryRes: QueryResult<GetLocalStatesQuery>,
  props: ISignInProps
) => {
  formikBag.setSubmitting(true)
  // store username in apollo link state on submit
  updateCacheForm(qryRes, 'input_Email', values.email)

  const res = await AuthProxy.signIn(values.email, values.password)
  if (res.data) {
    if (res.data.challengeName === 'SMS_MFA' || res.data.challengeName === 'SOFTWARE_TOKEN_MFA') {
      props.toComp('confirmSignIn') // Future: check if mfa works
    } else if (res.data.challengeName === 'NEW_PASSWORD_REQUIRED') {
      props.toComp('requireNewPassword', res.data)
    } else {
      const verificationDetail = await verifyUser(res.data)
      props.setAuth(verificationDetail)
    }
  } else if (res.error) {
    formikBag.setSubmitting(false)
    formikBag.setFieldValue('password', '', false)
    formikBag.setErrors({
      email: res.error.code ? res.error.message : '',
      password: res.error.code === 'NotAuthorizedException' ? res.error.message : ''
    })
    if (res.error.code === 'UserNotConfirmedException') {
      props.toComp('confirmSignUp')
    }
  }
}

// *Component
class Signin extends React.Component<ISignInProps, ISignInState> {
  public render() {
    return (
      <Query<GetLocalStatesQuery> query={GET_LOCAL_STATES} fetchPolicy="no-cache">
        {qryRes => {
          if (qryRes.loading) return <h1>Loading...</h1>
          if (qryRes.error || !qryRes.data) return <h1>Error...</h1>
          return (
            <>
              <h1>Sign In</h1>
              {FormikSignIn(qryRes, loginSubmit, this.props)}
              <button onClick={() => this.props.toComp('forgotPassword')}>Forgot Password</button>
              <button onClick={() => this.props.toComp('signUp')}>Go To SignUp</button>
            </>
          )
        }}
      </Query>
    )
  }
}

export default Signin
