var express = require('express');
const superagent = require('superagent');
var crypto = require('crypto');
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

router.get('/', function(req, res, next) {
    if(req.session.fingerprint == null){
        res.redirect('/signin');
    }else{

        var rData = {};
        var sData = {"_action":"get_all_users"};
        var users = {};
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
                    t = "No users found.";
                }else{
                    t = "SUC";
                    e = false;
                    users = rData;
                }
            }

            res.render('users', { lang: req.app.locals.lang[req.session.lang], e:e, t:t, users:users, query: req.query });

        });
    }
});
router.get('/:userEmail', function(req, res, next) {
    if(req.session.fingerprint == null){
        res.redirect('/signin');
    }else{

        var rData = {};
        var sData = {"_action":"get_user", "_email":req.session.email, "_project":req.params.projectCode};
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
                    rData.code = req.params.projectCode;
                }catch{

                }

                if(rData.result != null){
                    res.render("404");
                }else if(isEmpty(rData)){
                    res.render("404");
                }else{

                    rData2 = {};
                    sData2 = {"_action":"get_tables", "_email":req.session.email, "_project":req.params.projectCode};

                    superagent
                    .post('http://localhost:8000/adm')
                    .send(sData) // sends a JSON post body
                    .set('accept', 'json')
                    .set('Authorization', bsrl.requestData(sData2))
                    .end((err_3, res_3) => {

                        try{
                            rData2 = JSON.parse(res_3.text);
                        }catch{
            
                        }

                        if(rData2.result != null){
                            res.render("404");
                        }else{
                            res.render('tables', { lang: req.app.locals.lang[req.session.lang], project:rData, tables: rData2, instance: req.session.instance, query: req.query });
                        }
                    });
                }
            }

        });
    }
});

module.exports = router;