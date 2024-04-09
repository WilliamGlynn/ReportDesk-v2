import { getUsers, getUser, getUserByEmail, getCoursecodes, saveResetToken, updatePassword, getUserByResetToken, deleteResetToken, createUser, deleteUser } from '../models/database.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import passport from 'passport';
import LocalStrategy from 'passport-local';

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await getUserByEmail(email);
    if (user.length === 0) {
      return done(null, false);
    }
    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      return done(null, false);
    }
    return done(null, user[0]);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.userID);
});

passport.deserializeUser(async (userID, done) => {
  try {
    const user = await getUser(userID);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export const user_list = (async (req, res) => {
  const users = await getUsers();
  res.send(users);
});

export const user_by_id = (async (req, res) => {
  const user = await getUser(1);
  res.send(user);
});

export const user_by_email = (async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send("<h1>Invalid email or password</h1>");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/users/getRecords');
    });
  })(req, res, next);
});

export const get_course_codes = (async (req, res) => {
  const courseCodes = await getCoursecodes();
  res.render("Records.ejs", { courseCodes });
});

export const reset_password = (async (req, res) => {
  const email = req.body.email;
  const resetToken = crypto.randomBytes(20).toString('hex');
  const hash = await bcrypt.hash(resetToken, 10);
  await saveResetToken(email, hash);

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Reset Requested',
    html: `<p>Hi ${email}, you have requested a password reset</p><p>Click <a href="http://localhost:8080/users/set-new-password?token=${resetToken}&email=${email}">here</a> to reset your password</p>`
  };

  await transporter.sendMail(mailOptions);
  res.status(200).send('Reset password link sent to your email address.');
});

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

export const create_user = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(firstName, lastName, email, hashedPassword);
    res.render('Create_user', { message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const delete_user = async (req, res) => {
  const { email } = req.body;

  try {
    await deleteUser(email);

    req.logout((err) => { //log the user out
      if (err) {
        console.error('Error logging out user:', err);
      }
      res.render('Manage_users', { message: 'User deleted successfully' });
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};