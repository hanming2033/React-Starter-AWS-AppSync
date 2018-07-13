// import * as React from 'react'
// import { QueryResult } from 'react-apollo'
// import { GetSignUpInputsQuery, GetLoginInputsQuery } from '../../data/graphql-types'

// interface IInputElProps {
//   type?: string
//   keyName: string
//   qryRes: QueryResult
//   value: string
//   placeholder: string
// }

// const handleInputChange = (
//   e: React.SyntheticEvent<HTMLInputElement>,
//   childKey: string,
//   qryRes: QueryResult<GetSignUpInputsQuery & GetLoginInputsQuery>
// ) => {
//   if (qryRes.data && qryRes.data.forms) {
//     const newData: GetSignUpInputsQuery | {} = {
//       ...qryRes.data,
//       forms: {
//         ...qryRes.data.forms,
//         [childKey]: e.currentTarget.value
//       }
//     }
//     qryRes.client.writeData({ data: newData })
//   }
// }

// const InputEl: React.SFC<IInputElProps> = props => {
//   return (
//     <>
//       <input
//         type={props.type || 'text'}
//         value={props.value}
//         onChange={e => handleInputChange(e, props.keyName, props.qryRes)}
//         placeholder={props.placeholder}
//       />
//       {props.qryRes.data && props.qryRes.data.forms[props.keyName] ? props.qryRes.data.forms[props.keyName + '_Error'] : ''}
//     </>
//   )
// }

// export default InputEl

// // TODO: add touched
