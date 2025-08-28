import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import store from './store.js'


console.log('state now: ', store.getState());

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)