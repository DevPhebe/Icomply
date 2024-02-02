require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const crypto = require('crypto');

module.exports.signup_get =(req,res) => {
  console.log('signup')
  res.render('signup');
};

// signup user
module.exports.signup_post = async (req, res) => {

  // get firstname, lastname, email, password from request object
  let { firstname, lastname, email, password, role } = req.body;
  
  //   generate salt to the password
  const salt = await bcrypt.genSalt();

  //   hash the password
  password = await bcrypt.hash(password, salt);

  const verification_Token = crypto.randomBytes(32).toString('hex');
  
  //   create a new user in database
  try {
    const user = await User.create({
       firstname,
       lastname,
       email,
       password,
       role,
       verification_Token
    });

    // const transporter = nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: process.env.EMAIL_PORT,
    //   secure: false,
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking on the following link: ${process.env.BASE_URL}/user/verify/${verification_Token}`,
    };
    console.log(mailOptions.text)

    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.log(error);
    //     res.status(500).send('Error sending email');
    //   } else {
    //     console.log(`Email sent: ${info.response}`);
    //     res.status(200).send('Email sent, please check your inbox');
    //   }
    // });

    //   if (user.role === 'user') {
    //     res.render('user/userdashboard', {user})

    //   } else {
    //     res.render('Enforcement Admin/EnforcementAdmindashboard', {user})
    //   }
    // // res.status(201).json(user);
    
  } catch (error) {
    res.status(401).json({ message: "error user not created" });
  }
};

 module.exports.verifyemail = async (req, res) => {
      
  const token = req.params.token;

  const user = await User.findOne({ verification_Token: token });

  if (!user) {
    return res.status(404).send('User not found');
  }

  user.verified = true;
  user.verification_Token = undefined;

  await user.save();

  res.status(200).send('Email verified');
};

module.exports.login_get =(req, res) => {
  res.render('login');
};

// login user
module.exports.login_post = async (req, res) => {
  // get email & password from request object
  const { email, password } = req.body;

  //   find user by email
  try {
    const user = await User.findOne({ email });
    // check if password is correct
    if (user && user.verified) {
      // compare password with hashed password
      const auth = await bcrypt.compare(password, user.password);

      if (auth) {

        if (user.role === 'user') {
          res.render('user/userdashboard', {user})

        } else {
          res.render('Enforcement Admin/EnforcementAdmindashboard', {user})
        }

      } else {
        res.status(400).json({ message: "Invalid login datails" });
      }
    }
  } catch (error) {
    res.status(400).json({ message: "no user with that email or email not verified" });
  }
};

// find a single user
module.exports.get_singleUser = async (req, res) => {
  const _id = req.params.id;

  const user = await User.findById(_id);
  if (user) {
    return res.status(201).json(user);
  } else {
    res.status(401).json({ message: "error in getting user" });
  }
};

//  Delete user
module.exports.delete_user = (req, res) => {
  const _id = req.params.id;

  User.findByIdAndDelete(_id)
    .then(() => {
      res.status(200).json({ message: "user deleted" });
    })
    .catch(() => {
      res.status(400).json({ message: "error user not deleted" });
    });
};


