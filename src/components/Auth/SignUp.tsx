import * as React from 'react'
import { Form, Field, Formik, FormikActions } from 'formik'
import * as yup from 'yup'
import { Query, QueryResult } from 'react-apollo'
import { GET_LOCAL_STATES } from '../../data/actions/Queries'
import { GetLocalStatesQuery } from '../../data/graphql-types'
import { TtoComp } from './AuthenticatorRouter'
import { AuthProxy } from './AuthProxies/AuthProxy'

export interface ISignupProps {
  toComp: TtoComp
}

// *1 define interface for form values
interface ISignupFormValues {
  email: string
  password: string
  phone: string
}

type TsubmitFn = (
  values: ISignupFormValues,
  formikBag: FormikActions<ISignupFormValues>,
  qryRes: QueryResult<GetLocalStatesQuery>,
  props: ISignupProps
) => void

// *2 define yup schema for signup form validation
const schemaSignup = yup.object().shape({
  email: yup
    .string()
    .email('Not a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Minimum 6 characters')
    .required('Password is required'),
  phone: yup.mixed().required()
})

// *3 create actual formik form component
export const FormikSignUp = (qryRes: QueryResult<GetLocalStatesQuery>, submit: TsubmitFn, props: ISignupProps) => (
  <Formik
    initialValues={{
      email: (qryRes.data && qryRes.data.forms && qryRes.data.forms.input_Email) || '',
      password: '',
      phone: '+65'
    }}
    validationSchema={schemaSignup}
    onSubmit={(values, formikBag) => submit(values, formikBag, qryRes, props)}
    render={formikProps => (
      <Form>
        <Field name="email" placeholder="Email" />
        {formikProps.touched.email && formikProps.errors.email}
        <br />
        <Field name="password" placeholder="Password" type="password" />
        {formikProps.touched.password && formikProps.errors.password}
        <br />
        <Field name="phone" placeholder="Phone" />
        {formikProps.touched.phone && formikProps.errors.phone}
        <br />
        <button type="submit" disabled={formikProps.isSubmitting}>
          Sign Up
        </button>
      </Form>
    )}
  />
)

// *4 method to register user in AWS Cognito
const signupSubmit: TsubmitFn = async (values, formikBag, qryRes, props) => {
  formikBag.setSubmitting(true)
  // store email in link state
  if (qryRes.data && qryRes.data.forms) {
    const newData = {
      ...qryRes.data,
      forms: {
        ...qryRes.data.forms,
        input_Email: values.email
      }
    }
    qryRes.client.writeData({ data: newData })
  }

  const res = await AuthProxy.signUp({
    username: values.email,
    password: values.password,
    attributes: {
      name: 'name',
      phone_number: values.phone,
      email: values.email
    }
  })

  if (res.data) {
    formikBag.resetForm()
    formikBag.setSubmitting(false)
    props.toComp('confirmSignUp')
  } else if (res.error) {
    formikBag.setErrors({
      email: (res.error.message as string).includes('email') ? res.error.message : '',
      password: (res.error.message as string).includes('password') ? res.error.message : '',
      phone: (res.error.message as string).includes('phone number') ? res.error.message : ''
    })
    formikBag.setFieldValue('password', '', false)
    formikBag.setSubmitting(false)
  }
}

// tslint:disable-next-line:one-variable-per-declaration
const Signup: React.SFC<ISignupProps> = props => {
  return (
    <Query<GetLocalStatesQuery> query={GET_LOCAL_STATES}>
      {qryRes => {
        if (qryRes.loading) return <h3>Loading...</h3>
        if (qryRes.error || !qryRes.data) return <h3>Error...</h3>
        return (
          <>
            <h1>Sign Up</h1>
            {FormikSignUp(qryRes, signupSubmit, props)}
            <button onClick={() => props.toComp('confirmSignUp')}>Confirm a Code</button>
            <button onClick={() => props.toComp('signIn')}>Go to SignIn</button>
          </>
        )
      }}
    </Query>
  )
}

export default Signup
