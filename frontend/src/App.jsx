import { useState } from 'react'
import { Routes, Route, Link, useParams } from 'react-router-dom';
import Home from './pages/Home'
import Create from './pages/Create'
import Edit from './pages/Edit'
import Delete from './pages/Delete'
import Navbar from './components/Navbar/Navbar';
import './App.css'



function App() {



  return (
    <>
      <Navbar content = {
          <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/delete/:id" element={<Delete />} />
      </Routes>

      }/>
   
    </>
  )
}

export default App