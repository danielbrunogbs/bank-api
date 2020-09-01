import express from 'express'

import AccountController from '../app/Controllers/AccountController.js'

const route = express.Router();

route.get('/accounts', AccountController.index);

route.post('/account/deposit', AccountController.deposit);

route.post('/account/withdraw', AccountController.withdraw);

route.delete('/account', AccountController.drop);

route.get('/account/average', AccountController.average);

route.get('/accounts/minimal/:quantity', AccountController.minimal);

route.get('/accounts/max/:quantity', AccountController.max);

route.post('/accounts/transfer', AccountController.transfer);

route.put('/accounts/migrate', AccountController.migrate);

export default { route };