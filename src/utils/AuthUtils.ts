import { QueryResult } from 'react-apollo'
import { GetLocalStatesQuery } from '../data/graphql-types'

export const updateCacheForm = (qryRes: QueryResult<GetLocalStatesQuery>, propName: string, value: string) => {
  if (qryRes.data && qryRes.data.forms) {
    const newData: GetLocalStatesQuery = {
      ...qryRes.data,
      forms: {
        ...qryRes.data.forms,
        [propName]: value
      }
    }
    qryRes.client.writeData({ data: newData })
  }
}
