// TODO: finish Verify contact https://github.com/aws/aws-amplify/blob/master/packages/aws-amplify-react/src/Auth/VerifyContact.jsx
// import * as React from 'react'
// import { Form, Field, Formik,  FormikProps } from 'formik'
// import { Query } from 'react-apollo'
// import { GetLocalStatesQuery } from '../../data/graphql-types'
// import { GET_LOCAL_STATES } from '../../data/actions/Queries'
// import { Auth } from 'aws-amplify'
// import * as yup from 'yup'
// import { AUTH } from './authUtils'

// // *1 define the form values interface
// interface IRequestFormValues {
//   email?: string
//   phone?: string
// }
// interface IResetFormValues {
//   authCode: string
// }

// export interface IForgotPasswordProps {}

// export interface IMyForgotPasswordState {}

// // *2 define yup schema for form validation
// const schemaRequest = yup.object().shape({
//   email: yup.string().email('Not a valid email'),
//   phone: yup.number()
// })
// const schemaReset = yup.object().shape({
//   authCode: yup.string().required()
// })

// class ForgotPassword extends React.Component<any, IMyForgotPasswordState> {
//   public state = { verifyAttr: null }

//   // *3 create actual form outsourced from Formik
//   public formVerify = ({ errors, touched, isSubmitting }: FormikProps<IRequestFormValues>) => {
//     const data = this.props.authData
//     if (!data) return null
//     const { unverified } = data
//     if (!unverified) return null
//     const { email, phone_number } = unverified
//     return (
//       <Form>
//         {email ? (
//           <>
//             <Field type="radio" name="email" placeholder="Email" />
//             {touched.email && errors.email}
//             <br />
//           </>
//         ) : null}
//         {phone_number ? (
//           <>
//             <Field type="radio" name="phone" placeholder="Phone Number" />
//             {touched.phone && errors.phone}
//             <br />
//           </>
//         ) : null}
//         <button disabled={isSubmitting}>Send Verification Code</button>
//       </Form>
//     )
//   }

//   public formSubmit = ({ errors, touched, isSubmitting }: FormikProps<IResetFormValues>) => (
//     <Form>
//       <Field type="radio" name="authCode" placeholder="Authentication Code" />
//       {touched.authCode && errors.authCode}
//       <br />
//       <button disabled={isSubmitting}>Verify</button>
//     </Form>
//   )

//   // *4 create onsubmit method
//   public verify() {
//     const { contact, checkedValue } = this.inputs
//     if (!contact) return

//     Auth.verifyCurrentUserAttribute(checkedValue)
//       .then(data => {
//         logger.debug(data)
//         this.setState({ verifyAttr: checkedValue })
//       })
//       .catch(err => this.error(err))
//   }

//   public submit() {
//     const attr = this.state.verifyAttr
//     const { code } = this.inputs
//     Auth.verifyCurrentUserAttributeSubmit(attr, code)
//       .then(data => {
//         logger.debug(data)
//         this.changeState('signedIn', this.props.authData)
//         this.setState({ verifyAttr: null })
//       })
//       .catch(err => this.error(err))
//   }

//   public render() {
//     // condition to show component
//     if (this.props.authState !== AUTH.FORGOT_PASSWORD) return null

//     return (
//       <Query<GetLocalStatesQuery> query={GET_LOCAL_STATES} fetchPolicy="no-cache">
//         {qryRes => {
//           if (qryRes.error) return <h1>Error!!</h1>
//           if (!qryRes.data || !qryRes.data.forms) return null

//           return (
//             <>
//               {/* 5inject Formik component into view */}
//               <h1>Forgot Password</h1>
//               <Formik
//                 // get current user email from global state first
//                 initialValues={{
//                   email: qryRes.data.forms.input_Email || '',
//                   code: '',
//                   password: '',
//                   confirmPassword: ''
//                 }}
//                 validationSchema={this.state.delivery ? schemaReset : schemaRequest}
//                 onSubmit={
//                   this.state.delivery
//                     ? (values: any, formikBag) => this.resetPassword(values, formikBag)
//                     : (values, formikBag) => this.requestCode(values, formikBag, qryRes)
//                 }
//                 component={this.state.delivery ? formReset : formRequest}
//               />
//               <button onClick={() => this.props.onStateChange(AUTH.SIGNIN)}>Back to Sign In</button>
//             </>
//           )
//         }}
//       </Query>
//     )
//   }
// }

// export default ForgotPassword

import * as React from 'react'

interface IappProps {}

const app: React.SFC<IappProps> = props => {
  return (
    <>
      <p>Verify Contact</p>
    </>
  )
}

export default app
