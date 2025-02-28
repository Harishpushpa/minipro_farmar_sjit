import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Registerpage from './component/Registerpage'
import Userlogin from './component/Userlogin'
import Farmer from './dashboard_components/Farmer'
import Middleman from './dashboard_components/Middleman'

const App = () => {
  return (
    <>
      <Router>
        <Routes>
        <Route path="/" element={<Userlogin />} />
        <Route path="/login" element={<Userlogin />} />
        <Route path="/registration" element={<Registerpage />} />
        <Route path="/login/farmer-interface" element={<Farmer/>} />
        <Route path="/login/middleman-interface" element={<Middleman/>} />
          
        </Routes>
      </Router>
    </>
  )
}

export default App
