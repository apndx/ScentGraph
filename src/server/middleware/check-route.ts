const jwt = require('jsonwebtoken')
import * as express from "express"

export const getTokenFrom = (request: express.Request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7)
    }
    return null
  }


export const authenticateToken = (req: express.Request) => {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token,  process.env.SECRET)
  
    if (!token || !decodedToken.user_id) {
      return null
    }
    return decodedToken
  }  

export const checkUser = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const token = authenticateToken(req)
  
      if (!token) {
        return res.status(401).json({ error: 'token missing or invalid' })
      }
  
      if (token.user_id.toString() !== req.params.id.toString()) {
        return res.status(401).json({ error: 'not authorized user' })
      }
  
      next()
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        res.status(401).json({ error: error.message })
      } else {
        res.status(500).json({ error: error })
      }
    }
  }

export const checkLogin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const token = authenticateToken(req)
  
      if (!token) {
        return res.status(401).json({ error: 'token missing or invalid' })
      }
  
      next()
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        res.status(401).json({ error: error.message })
      } else {
        res.status(500).json({ error: error })
      }
    }
  }

export const checkAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const token = authenticateToken(req)
  
      if (!token) {
        return res.status(401).json({ error: 'token missing or invalid' })
      }
  
      if (token.role !== 'admin') {
        return res.status(401).json({ error: 'not admin' })
      }
  
      next()
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        res.status(401).json({ error: error.message })
      } else {
        res.status(500).json({ error: error })
      }
    }
  }  