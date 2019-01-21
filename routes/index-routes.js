const router = require('express').Router({ mergeParams: true });

router.get('/', (req, res) => {
  res.render('Home.ejs')
})
module.exports = router;