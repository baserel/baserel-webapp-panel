var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('signin', { lang: req.app.locals.lang[req.session.lang] });
});

module.exports = router;