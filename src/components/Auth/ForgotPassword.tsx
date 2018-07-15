import * as React from 'react'
import { Form, Field, Formik, FormikActions, FormikProps } from 'formik'
import { Query, QueryResult } from 'react-apollo'
import { GetLocalStatesQuery } from '../../data/graphql-types'
import { GET_LOCAL_STATES } from '../../data/actions/Queries'
import * as yup from 'yup'
import { TChangeComponent } from './AuthenticatorRouter'
import { AuthProxy } from './AuthProxies/AuthProxy'

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

export interface IForgotPasswordProps {
  toComp: TChangeComponent
}

export interface IForgotPasswordState {}

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
  code: yup.string().required('Authentication code is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
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
    <Field name="email" placeholder="Email" disabled />
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

class ForgotPassword extends React.Component<IForgotPasswordProps, IForgotPasswordState> {
  public state = { delivery: null }

  // *4 create onsubmit method
  public requestCode = async (
    values: IRequestFormValues,
    formikBag: FormikActions<IRequestFormValues>,
    qryRes: QueryResult<GetLocalStatesQuery>
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

    const res = await AuthProxy.requestForgotPasswordCode(values.email)
    if (res.data) {
      this.setState({ delivery: res.data.CodeDeliveryDetails })
      formikBag.resetForm()
      formikBag.setSubmitting(false)
    } else if (res.error) {
      formikBag.setErrors({
        email: (res.error.message as string).includes('Username/client') ? 'Email Not Found' : ''
      })
      formikBag.setFieldValue('password', '', false)
      formikBag.setSubmitting(false)
      if (res.error && (res.error.message as string).includes('no registered/verified')) {
        this.props.toComp('confirmSignUp') // *good
      }
    }
  }

  public resetPassword = async (values: IResetFormValues, formikBag: FormikActions<IResetFormValues>) => {
    formikBag.setSubmitting(true)
    const res = await AuthProxy.resetPassword(values.email, values.code, values.password)
    if (res.data) {
      formikBag.resetForm()
      formikBag.setSubmitting(false)
      this.setState({ delivery: null })
      this.props.toComp('signIn') // *good
    } else if (res.error) {
      formikBag.setErrors({
        code: res.error.code ? res.error.message : '',
        password: (res.error.message as string).includes('password') ? res.error.message : '',
        confirmPassword: (res.error.message as string).includes('password') ? res.error.message : ''
      })
      formikBag.setFieldValue('password', '', false)
      formikBag.setSubmitting(false)
    }
  }

  public render() {
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
                validationSchema={this.state.delivery ? schemaReset : schemaRequest}
                onSubmit={
                  this.state.delivery
                    ? (values: any, formikBag) => this.resetPassword(values, formikBag)
                    : (values, formikBag) => this.requestCode(values, formikBag, qryRes)
                }
                component={this.state.delivery ? formReset : formRequest}
              />
              <button onClick={() => this.props.toComp('signIn')}>Back to Sign In</button>
            </>
          )
        }}
      </Query>
    )
  }
}

export default ForgotPassword
