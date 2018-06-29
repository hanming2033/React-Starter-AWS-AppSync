import * as React from 'react'
import { Auth } from 'aws-amplify'
import { Form, Field, FormikProps, Formik, FormikActions } from 'formik'
import * as yup from 'yup'
import { Query, QueryResult } from 'react-apollo'
import { GET_LOCAL_STATES } from '../../data/actions/Queries'
import { GetLocalStatesQuery } from '../../data/graphql-types'
import { AUTH } from './authConstants';

interface ISignupFormValues {
  email: string
  password: string
  phone: string
}

export interface ISignupState {}

class Signup extends React.Component<any, ISignupState> {
  public render() {
    // condition to show component
    if (this.props.authState !== AUTH.SIGNUP) return null

    return (
      <Query<GetLocalStatesQuery> query={GET_LOCAL_STATES}>
        {qryRes => {
          if (!qryRes.data || !qryRes.data.forms) return null
          return (
            <>
              <h1>Sign Up</h1>
              <Formik
                initialValues={{
                  email: qryRes.data.forms.input_Email,
                  password: '',
                  phone: '+65'
                }}
                validationSchema={schemaSignup}
                onSubmit={(values, formikBag) => signupSubmit(values, formikBag, qryRes, this.props.onStateChange)}
                component={FormSignup}
              />
              <button onClick={() => this.props.onStateChange(AUTH.CONFIRM_SIGNUP)}>Confirm a Code</button>
              <button onClick={() => this.props.onStateChange(AUTH.SIGNIN)}>Go to SignIn</button>
            </>
          )
        }}
      </Query>
    )
  }
}

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

// method to register user in AWS Cognito
const signupSubmit = async (
  values: ISignupFormValues,
  formikBag: FormikActions<ISignupFormValues>,
  qryRes: QueryResult<GetLocalStatesQuery>,
  changeState: (code: string) => void
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
  // sign up to aws
  try {
    const res = await Auth.signUp({
      username: values.email,
      password: values.password,
      attributes: {
        name: 'hanming',
        phone_number: values.phone,
        email: values.email
      }
    })
    formikBag.resetForm()
    formikBag.setSubmitting(false)
    changeState(AUTH.CONFIRM_SIGNUP)
    console.log('Signup Successful: ', res)
  } catch (err) {
    console.log(err)
    // check signin api for returned object
    formikBag.setErrors({
      email: (err.message as string).includes('email') ? err.message : '',
      password: (err.message as string).includes('password') ? err.message : '',
      phone: (err.message as string).includes('phone number') ? err.message : ''
    })
    formikBag.setFieldValue('password', '', false)
    formikBag.setSubmitting(false)
    console.log(`Signup Failed: `, err)
  }
}

export default Signup
