var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    
    if(req.session.fingerprint == null){
        res.redirect('/signin');
    }else{
        res.render('docs', { lang: req.app.locals.lang[req.session.lang] });
    }
});

router.get('/introduction', function(req, res, next) {
    
    if(req.session.fingerprint == null){
        res.redirect('/signin');
    }else{
        res.render('docs-introduction', { lang: req.app.locals.lang[req.session.lang] });
    }
});
router.get('/projects-and-tables', function(req, res, next) {
    
    if(req.session.fingerprint == null){
        res.redirect('/signin');
    }else{
        res.render('docs-projects-and-tables', { lang: req.app.locals.lang[req.session.lang] });
    }
});
router.get('/api', function(req, res, next) {
    
    if(req.session.fingerprint == null){
        res.redirect('/signin');
    }else{
        res.render('docs-api', { lang: req.app.locals.lang[req.session.lang] });
    }
});
router.get('/users', function(req, res, next) {
    
    if(req.session.fingerprint == null){
        res.redirect('/signin');
    }else{
        res.render('docs-users', { lang: req.app.locals.lang[req.session.lang] });
    }
});
router.get('/settings', function(req, res, next) {
    
    if(req.session.fingerprint == null){
        res.redirect('/signin');
    }else{
        res.render('docs-settings', { lang: req.app.locals.lang[req.session.lang] });
    }
});

module.exports = router;