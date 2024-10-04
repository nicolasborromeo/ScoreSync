const router = require('express').Router();
const sessionRouter = require('./session.js')
const usersRouter = require('./users.js')
const usersDisplayInfoRouter = require('./displayinfo.js')
const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser)

router.use('/session', sessionRouter)
router.use('/users', usersRouter)
router.use('/displayinfo', usersDisplayInfoRouter)

router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
  });

module.exports = router;
