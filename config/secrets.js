module.exports = {
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'yodawgitsasecret',
  mandrill: {
    user: process.env.MANDRILL_USER || 'brett.j.andrews@gmail.com',
    password: process.env.MANDRILL_PASSWORD || 'pcimy62aFIxJJlo5D303dQ'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || '845171498857766',
    clientSecret: process.env.FACEBOOK_SECRET || 'd0101025dcc718729e350c2314fb98ea',
    callbackURL: '/auth/facebook',
    passReqToCallback: true
  },
  google: {
    clientID: process.env.GOOGLE_ID || '433628801488-v02jjpd5r9ig0pdacbhpill2asuqtvnf.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'nnRYgpfWnpf5tH2YycUhl9RP',
    callbackURL: '/auth/google',
    passReqToCallback: true
  }
};
