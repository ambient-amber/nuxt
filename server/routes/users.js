const express = require('express');
const router = express.Router();
const users = require('../scripts/users');

router.get('/users/get_user/:id', async (req, res) => {
    res.send(await users.getUser(req.params.id));
});
router.post('/users/login/', async (req, res) => {
  res.send(await users.login(req.body));
});

module.exports = router;
