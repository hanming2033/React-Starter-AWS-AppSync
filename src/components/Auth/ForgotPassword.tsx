import * as React from 'react'
import { Form, Field, Formik, FormikActions, FormikProps } from 'formik'
import { Query, QueryResult } from 'react-apollo'
import { GetLocalStatesQuery } from '../../data/graphql-types'
import { GET_LOCAL_STATES } from '../../data/actions/Queries'
import { Auth } from 'aws-amplify'
import * as yup from 'yup'
import { AUTH } from './authConstants';

// *1 define the form values interface
interface IRequestFormValues {
  email: string
}
interface IResetFormValues {
  email: string
  code: string
  password: string
  confirmPassword: string
}

export interface IMySignInProps {}

export interface IMySignInState {}

// *2 define yup schema for form validation
const schemaRequest = yup.object().shape({
  email: yup
    .string()
    .email('Not a valid email')
    .required('Email is required')
})
const schemaReset = yup.object().shape({
  email: yup
    .string()
    .email('Not a valid email')
    .required('Email is required'),
  code: yup.string().required(),
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null])
    .required('Password confirm is required')
})

// *3 create actual form outsourced from Formik
const formRequest = ({ errors, touched, isSubmitting }: FormikProps<IRequestFormValues>) => (
  <Form>
    <Field name="email" placeholder="Email" />
    {touched.email && errors.email}
    <br />
    <button disabled={isSubmitting}>Send Code</button>
  </Form>
)
const formReset = ({ errors, touched, isSubmitting }: FormikProps<IResetFormValues>) => (
  <Form>
    <Field name="email" placeholder="Email" />
    {touched.email && errors.email}
    <br />
    <Field name="code" placeholder="Auth Code" />
    {touched.code && errors.code}
    <br />
    <Field type="password" name="password" placeholder="Password" />
    {touched.password && errors.password}
    <br />
    <Field type="password" name="confirmPassword" placeholder="Password" />
    {touched.confirmPassword && errors.confirmPassword}
    <br />
    <button disabled={isSubmitting}>Reset Password</button>
  </Form>
)

class MySignIn extends React.Component<any, IMySignInState> {
  public state = { reset: false }

  public toReset = () => {
    this.setState({ reset: true })
  }

  public render() {
    // condition to show component
    if (this.props.authState !== AUTH.FORGOT_PASSWORD) return null

    return (
      <Query<GetLocalStatesQuery> query={GET_LOCAL_STATES} fetchPolicy="no-cache">
        {qryRes => {
          if (qryRes.error) return <h1>Error!!</h1>
          if (!qryRes.data || !qryRes.data.forms) return null

          return (
            <>
              {/* 5inject Formik component into view */}
              <h1>Forgot Password</h1>
              <Formik
                // get current user email from global state first
                initialValues={{
                  email: qryRes.data.forms.input_Email || '',
                  code: '',
                  password: '',
                  confirmPassword: ''
                }}
                validationSchema={this.state.reset ? schemaReset : schemaRequest}
                onSubmit={
                  this.state.reset
                    ? (values: any, formikBag) => resetPassword(values, formikBag)
                    : (values, formikBag) => requestCode(values, formikBag, qryRes, this.toReset)
                }
                component={this.state.reset ? formReset : formRequest}
              />
              <button onClick={() => this.props.onStateChange(AUTH.SIGNIN)}>Back to Sign In</button>
            </>
          )
        }}
      </Query>
    )
  }
}

// *4 create onsubmit method
const requestCode = async (
  values: IRequestFormValues,
  formikBag: FormikActions<IRequestFormValues>,
  qryRes: QueryResult<GetLocalStatesQuery>,
  codeRequested: () => void
) => {
  formikBag.setSubmitting(true)
  // store email in local state
  if (!qryRes.data || !qryRes.data.forms) return
  const newData = {
    ...qryRes.data,
    forms: {
      ...qryRes.data.forms,
      input_Email: values.email
    }
  }
  qryRes.client.writeData({ data: newData })

  try {
    const res = await Auth.forgotPassword(values.email)
    formikBag.resetForm()
    formikBag.setSubmitting(false)
    codeRequested()
    console.log('Login Successful: ', res)
  } catch (err) {
    // check signin api for returned object
    formikBag.setErrors({
      email: err.code ? err.message : ''
    })
    formikBag.setFieldValue('password', '', false)
    formikBag.setSubmitting(false)
    console.log('Login Fail ', err)
  }
}

const resetPassword = async (values: IResetFormValues, formikBag: FormikActions<IResetFormValues>) => {
  formikBag.setSubmitting(true)
  try {
    const res = await Auth.forgotPasswordSubmit(values.email, values.code, values.password)
    formikBag.resetForm()
    formikBag.setSubmitting(false)
    console.log('Login Successful: ', res)
  } catch (err) {
    // check signin api for returned object
    formikBag.setErrors({
      email: err.code ? err.message : ''
    })
    formikBag.setFieldValue('password', '', false)
    formikBag.setSubmitting(false)
    console.log('Login Fail ', err)
  }
}

export default MySignIn
