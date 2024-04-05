import express from 'express';
import passport from 'passport';
import {user_list, user_by_id, user_by_email, get_course_codes, reset_password, set_new_password} from '../controllers/userControl.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';
export const routerUser = express.Router()

routerUser.post('/login', passport.authenticate('local', {
    successRedirect: '/users/getRecords',
    failureRedirect: '/',
}));
  
// this is for authentication




routerUser.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

routerUser.get('/', user_list)
routerUser.get('/getUser', user_by_id)
routerUser.post('/login', user_by_email)
routerUser.get('/getRecords', isAuthenticated, get_course_codes)
routerUser.post('/password-reset', reset_password) //this is the route that will be called when the user clicks the reset password button
routerUser.get('/password-reset', (req, res) => { //takes you to the first page of the password reset process
    res.render('password-reset/page1');
});

routerUser.get('/set-new-password', (req, res) => { //takes you to the second page of the password reset process
    const token = req.query.token; //gets the token from the url
    const email = req.query.email; //gets the email from the url
    res.render('password-reset/page2', { token, email });   //renders the page and passes the token and email to the page
  });
routerUser.post('/set-new-password', set_new_password)//this is the route that will be called when the user submits the new password form
routerUser.get('/password-reset-success', (req, res) => { //takes you to the third page of the password reset process
    res.render('password-reset/page3');
});

routerUser.get('/create-user', isAuthenticated, (req, res) => {
    res.render('Create_user');
  });
  routerUser.get('/manage-user', isAuthenticated, (req, res) => {
    res.render('Manage_users');
  });

  routerUser.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

