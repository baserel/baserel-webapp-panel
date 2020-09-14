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
        .set('accept', 'json')
        .set('Authorization', bsrl.requestDataAuth(sData))
        .send(sData) // sends a JSON post body
        .end((err, res_2) => {

            t = req.app.locals.lang[req.session.lang][0];
            e = true;

            new_script = true;

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

                    if(req.session.scripts_project != null){

                        new_script = false;

                        rData2 = {};
                        sData2 = {"_action":"get_script", "_email":req.session.email, "_project":req.session.scripts_project, "_script":req.session.scripts_script};

                        superagent
                        .post('http://localhost:8000/adm')
                        .set('accept', 'json')
                        .set('Authorization', bsrl.requestDataAuth(sData2))
                        .send(sData2) // sends a JSON post body
                        .end((err_3, res_3) => {

                            try{
                                rData2 = JSON.parse(res_3.text);
                            }catch{
                
                            }

                            if(rData2.result != null){
                                res.render('scripts', { lang: req.app.locals.lang[req.session.lang], e:e, t:t, projects:projects, query: req.query, fingerprint: req.session.fingerprint, fullscreen: req.session.fullscreen });
                            }else if(rData2.name != null){
                                res.render('scripts', { lang: req.app.locals.lang[req.session.lang], e:e, t:t, projects:projects, query: req.query, fingerprint: req.session.fingerprint, open_project_code:req.session.scripts_project, open_project_name:rData[req.session.scripts_project]["name"], open_script_code:req.session.scripts_script, open_script_name:rData2.name, open_script_str:rData2.script, open_script_request:rData2.request, fullscreen: req.session.fullscreen });
                            }else{
                                res.render('scripts', { lang: req.app.locals.lang[req.session.lang], e:e, t:t, projects:projects, query: req.query, fingerprint: req.session.fingerprint, fullscreen: req.session.fullscreen });
                            }
                        });
                    }
                }
            }

            if(new_script) res.render('scripts', { lang: req.app.locals.lang[req.session.lang], e:e, t:t, projects:projects, query: req.query, fingerprint: req.session.fingerprint });

        });
    }
});

module.exports = router;