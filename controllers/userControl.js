import { getUsers, getUser, getUserByEmail, getCoursecodes, saveResetToken, updatePassword, getUserByResetToken, deleteResetToken } from '../models/database.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';


export const user_list = (async (req,res)=> {
    const users = await getUsers()
    res.send(users)
  })

export const user_by_id = (async (req,res)=> {
  const user = await getUser(1)
  res.send(user)
})

export const user_by_email = (async (req,res)=> {
  const email = req.body.email
  const password = req.body.password
  const user = await getUserByEmail(email)
  console.log(user)
  if(user.length > 0)
  {
    const isPassWordValid = bcrypt.compareSync(password, user[0].password)
    if (isPassWordValid == true)
      {
        res.redirect('/users/getRecords')
      }
    else 
    res.send("<h1>Password not found</h1>")
  }
    else
    res.send("<h1>User not found</h1>")
})

export const get_course_codes = (async (req,res)=> {
  const courseCodes = await getCoursecodes()
  res.render("Records.ejs", {courseCodes})
})

export const reset_password = (async (req, res) => {
  const email = req.body.email
  const resetToken = crypto.randomBytes(20).toString('hex')
  const hash = await bcrypt.hash(resetToken, 10)

  await saveResetToken(email, hash)

  const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD
      }
  })

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Reset Requested',
    html: `<p>Hi ${email}, you have requested a password reset</p><p>Click <a href="http://localhost:8080/users/set-new-password?token=${resetToken}&email=${email}">here</a> to reset your password</p>`
  };

  await transporter.sendMail(mailOptions)

  res.status(200).send('Reset password link sent to your email address.')
})

export const set_new_password = (async (req, res) => {
  const token = req.body.token;
  console.log('Received Token:', token);
  const email = req.body.email;
  const newPassword = req.body.newPassword;
  console.log('token:', token);
  console.log('email:', email);
  console.log('newPassword:', newPassword);

  try {
    const user = await getUserByResetToken(token);
    console.log('User:', user);

    if (user) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await updatePassword(email, hashedPassword);
      console.log(hashedPassword);
      await deleteResetToken(email);
      res.status(200).json({ message: 'Password reset successful' });
    } else {
      res.status(400).json({ message: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

