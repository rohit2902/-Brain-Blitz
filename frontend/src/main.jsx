import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/index.css'
import App from './app/App.jsx'
import { store } from './app/app.strore.js'
import {Provider} from "react-redux"
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  
    <Provider store={store}>
      <App />
      <Toaster position="top-right" />
    </Provider>
    
  
)
