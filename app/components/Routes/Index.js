import {Route} from 'react-router/es'

export default = (
  <Route
    path="/"
    getComponent={(location, callback) => {
      return import('app/components/Pages/IndexPage.connector.js')
        .then(component => callback(null, component))
    }}
  />
)