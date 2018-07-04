import * as React from 'react'
import { Auth } from 'aws-amplify'
import { Form, Field, FormikProps, Formik, FormikActions } from 'formik'
import * as yup from 'yup'
import { Query } from 'react-apollo'
import { GET_LOCAL_STATES } from '../../data/actions/Queries'
import { GetLocalStatesQuery } from '../../data/graphql-types'
import { AUTH } from './authUtils'

interface IAuthFormValues {
  email: string
  authCode: string
}

export interface ISignupConfirmState {}

// yup schema for signup form validation
const schemaConfirm = yup.object().shape({
  authCode: yup.number().required()
})

const FormConfirm = (formikProps: FormikProps<IAuthFormValues>) => (
  <>
    <Form>
      <Field name="email" placeholder="Email" disabled />
      {formikProps.touched.email && formikProps.errors.email}
      <br />
      <Field name="authCode" placeholder="Auth Code" />
      {formikProps.touched.authCode && formikProps.errors.authCode}
      <br />
      <button type="submit" disabled={formikProps.isSubmitting}>
        Confirm
      </button>
    </Form>
  </>
)

class SignupConfirm extends React.Component<any, ISignupConfirmState> {
  // method to register user in AWS Cognito
  public confirm = async (values: IAuthFormValues, formikBag: FormikActions<IAuthFormValues>) => {
    formikBag.setSubmitting(true)
    try {
      await Auth.confirmSignUp(values.email, values.authCode)
      formikBag.resetForm()
      formikBag.setSubmitting(false)
      this.props.onStateChange(AUTH.SIGNIN)
    } catch (err) {
      // check signin api for returned object
      formikBag.setErrors({
        authCode: err.message
      })
      formikBag.setSubmitting(false)
      formikBag.setFieldValue('authCode', '', false)
    }
  }

  public resend = async (email: string) => {
    await Auth.resendSignUp(email)
    // TODO: add logic to display 'code sent' message
  }

  public render() {
    // condition to show component
    if (this.props.authState !== AUTH.CONFIRM_SIGNUP) return null

    return (
      <Query<GetLocalStatesQuery> query={GET_LOCAL_STATES}>
        {qryRes => {
          if (!qryRes.data || !qryRes.data.forms) return null
          const { input_Email: email } = qryRes.data.forms
          return (
            <>
              <h1>Confirm Sign Up</h1>
              <Formik
                initialValues={{
                  authCode: '',
                  email
                }}
                validationSchema={schemaConfirm}
                onSubmit={(values, formikBag) => this.confirm(values, formikBag)}
                component={FormConfirm}
              />
              <button onClick={() => this.resend(email)}>Resend Code</button>
              <button onClick={() => this.props.onStateChange(AUTH.SIGNIN)}>Go to SignIn</button>
            </>
          )
        }}
      </Query>
    )
  }
}

export default SignupConfirm
