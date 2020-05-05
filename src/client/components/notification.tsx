import * as React from 'react'

const Notification = ({ message }) => {
  console.log('NOTIFICATION', message)
  if (message === '') {
    return null
  }
  return (
    < div className='notification' >
      {message}
    </div >
  )
}

export default Notification
