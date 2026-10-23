import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Wrapper from './Wrapper.jsx'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')).render(
    <BrowserRouter >
        <Wrapper >
            <App />
            <ToastContainer />
        </Wrapper>
    </BrowserRouter>
    
)
