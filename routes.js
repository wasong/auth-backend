import passport from 'passport'

import { signup, signin } from './controllers/auth'
import passportService from './services/passport'

const requireAuth = passport.authenticate('jwt', { session: false })
const requireSignin = passport.authenticate('local', { session: false })

// export routes
const routes = (app) => {
  app.get('/', requireAuth, (req, res) => {
    res.send({ hi: 'there' })
  })
  app.get('/kappa', requireAuth, (req, res) => {
    res.send({ hi: 'kappa' })
  })
  app.post('/signin', requireSignin, signin) // verify user before accessing protected route
  app.post('/signup', signup)
}

export default routes
