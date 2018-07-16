import * as React from 'react'
import { Form, Field, Formik, FormikActions, FormikProps } from 'formik'
import { Query } from 'react-apollo'
import { GetLocalStatesQuery } from '../../data/graphql-types'
import { GET_LOCAL_STATES } from '../../data/actions/Queries'
import * as yup from 'yup'
import { TtoComp, TsetAuth } from './AuthenticatorRouter'
import { AuthProxy } from './AuthProxies/AuthProxy'
import { verifyUser } from './AuthProxies/verifyUser'
import { ICognitoUser } from './AuthProxies/AuthTypes'

// *1 define the form values interface
interface IRequireNewPasswordValues {
  password: string
  confirmPassword: string
}

export interface IRequireNewPasswordProps {
  toComp: TtoComp
  userData?: ICognitoUser | null
  setAuth: TsetAuth
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
    if (!this.props.userData || !this.props.userData.challengeParam) return
    const res = await AuthProxy.setNewPassword(this.props.userData, values.password, this.props.userData.challengeParam.requiredAttributes)

    if (res.data) {
      formikBag.resetForm()
      formikBag.setSubmitting(false)
      if (res.data.challengeName === 'SMS_MFA') {
        this.props.toComp('confirmSignIn')
      } else {
        const verificationDetail = await verifyUser(res.data)
        this.props.setAuth(verificationDetail)
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
                onSubmit={(values, formikBag) => this.changePassword(values, formikBag)}
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
