import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Button } from 'react-bootstrap'

const NavBar = ({ user, logout }) => {
  const padding = { padding: 10 }

  const navStyle = {
    color: 'grey',
    paddingLeft: 10,
    paddingRight: 10,
  }

  return (
    <Navbar bg= 'dark' variant='dark'>
      <div style={navStyle}>
        <Link style={padding} to="/">Home</Link>
        <Link style={padding} to="/blogs" id='bloglink'>Blogs</Link>
        <Link style={padding} to="/users">Users</Link>
        {user.name} logged in
        <Button  variant="outline-info" onClick={logout}>logout</Button>
      </div>
    </Navbar>
  )
}

export default NavBar
