import * as React from 'react'
import { Auth } from 'aws-amplify'
import { Form, Field, FormikProps, Formik, FormikActions } from 'formik'
import * as yup from 'yup'
import { Query } from 'react-apollo'
import { GET_LOCAL_STATES } from '../../data/actions/Queries'
import { GetLocalStatesQuery } from '../../data/graphql-types'
import { TtoComp } from './AuthenticatorRouter'
import { AuthProxy } from './AuthProxies/AuthProxy'

interface IAuthFormValues {
  email: string
  authCode: string
}

export interface ISignupConfirmState {}

export interface ISignupConfirmProps {
  toComp: TtoComp
}

// yup schema for signup form validation
const schemaConfirm = yup.object().shape({
  authCode: yup.number().required()
})

const FormConfirm = (formikProps: FormikProps<IAuthFormValues>) => (
  <>
    <Form>
      <Field name="email" placeholder="Email" />
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

class SignupConfirm extends React.Component<ISignupConfirmProps, ISignupConfirmState> {
  // method to register user in AWS Cognito
  public confirm = async (values: IAuthFormValues, formikBag: FormikActions<IAuthFormValues>) => {
    formikBag.setSubmitting(true)
    const res = await AuthProxy.confirmSignUp(values.email, values.authCode)
    if (res.data) {
      formikBag.resetForm()
      formikBag.setSubmitting(false)
      this.props.toComp('signIn')
    } else if (res.error) {
      formikBag.setErrors({
        authCode: res.error.message
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
                  email: email || ''
                }}
                validationSchema={schemaConfirm}
                onSubmit={(values, formikBag) => this.confirm(values, formikBag)}
                component={FormConfirm}
              />
              <button onClick={() => this.resend(email)}>Resend Code</button>
              <button onClick={() => this.props.toComp('signIn')}>Go to SignIn</button>
            </>
          )
        }}
      </Query>
    )
  }
}

export default SignupConfirm
