import * as React from 'react'
import { Form, Field, Formik, FormikActions, FormikProps } from 'formik'
import { Query, QueryResult } from 'react-apollo'
import { GetLocalStatesQuery } from '../../data/graphql-types'
import { GET_LOCAL_STATES } from '../../data/actions/Queries'
import { Auth } from 'aws-amplify'
import * as yup from 'yup'
import { AUTH } from './authUtils'

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

export interface IForgotPasswordProps {}

export interface IMyForgotPasswordState {}

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
    <Field name="email" placeholder="Email" disabled/>
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

class ForgotPassword extends React.Component<any, IMyForgotPasswordState> {
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

    try {
      const data = await Auth.forgotPassword(values.email)
      this.setState({ delivery: data.CodeDeliveryDetails })
      console.log(this.state.delivery)
      formikBag.resetForm()
      formikBag.setSubmitting(false)
    } catch (err) {
      formikBag.setErrors({
        email: err.code ? err.message : ''
      })
      formikBag.setFieldValue('password', '', false)
      formikBag.setSubmitting(false)
    }
  }

  public resetPassword = async (values: IResetFormValues, formikBag: FormikActions<IResetFormValues>) => {
    formikBag.setSubmitting(true)
    try {
      await Auth.forgotPasswordSubmit(values.email, values.code, values.password)
      formikBag.resetForm()
      formikBag.setSubmitting(false)
      this.setState({ delivery: null })
      this.props.onStateChange(AUTH.SIGNIN)
    } catch (err) {
      formikBag.setErrors({
        email: err.code ? err.message : ''
      })
      formikBag.setFieldValue('password', '', false)
      formikBag.setSubmitting(false)
    }
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
                validationSchema={this.state.delivery ? schemaReset : schemaRequest}
                onSubmit={
                  this.state.delivery
                    ? (values: any, formikBag) => this.resetPassword(values, formikBag)
                    : (values, formikBag) => this.requestCode(values, formikBag, qryRes)
                }
                component={this.state.delivery ? formReset : formRequest}
              />
              <button onClick={() => this.props.onStateChange(AUTH.SIGNIN)}>Back to Sign In</button>
            </>
          )
        }}
      </Query>
    )
  }
}

export default ForgotPassword
