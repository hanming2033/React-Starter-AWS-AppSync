import * as React from 'react'
import { Form, Field, Formik, FormikActions, FormikProps } from 'formik'
import { Query, QueryResult } from 'react-apollo'
import { GetLocalStatesQuery } from '../../data/graphql-types'
import { GET_LOCAL_STATES } from '../../data/actions/Queries'
import * as yup from 'yup'
import { TtoComp } from './AuthenticatorRouter'
import { AuthProxy } from './AuthProxies/AuthProxy'
import { updateCacheForm } from '../../utils/AuthUtils'

export interface IForgotPasswordProps {
  toComp: TtoComp
}
export interface IForgotPasswordState {
  delivery: any | null
}

// *1.1 define interface for request form values
interface IRequestFormValues {
  email: string
}
// *1.2 define interface for reset form values
interface IResetFormValues {
  email: string
  code: string
  password: string
  confirmPassword: string
}

// *2.1 define yup schema for request form validation
const schemaRequest = yup.object().shape({
  email: yup
    .string()
    .email('Not a valid email')
    .required('Email is required')
})
// *2.2 define yup schema for request form validation
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

// *3.1 create actual request formik form component
export const FormikRequestCode = (
  qryRes: QueryResult<GetLocalStatesQuery>,
  setState: (newState: any) => void,
  toComp: (component: string) => void,
  delivery: any | undefined
) => (
  <Formik
    initialValues={{
      email: (qryRes.data && qryRes.data.forms && qryRes.data.forms.input_Email) || ''
    }}
    validationSchema={schemaRequest}
    onSubmit={(values, formikBag) => requestCode(values, formikBag, qryRes, setState, toComp)}
    render={({ errors, touched, isSubmitting }: FormikProps<IRequestFormValues>) => (
      <Form>
        <Field name="email" placeholder="Email" disabled={delivery ? true : false} />
        <span>{touched.email && errors.email}</span>
        <br />
        {delivery ? null : (
          <button type="submit" disabled={isSubmitting}>
            Send Code
          </button>
        )}
      </Form>
    )}
  />
)
// *3.2 create actual reset formik form component
export const FormikResetPassword = (email: string, setState: (newState: any) => void, toComp: (component: string) => void) => (
  <Formik
    initialValues={{
      email: email || '',
      code: '',
      password: '',
      confirmPassword: ''
    }}
    validationSchema={schemaReset}
    onSubmit={(values, formikBag) => resetPassword(values, formikBag, setState, toComp)}
    render={({ errors, touched, isSubmitting }: FormikProps<IResetFormValues>) => (
      <Form>
        {/* <Field name="email" placeholder="Email" disabled />
        <span>{touched.email && errors.email}</span>
        <br /> */}
        <Field name="code" placeholder="Auth Code" />
        <span>{touched.code && errors.code}</span>
        <br />
        <Field type="password" name="password" placeholder="Password" />
        <span>{touched.password && errors.password}</span>
        <br />
        <Field type="password" name="confirmPassword" placeholder="Password" />
        <span>{touched.confirmPassword && errors.confirmPassword}</span>
        <br />
        <button type="submit" disabled={isSubmitting}>
          Reset Password
        </button>
      </Form>
    )}
  />
)

// *4.1 request code submit function
const requestCode = async (
  values: IRequestFormValues,
  formikBag: FormikActions<IRequestFormValues>,
  qryRes: QueryResult<GetLocalStatesQuery>,
  setState: (newState: any) => void,
  toComp: (component: string) => void
) => {
  formikBag.setSubmitting(true)
  // store email in local state
  updateCacheForm(qryRes, 'input_Email', values.email)

  const res = await AuthProxy.requestForgotPasswordCode(values.email)
  if (res.data) {
    setState({ delivery: res.data.CodeDeliveryDetails })
    formikBag.resetForm()
    formikBag.setSubmitting(false)
  } else if (res.error) {
    formikBag.setErrors({
      email: (res.error.message as string).includes('Username/client') ? 'Email Not Found' : ''
    })
    formikBag.setFieldValue('email', '', false)
    formikBag.setSubmitting(false)
    if (res.error && (res.error.message as string).includes('no registered/verified')) {
      toComp('confirmSignUp')
    }
  }
}

// *4.2 reset password submit function
const resetPassword = async (
  values: IResetFormValues,
  formikBag: FormikActions<IResetFormValues>,
  setState: (newState: any) => void,
  toComp: (component: string) => void
) => {
  formikBag.setSubmitting(true)
  const res = await AuthProxy.resetPassword(values.email, values.code, values.password)
  if (res.data) {
    formikBag.resetForm()
    formikBag.setSubmitting(false)
    setState({ delivery: null })
    toComp('signIn')
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

// * Main Component
class ForgotPassword extends React.Component<IForgotPasswordProps, IForgotPasswordState> {
  public state = { delivery: null }

  public render() {
    const setState = this.setState.bind(this)
    return (
      <Query<GetLocalStatesQuery> query={GET_LOCAL_STATES} fetchPolicy="no-cache">
        {qryRes => {
          if (qryRes.error) return <h1>Error!!</h1>
          if (qryRes.loading || !qryRes.data || !qryRes.data.forms) return <h1>Loading...</h1>
          return (
            <>
              <h1>Forgot Password</h1>
              {/* {this.state.delivery
                ? FormikResetPassword(qryRes.data.forms.input_Email, setState, this.props.toComp)
                : FormikRequestCode(qryRes, setState, this.props.toComp)} */}
              {FormikRequestCode(qryRes, setState, this.props.toComp, this.state.delivery)}
              {this.state.delivery ? FormikResetPassword(qryRes.data.forms.input_Email, setState, this.props.toComp) : null}
              <button onClick={() => this.props.toComp('signIn')}>Back to Sign In</button>
            </>
          )
        }}
      </Query>
    )
  }
}

export default ForgotPassword
