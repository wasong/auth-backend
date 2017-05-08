import jwt from 'jwt-simple'

import User from '../models/user'
import config from '../../config'

const createUserToken = (user) => {
  const timeStamp = new Date().getTime()
  return jwt.encode({
    sub: user.id, // subject
    iat: timeStamp, // issued at time
  }, config.secret)
}

export const signin = (req, res, next) => {
  // user has already had email/pw auth'd
  // need to return them token
  res.send({ token: createUserToken(req.user) }) // req.user from 'done' in passport authentication
}

// logic to process request
export const signup = (req, res, next) => {
  const { email, password } = req.body

  // TODO: add input validation

  if (!email || !password) return res.status(422).send({ error: 'You must provide an email and password' })

  // check for duplicate email
  User.findOne({ email }, (err, existingUser) => {
    // existingUser null on no email found
    if (err) return next(err)

    // return error on duplicate error
    if (existingUser) {
      return res.status(422).send({
        error: 'Email is in use',
      }) // 422 is unprocessible entity
    }

    // create and save user on unique signup
    const user = new User({
      email,
      password,
    })

    user.save((err) => {
      if (err) return next(err)

      // respond to request with confirmation
      res.json({ token: createUserToken(user) })
    })
  })
}
