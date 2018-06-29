import * as React from 'react'
import { Auth } from 'aws-amplify'
import { Form, Field, FormikProps, Formik, FormikActions } from 'formik'
import * as yup from 'yup'
import { Query, QueryResult } from 'react-apollo'
import { GET_LOCAL_STATES } from '../../data/actions/Queries'
import { GetLocalStatesQuery } from '../../data/graphql-types'
import { AUTH } from './authConstants';

interface IAuthFormValues {
  email: string
  authCode: string
}

export interface ISignupConfirmState {}

class SignupConfirm extends React.Component<any, ISignupConfirmState> {
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
                onSubmit={(values, formikBag) => confirmSubmit(values, formikBag, qryRes)}
                component={FormConfirm}
              />
              <button onClick={() => this.props.onStateChange(AUTH.SIGNIN)}>Go to SignIn</button>
            </>
          )
        }}
      </Query>
    )
  }
}

// yup schema for signup form validation
const schemaConfirm = yup.object().shape({
  authCode: yup.number().required()
})

const FormConfirm = (formikProps: FormikProps<IAuthFormValues>) => (
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
    <button onClick={() => console.log('resend code')}>Resend Code</button>
  </Form>
)

// method to register user in AWS Cognito
const confirmSubmit = async (
  values: IAuthFormValues,
  formikBag: FormikActions<IAuthFormValues>,
  qryRes: QueryResult<GetLocalStatesQuery>
) => {
  formikBag.setSubmitting(true)
  if (!qryRes.data || !qryRes.data.forms) return
  try {
    const res = await Auth.confirmSignUp(qryRes.data.forms.input_Email, values.authCode)
    formikBag.resetForm()
    console.log('Signup Confirm Successful: ', res)
    formikBag.setSubmitting(false)
  } catch (err) {
    // check signin api for returned object
    formikBag.setErrors({
      authCode: err.message
    })
    formikBag.setSubmitting(false)
    console.log(`Signup Confirm Failed: `, err)
  }
}

export default SignupConfirm
