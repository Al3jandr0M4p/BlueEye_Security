import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './i18n/i18n.ts'
import { Provider } from 'react-redux'
import { store } from './reduxjs/store/store.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
