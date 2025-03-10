import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css"; // Bootstrap Icons
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./components/authContext.jsx"; // Import the context provider


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <App />
    </AuthProvider>
  </StrictMode>,
)

import "bootstrap-icons/font/bootstrap-icons.css"; // Bootstrap Icons