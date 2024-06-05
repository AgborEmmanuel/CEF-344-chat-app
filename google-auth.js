const passport=require('passport')
const userSchema=require('../model/user')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    let user=await userSchema.findOne({ googleId: profile.id });
    if(!user){
      user= await userSchema.create({googleId:profile.id,username:profile.displayName,email:profile.emails[0].value,password:"null"})
    }
    return cb(null,user)
  }
));

passport.serializeUser((user,done)=>{
    done(null,user)
})

passport.deserializeUser((user,done)=>{
    done(null,user)
})