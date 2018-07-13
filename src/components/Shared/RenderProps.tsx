// import * as React from 'react'
// // tslint:disable-next-line:no-duplicate-imports
// import { Component, ReactNode } from 'react'
// import { Query, OperationVariables } from 'react-apollo'

// type RenderProps = { children: (data: any) => ReactNode } | { render: (data: any) => ReactNode }
// type IApolloQuery = { query: any } & RenderProps
// type HasRenderProp<T> = T extends { render: (props: any) => ReactNode } ? T : never
// type HasChildrenProp<T> = T extends { children: (props: any) => ReactNode } ? T : never
// type IsFunction<T> = T extends (...args: any[]) => any ? T : never

// const hasRender = <T extends {}>(value: T): value is HasRenderProp<T> => 'render' in value && isFunction((value as HasRenderProp<T>).render)
// const hasChildren = <T extends {}>(value: T): value is HasChildrenProp<T> =>
//   'children' in value && isFunction((value as HasChildrenProp<T>).children)

// const isFunction = <T extends {}>(value: T): value is IsFunction<T> => typeof value === 'function'

// export class ApolloQuery<TData = any, TVariables = OperationVariables> extends Component<IApolloQuery> {
//   public render() {
//     return (
//       <Query<TData, TVariables> query={this.props.query}>
//         {qryRes => {
//           if (qryRes.loading) return 'loading...'
//           if (qryRes.error && !qryRes.data) return `Error!: ${qryRes.error}`
//           if (hasChildren(this.props) && isFunction(this.props.children)) return this.props.children(qryRes.data)
//           if (hasRender(this.props)) return this.props.render(qryRes.data)
//           throw new Error('children is mandatory and needs to be a function!')
//         }}
//       </Query>
//     )
//   }
// }
