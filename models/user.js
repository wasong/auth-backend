// model for user data
import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'

// define model
const userSchema = new mongoose.Schema({
  // define types
  email: { type: String, unique: true, lowercase: true }, // reference to native JS type String
  password: String,
})

// On Save Hook, encrypt password
// Before saving a model, run `pre` function
userSchema.pre('save', function (next) { // 'this' is not accessible with => function
  const user = this // instance of userModel with user email, password
  // generate a salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)
    // hash password with the generated salt
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err)
      // assign hashed password to user password
      user.password = hash
      next() // now save the model
    })
  })
})

// helper for login
// functions in 'methods' is available as an instance
userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => { // this.password has the salt
    if (err) return callback(err)
    callback(null, isMatch)
  }) // this.password is our hashed password
}

// create a model class
const UserClass = mongoose.model('user', userSchema)

// export model
export default UserClass
