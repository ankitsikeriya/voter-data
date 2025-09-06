import express from 'express'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config();

const jwtMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]
  if (!token) return res.sendStatus(401)

  jwt.verify(token, "hello", (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}
//function to generate jwt token
const generateToken = (user) => {
  return jwt.sign(user,"hello", { expiresIn: '1h' })
}

export { jwtMiddleware, generateToken };