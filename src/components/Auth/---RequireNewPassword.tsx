import * as React from 'react'
import { Form, Field, Formik, FormikActions, FormikProps } from 'formik'
import { Query } from 'react-apollo'
import { GetLocalStatesQuery } from '../../data/graphql-types'
import { GET_LOCAL_STATES } from '../../data/actions/Queries'
import { Auth, JS } from 'aws-amplify'
import * as yup from 'yup'
import { AUTH } from './authUtils'

// *1 define the form values interface
interface IRequireNewPasswordValues {
  email: string
  password: string
  confirmPassword: string
}

export interface IRequireNewPasswordProps {}

export interface IRequireNewPasswordState {}

// *2 define yup schema for form validation
const schemaReset = yup.object().shape({
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Password must match')
    .required('Password confirm is required')
})

// *3 create actual form outsourced from Formik
const formReset = ({ errors, touched, isSubmitting }: FormikProps<IRequireNewPasswordValues>) => (
  <Form>
    <Field type="password" name="password" placeholder="New Password" />
    {touched.password && errors.password}
    <br />
    <Field type="password" name="confirmPassword" placeholder="Confirm Password" />
    {touched.confirmPassword && errors.confirmPassword}
    <br />
    <button disabled={isSubmitting}>Change Password</button>
  </Form>
)

class RequireNewPassword extends React.Component<any, IRequireNewPasswordState> {
  // *4 create onsubmit method
  public resetPassword = async (values: IRequireNewPasswordValues, formikBag: FormikActions<IRequireNewPasswordValues>) => {
    formikBag.setSubmitting(true)
    const userData = this.props.authData
    const { requiredAttributes } = userData.challengeParam
    try {
      const user = await Auth.completeNewPassword(userData, values.password, requiredAttributes)
      formikBag.resetForm()
      formikBag.setSubmitting(false)
      if (user.challengeName === 'SMS_MFA') {
        this.props.onStateChange(AUTH.CONFIRM_SIGNIN, user)
      } else if (user.challengeName === 'MFA_SETUP') {
        this.props.onStateChange(AUTH.TOTP_SETUP, user)
      } else {
        this.props.onStateChange(user)
      }
    } catch (err) {
      formikBag.setErrors({
        password: err.code ? err.message : '',
        confirmPassword: err.code ? err.message : ''
      })
      formikBag.setFieldValue('password', '', false)
      formikBag.setFieldValue('confirmPassword', '', false)
      formikBag.setSubmitting(false)
    }
  }

  public checkContact = async (user: any) => {
    const data = await Auth.verifiedContact(user)
    if (!JS.isEmpty(data.verified)) {
      this.props.onStateChange(AUTH.SIGNIN, user)
    } else {
      user = { ...user, ...data }
      this.props.onStateChange(AUTH.VERIFY_CONTACT, user)
    }
  }

  public render() {
    // condition to show component
    if (this.props.authState !== AUTH.REQUIRE_NEW_PASSWORD) return null

    return (
      <Query<GetLocalStatesQuery> query={GET_LOCAL_STATES} fetchPolicy="no-cache">
        {qryRes => {
          if (qryRes.error) return <h1>Error!!</h1>
          if (!qryRes.data || !qryRes.data.forms) return null

          return (
            <>
              {/* 5inject Formik component into view */}
              <h1>Set New Pasword</h1>
              <Formik
                // get current user email from global state first
                initialValues={{
                  password: '',
                  confirmPassword: ''
                }}
                validationSchema={schemaReset}
                onSubmit={(values: any, formikBag) => this.resetPassword(values, formikBag)}
                component={formReset}
              />
            </>
          )
        }}
      </Query>
    )
  }
}

export default RequireNewPassword
