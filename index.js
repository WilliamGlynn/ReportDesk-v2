import express from 'express';
import { routerUser } from './routes/usersRoutes.js';
import { routerReport } from './routes/reportRoutes.js';
import { router as importRouter } from './routes/importRoutes.js';

const app = express();

app.set("view engine", "ejs");

const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render("Login.ejs");
});

app.use(express.static("public"));
app.use('/users', routerUser);
app.use('/reports', routerReport);
app.use('/users/import', importRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});