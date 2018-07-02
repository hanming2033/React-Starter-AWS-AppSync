import * as React from 'react'
import { Form, Field, Formik, FormikActions, FormikProps } from 'formik'
import { Query } from 'react-apollo'
import { GetLocalStatesQuery } from '../../data/graphql-types'
import { GET_LOCAL_STATES } from '../../data/actions/Queries'
import * as yup from 'yup'
import { validComponents, TChangeComponent } from './AuthenticatorRouter'
import { AuthProxy } from './AuthProxy'

// *1 define the form values interface
interface IRequireNewPasswordValues {
  email: string
  password: string
  confirmPassword: string
}

export interface IRequireNewPasswordProps {
  changeComponentTo: TChangeComponent
  authData?: any
}

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

class RequireNewPassword extends React.Component<IRequireNewPasswordProps, IRequireNewPasswordState> {
  // *4 create onsubmit method
  public changePassword = async (values: IRequireNewPasswordValues, formikBag: FormikActions<IRequireNewPasswordValues>) => {
    formikBag.setSubmitting(true)
    const userData = this.props.authData
    const { requiredAttributes } = userData.challengeParam
    const res = await AuthProxy.setNewPassword(userData, values.password, requiredAttributes)

    if (res.data) {
      formikBag.resetForm()
      formikBag.setSubmitting(false)
      if (res.data.challengeName === 'SMS_MFA') {
        this.props.changeComponentTo('confirmSignIn')
      } else if (res.data.challengeName === 'MFA_SETUP') {
        this.props.changeComponentTo('TOTPSetup')
      } else {
        this.props.changeComponentTo('signIn')
        alert('investigate where should this point to....')
      }
    } else if (res.error) {
      formikBag.setErrors({
        password: res.error.code ? res.error.message : '',
        confirmPassword: res.error.code ? res.error.message : ''
      })
      formikBag.setFieldValue('password', '', false)
      formikBag.setFieldValue('confirmPassword', '', false)
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
              <h1>Set New Pasword</h1>
              <Formik
                // get current user email from global state first
                initialValues={{
                  password: '',
                  confirmPassword: ''
                }}
                validationSchema={schemaReset}
                onSubmit={(values: any, formikBag) => this.changePassword(values, formikBag)}
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
