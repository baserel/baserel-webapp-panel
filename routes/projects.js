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

            res.render('projects', { lang: req.app.locals.lang[req.session.lang], e:e, t:t, projects:projects, query: req.query });

        });
    }
});
router.get('/:projectCode', function(req, res, next) {
    if(req.session.fingerprint == null){
        res.redirect('/signin');
    }else{

        var recentProjects = new Array();

        if(req.cookies.recentProjects != undefined){
            recentProjects = req.cookies.recentProjects;
        }

        if(recentProjects.indexOf(req.params.projectCode) > -1){
            recentProjects.splice(recentProjects.indexOf(req.params.projectCode), 1);
        }

        recentProjects.unshift(req.params.projectCode);

        res.cookie('recentProjects', recentProjects);

        var rData = {};
        var sData = {"_action":"get_project", "_email":req.session.email, "_project":req.params.projectCode};
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
                    .send(sData2) // sends a JSON post body
                    .set('accept', 'json')
                    .set('Authorization', bsrl.requestDataAuth(sData2))
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
router.get('/:projectCode/:tableCode', function(req, res, next) {
    if(req.session.fingerprint == null){
        res.redirect('/signin');
    }else{

        var rData = {};
        var sData = {"_action":"get_project", "_email":req.session.email, "_project":req.params.projectCode};
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
                    sData2 = {"_action":"get_table", "_email":req.session.email, "_project":req.params.projectCode, "_table":req.params.tableCode};

                    superagent
                    .post('http://localhost:8000/adm')
                    .send(sData2) // sends a JSON post body
                    .set('accept', 'json')
                    .set('Authorization', bsrl.requestDataAuth(sData2))
                    .end((err_3, res_3) => {

                        try{
                            rData2 = JSON.parse(res_3.text);
                        }catch{
            
                        }

                        rData2.code = req.params.tableCode;

                        if(rData2.result != null){
                            res.render("404");
                        }else{

                            rData3 = {};

                            superagent
                            .post('http://localhost:8000/get/'+req.params.projectCode+'/'+req.params.tableCode)
                            .set('accept', 'json')
                            .set('Authorization', req.session.fingerprint)
                            .send({}) // sends a JSON post body
                            .end((err_3, res_3) => {

                                try{
                                    rData3 = JSON.parse(res_3.text);
                                }catch{
                    
                                }

                                console.log(req.session.fingerprint);
                                console.log(rData3.result);

                                if(rData3.result != null){
                                    res.render("404");
                                }else{
                                    rData4 = {};
                                    sData4 = {"_action":"get_table_columns", "_email":req.session.email, "_project":req.params.projectCode, "_table":req.params.tableCode};

                                    superagent
                                    .post('http://localhost:8000/adm')
                                    .send(sData4) // sends a JSON post body
                                    .set('accept', 'json')
                                    .set('Authorization', bsrl.requestDataAuth(sData4))
                                    .end((err_4, res_4) => {

                                        try{
                                            rData4 = JSON.parse(res_4.text);
                                        }catch{
                            
                                        }

                                        if(rData4.result != null){
                                            res.render("404");
                                        }else{

                                            rData2.temp_columns_sort = (rData2.columns_sort == "") ? [] : rData2.columns_sort.split(",");
                                            rData2.columns = (rData2.columns == "") ? [] : rData2.columns.split(",");

                                            rData2.temp_columns_sort.forEach(function (entry) {
                                                if(rData2.columns.indexOf(entry) < 0 || entry == ""){
                                                    
                                                    delete rData2.temp_columns_sort[rData2.temp_columns_sort.indexOf(entry)];
                                                }
                                            });

                                            for (const c in rData4) {
                                                if (rData4.hasOwnProperty(c)) {

                                                    const element = rData4[c];

                                                    if(rData2.temp_columns_sort.indexOf(element.key) < 0){
                                                        rData2.temp_columns_sort.push(element.key);
                                                    }
                                                }
                                            }

                                            rData2.columns_sort = rData2.temp_columns_sort.filter(function () { return true });
                                            delete rData2.temp_columns_sort;

                                            res.render('records', { lang: req.app.locals.lang[req.session.lang], project:rData, table: rData2, records: rData3, columns: rData4, instance: req.session.instance, query: req.query });
                                            console.log(rData2.columns);
                                            console.log(rData2.columns_sort);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }

        });
    }
});

module.exports = router;