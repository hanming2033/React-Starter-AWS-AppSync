import * as React from 'react'
import { Form, Field, Formik, FormikActions, FormikProps } from 'formik'
import { Query, QueryResult } from 'react-apollo'
import { GetLocalStatesQuery } from '../../data/graphql-types'
import { GET_LOCAL_STATES } from '../../data/actions/Queries'
import * as yup from 'yup'
import { RouteComponentProps } from 'react-router'
import { AuthProxy } from './AuthProxies/AuthProxy'
import { TtoComp, TsetAuth } from './AuthenticatorRouter'
import { verifyUser } from './AuthProxies/verifyUser'

// *1 define the form values interface
interface ISigninFormValues {
  email: string
  password: string
}

export interface ISignInProps {
  toComp: TtoComp
  setAuth: TsetAuth
}

export interface ISignInState {}

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
    <button disabled={isSubmitting}>Sign In</button>
  </Form>
)

// *Component
class Signin extends React.Component<ISignInProps & RouteComponentProps<{}>, ISignInState> {
  // *4 create onsubmit method
  public login = async (
    values: ISigninFormValues,
    formikBag: FormikActions<ISigninFormValues>,
    qryRes: QueryResult<GetLocalStatesQuery>
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
    const res = await AuthProxy.signIn(values.email, values.password)
    if (res.data) {
      if (res.data.challengeName === 'SMS_MFA' || res.data.challengeName === 'SOFTWARE_TOKEN_MFA') {
        this.props.toComp('confirmSignIn') // TODO: check if mfa works
      } else if (res.data.challengeName === 'NEW_PASSWORD_REQUIRED') {
        this.props.toComp('requireNewPassword', res.data)
      } else {
        const verificationDetail = await verifyUser(res.data)
        this.props.setAuth(verificationDetail)
      }
    } else if (res.error) {
      formikBag.setSubmitting(false)
      formikBag.setFieldValue('password', '', false)
      formikBag.setErrors({
        email: res.error.code ? res.error.message : '',
        password: res.error.code === 'NotAuthorizedException' ? res.error.message : ''
      })

      if (res.error.code === 'UserNotConfirmedException') {
        this.props.toComp('confirmSignUp')
      }
    }
  }

  public render() {
    return (
      <Query<GetLocalStatesQuery> query={GET_LOCAL_STATES} fetchPolicy="no-cache">
        {qryRes => {
          if (qryRes.loading) return <h1>loading...</h1>
          if (qryRes.error) return <h1>Error!!</h1>
          if (!qryRes.data || !qryRes.data.forms) return null

          return (
            <>
              {/* // *5inject Formik component into view */}
              <h1>Sign In</h1>
              <Formik
                // get current user email from global state first
                initialValues={{
                  email: qryRes.data.forms.input_Email || '',
                  password: ''
                }}
                validationSchema={schemaSignup}
                onSubmit={(values, formikBag) => this.login(values, formikBag, qryRes)}
                component={formSignin}
              />
              <button onClick={() => this.props.toComp('forgotPassword')}>Forgot Password</button>
              <button onClick={() => this.props.toComp('signUp')}>Go to SignUp</button>
            </>
          )
        }}
      </Query>
    )
  }
}

export default Signin
