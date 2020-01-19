if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  
  let port = process.env.PORT

  if (process.env.NODE_ENV === 'test') {
    port = process.env.TEST_PORT
  }
  
  module.exports = {
    port
  }