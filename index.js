import express from 'express';
import { routerUser } from './routes/usersRoutes.js';
import { routerReport } from './routes/reportRoutes.js';
import { router as importRouter } from './routes/importRoutes.js';
import passport from 'passport';
import session from 'express-session';
import { isAuthenticated } from './middleware/authMiddleware.js';
import path from 'path';
import { fileURLToPath } from 'url';
import{checkPermission} from './middleware/rbacMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");

const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.render("Login.ejs");
});

//protect html
app.get('./pages/:file', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', `${req.params.file}`));
});






app.use(express.static(path.join(__dirname, 'public'), {
  index: false,
  extensions: ['html'],
  setHeaders: (res, path, stat) => {
    if (path.startsWith('public/pages/')) {
      res.setHeader('Cache-Control', 'no-store');
    }
  }
}));

app.use('/users', routerUser);
app.use('/reports', routerReport);
app.use('/users/import', importRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
app.use(express.static('public/samples'))