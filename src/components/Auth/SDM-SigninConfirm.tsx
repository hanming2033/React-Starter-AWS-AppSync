// // Future wait for enable sms
// import * as React from 'react'
// import { Auth, JS } from 'aws-amplify'
// import { Form, Field, FormikProps, Formik, FormikActions } from 'formik'
// import * as yup from 'yup'
// import { Query, QueryResult } from 'react-apollo'
// import { GET_LOCAL_STATES } from '../../data/actions/Queries'
// import { GetLocalStatesQuery } from '../../data/graphql-types'
// import { AUTH } from './authUtils'

// interface IAuthFormValues {
//   email: string
//   authCode: string
// }

// export interface ISigninConfirmState {}

// interface ISigninConfirmPorps {}

// // yup schema for signup form validation
// const schemaConfirm = yup.object().shape({
//   authCode: yup.number().required()
// })

// const FormConfirm = (formikProps: FormikProps<IAuthFormValues>) => (
//   <Form>
//     <Field name="email" placeholder="Email" />
//     {formikProps.touched.email && formikProps.errors.email}
//     <br />
//     <Field name="authCode" placeholder="Auth Code" />
//     {formikProps.touched.authCode && formikProps.errors.authCode}
//     <br />
//     <button type="submit" disabled={formikProps.isSubmitting}>
//       Confirm
//     </button>
//   </Form>
// )

// class SigninConfirm extends React.Component<ISigninConfirmPorps & any, ISigninConfirmState> {
//   public state = {
//     mfaType: 'SMS'
//   }

//   public componentDidUpdate() {
//     const user = this.props.authData
//     const mfaType = user && user.challengeName === 'SOFTWARE_TOKEN_MFA' ? 'TOTP' : 'SMS'
//     if (this.state.mfaType !== mfaType) this.setState({ mfaType })
//   }

//   public checkContact = async (user: any) => {
//     const data = await Auth.verifiedContact(user)
//     if (!JS.isEmpty(data.verified)) {
//       this.props.onStateChange(AUTH.SIGNIN, user)
//     } else {
//       user = { ...user, ...data }
//       this.props.onStateChange(AUTH.VERIFY_CONTACT, user)
//     }
//   }

//   public confirmSubmit = async (
//     values: IAuthFormValues,
//     formikBag: FormikActions<IAuthFormValues>,
//     qryRes: QueryResult<GetLocalStatesQuery>
//   ) => {
//     formikBag.setSubmitting(true)
//     const user = this.props.authData
//     const mfaType = user.challengeName === 'SOFTWARE_TOKEN_MFA' ? 'SOFTWARE_TOKEN_MFA' : null
//     if (!qryRes.data || !qryRes.data.forms) return
//     try {
//       await Auth.confirmSignIn(user, values.authCode, mfaType)
//       this.checkContact(user)
//       formikBag.resetForm()
//       formikBag.setSubmitting(false)
//     } catch (err) {
//       // check signin api for returned object
//       formikBag.setErrors({
//         authCode: err.message
//       })
//       formikBag.setSubmitting(false)
//     }
//   }

//   public render() {
//     // condition to show component
//     if (this.props.authState !== AUTH.CONFIRM_SIGNIN) return null

//     return (
//       <Query<GetLocalStatesQuery> query={GET_LOCAL_STATES}>
//         {qryRes => {
//           if (!qryRes.data || !qryRes.data.forms) return null
//           const { input_Email: email } = qryRes.data.forms
//           return (
//             <>
//               <h1>{`Confirm Signin using ${this.state.mfaType} Code`}</h1>
//               <Formik
//                 initialValues={{
//                   authCode: '',
//                   email
//                 }}
//                 validationSchema={schemaConfirm}
//                 onSubmit={(values, formikBag) => this.confirmSubmit(values, formikBag, qryRes)}
//                 component={FormConfirm}
//               />
//               <button onClick={() => this.props.onStateChange(AUTH.SIGNIN)}>Go to SignIn</button>
//             </>
//           )
//         }}
//       </Query>
//     )
//   }
// }

// export default SigninConfirm
