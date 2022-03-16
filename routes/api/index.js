const router = require('express').Router();

const userRoutes = require('./user-routes');
const postRoutes = require('./post-routes');

router.use('/Users', userRoutes);
router.use('/Posts', postRoutes);

module.exports = router;