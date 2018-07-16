import { Auth } from 'aws-amplify'
import { ICognitoError, ICodeDeliveryDetails } from './AuthTypes'

interface IRequestPasswordCodeResult {
  data?: { CodeDeliveryDetails: ICodeDeliveryDetails }
  error?: ICognitoError
}

export const requestForgotPasswordCode = async (email: string): Promise<IRequestPasswordCodeResult> => {
  try {
    const data = await Auth.forgotPassword(email)
    console.log('Proxy requestForgotPW Success : ', data)
    return { data }
  } catch (error) {
    console.log('Proxy requestForgotPW Fail : ', error)
    return { error }
  }
}

interface IResetPasswordResult {
  data?: { message: string }
  error?: ICognitoError
}

export const resetPassword = async (email: string, authCode: string, password: string): Promise<IResetPasswordResult> => {
  try {
    await Auth.forgotPasswordSubmit(email, authCode, password)
    console.log('Proxy resetPassword Success')
    return { data: { message: 'Password Reset Successful. Please login again' } }
  } catch (error) {
    console.log('Proxy resetPassword Fail : ', error)
    return { error }
  }
}
