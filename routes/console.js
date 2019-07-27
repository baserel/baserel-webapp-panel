var express = require('express');
const superagent = require('superagent');
var bsrl = require('../inc/bsrl');
var router = express.Router();

function isEmpty(myObject) {
    for(var key in myObject) {
        if (myObject.hasOwnProperty(key)) {
            return false;
        }
    }

    return true;
}

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.fingerprint == null){
        res.redirect('/signin');
    }else{

        var rData = {};
        var sData = {"_action":"get_projects", "_email":req.session.email};
        var projects = {};
        var e;
        var t;

        superagent
        .post('http://localhost:8000/adm')
        .send(sData) // sends a JSON post body
        .set('accept', 'json')
        .set('Authorization', bsrl.requestDataAuth(sData))
        .end((err, res_2) => {

            t = req.app.locals.lang[req.session.lang][0];
            e = true;

            if(err == null){

                try{
                    rData = JSON.parse(res_2.text);
                }catch{

                }

                if(rData.result != null){
                    if(bsrl.invalids.indexOf(rData.result) > -1){
                        t = req.app.locals.lang[req.session.lang][0];
                    }else{
                        t = bsrl.lang[req.session.lang][rData.result];
                    }
                }else if(isEmpty(rData)){
                    t = "No projects found.";
                }else{
                    t = "SUC";
                    e = false;
                    projects = rData;
                }
            }

            res.render('console', { lang: req.app.locals.lang[req.session.lang], e:e, t:t, projects:projects, query: req.query, fingerprint: req.session.fingerprint });

        });
    }
});

module.exports = router;