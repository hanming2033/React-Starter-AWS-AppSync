import * as React from 'react'
import { Form, Field, FormikProps, Formik, FormikActions } from 'formik'
import * as yup from 'yup'
import { Query, QueryResult } from 'react-apollo'
import { GET_LOCAL_STATES } from '../../data/actions/Queries'
import { GetLocalStatesQuery } from '../../data/graphql-types'
import { TtoComp } from './AuthenticatorRouter'
import { AuthProxy } from './AuthProxies/AuthProxy'

interface ISignupFormValues {
  email: string
  password: string
  phone: string
}

export interface ISignupProps {
  toComp: TtoComp
}

export interface ISignupState {}

// yup schema for signup form validation
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

// actual form for signup
const FormSignup = (formikProps: FormikProps<ISignupFormValues>) => (
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
)

export const FormikSignUp = (
  qryRes: QueryResult<GetLocalStatesQuery>,
  signupSubmit: (values: ISignupFormValues, formikBag: FormikActions<ISignupFormValues>, qryRes: QueryResult<GetLocalStatesQuery>) => void
) => (
  <Formik
    initialValues={{
      email: (qryRes.data && qryRes.data.forms && qryRes.data.forms.input_Email) || '',
      password: '',
      phone: '+65'
    }}
    validationSchema={schemaSignup}
    onSubmit={(values, formikBag) => signupSubmit(values, formikBag, qryRes)}
    render={formikProps => FormSignup(formikProps)}
  />
)

class Signup extends React.Component<ISignupProps, ISignupState> {
  // method to register user in AWS Cognito
  public signupSubmit = async (
    values: ISignupFormValues,
    formikBag: FormikActions<ISignupFormValues>,
    qryRes: QueryResult<GetLocalStatesQuery>
  ) => {
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
      this.props.toComp('confirmSignUp')
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

  public render() {
    return (
      <Query<GetLocalStatesQuery> query={GET_LOCAL_STATES}>
        {qryRes => {
          if (qryRes.loading) return <h3>loading...</h3>
          if (qryRes.error || !qryRes.data || !qryRes.data.forms) return <h3>Error...</h3>
          return (
            <div>
              <h1>Sign Up</h1>
              {FormikSignUp(qryRes, this.signupSubmit)}
              <button onClick={() => this.props.toComp('confirmSignUp')}>Confirm a Code</button>
              <button onClick={() => this.props.toComp('signIn')}>Go to SignIn</button>
            </div>
          )
        }}
      </Query>
    )
  }
}

export default Signup
