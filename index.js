import express from 'express'
import DB from './app/DB.js'

DB.connect();

import Router from './web/route.js'

const app = express();

app.use(express.json());

app.use('/', Router.route);

app.use((err, req, res, next) => res.status(500).send({ message: `${err}` }));

app.listen(8080);