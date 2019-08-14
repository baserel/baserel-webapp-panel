var express = require('express');
var router = express.Router();
var bsrl = require('../inc/bsrl');
var crypto = require('crypto');
const superagent = require('superagent');

function isEmpty(myObject) {
    for (var key in myObject) {
        if (myObject.hasOwnProperty(key)) {
            return false;
        }
    }

    return true;
}

router.post('/signin', function(req, res) {

    if (req.body.u == null || req.body.p == null || req.body.u == "" || req.body.p == "") {
        res.send({ r: 1, t: req.app.locals.lang[req.session.lang][1] });
    } else {

        var sData = { "_action": "auth_user", "_email": req.body.u, "_pass": req.body.p };
        var aData = sData;

        sData._pass = crypto.createHash('md5').update(sData._pass).digest('hex');

        superagent
            .post('http://localhost:8000/adm')
            .set('accept', 'json')
            .set('Authorization', bsrl.requestDataAuth(aData))
            .send(sData) // sends a JSON post body
            .end((err, res_2) => {

                t = req.app.locals.lang[req.session.lang][0];
                r = 1;

                if (err == null) {

                    rData = JSON.parse(res_2.text);

                    if (rData.result != null) {
                        if (bsrl.invalids.indexOf(rData.result) > -1) {
                            t = req.app.locals.lang[req.session.lang][0];
                        } else {
                            t = bsrl.lang[req.session.lang][rData.result];
                        }
                    } else if (rData.fingerprint != null) {
                        req.session.fingerprint = rData.fingerprint;
                        req.session.email = rData.email;

                        t = "SUC";
                        r = 0;
                    } else {
                        t = req.app.locals.lang[req.session.lang][0];
                    }
                }

                res.send({ r: r, t: t });

            });
    }

});
router.post('/projects/add', function(req, res) {

    if (req.body.name == null) {
        res.send({ r: 1, t: req.app.locals.lang[req.session.lang][1] });
    } else {

        var sData = { "_action": "create_project", "_name": req.body.name, "_email": req.session.email };

        superagent
            .post('http://localhost:8000/adm')
            .set('accept', 'json')
            .set('Authorization', bsrl.requestDataAuth(sData))
            .send(sData) // sends a JSON post body
            .end((err, res_2) => {

                t = req.app.locals.lang[req.session.lang][0];
                r = 1;

                if (err == null) {

                    try {
                        rData = JSON.parse(res_2.text);
                    } catch {

                    }

                    if (rData.result != null) {
                        if (bsrl.invalids.indexOf(rData.result) > -1) {
                            t = req.app.locals.lang[req.session.lang][0];
                        } else {
                            t = bsrl.lang[req.session.lang][rData.result];
                        }
                    } else if (rData.project != null) {
                        t = "SUC";
                        r = 0;
                    } else {
                        t = req.app.locals.lang[req.session.lang][0];
                    }
                }

                res.send({ r: r, t: t });

            });
    }

});
router.post('/projects/edit', function(req, res) {

    if (req.body.code == null) {
        res.send({ r: 1, t: req.app.locals.lang[req.session.lang][1] });
    } else {

        var sData = { "_action": "edit_project", "_project": req.body.code, "_name": req.body.name, "_color": req.body.color, "_security": req.body.security, "_email": req.session.email };

        superagent
            .post('http://localhost:8000/adm')
            .set('accept', 'json')
            .set('Authorization', bsrl.requestDataAuth(sData))
            .send(sData) // sends a JSON post body
            .end((err, res_2) => {

                rData = {};

                t = req.app.locals.lang[req.session.lang][0];
                r = 1;

                if (err == null) {

                    try {
                        rData = JSON.parse(res_2.text);
                    } catch {

                    }

                    if (rData.result != null && rData.result != 'SUC100') {
                        if (bsrl.invalids.indexOf(rData.result) > -1) {
                            t = req.app.locals.lang[req.session.lang][0];
                        } else {
                            t = bsrl.lang[req.session.lang][rData.result];
                        }
                    } else if (rData.result == 'SUC100') {
                        t = "SUC";
                        r = 0;
                    } else {
                        t = req.app.locals.lang[req.session.lang][0];
                    }
                }

                res.send({ r: r, t: t });

            });
    }

});
router.post('/projects/delete', function(req, res) {

    if (req.body.code == null) {
        res.send({ r: 1, t: req.app.locals.lang[req.session.lang][1] });
    } else {

        var sData = { "_action": "delete_project", "_project": req.body.code, "_email": req.session.email };

        superagent
            .post('http://localhost:8000/adm')
            .set('accept', 'json')
            .set('Authorization', bsrl.requestDataAuth(sData))
            .send(sData) // sends a JSON post body
            .end((err, res_2) => {

                rData = {};

                t = req.app.locals.lang[req.session.lang][0];
                r = 1;

                if (err == null) {

                    try {
                        rData = JSON.parse(res_2.text);
                    } catch {

                    }

                    if (rData.result != null && rData.result != 'SUC100') {
                        if (bsrl.invalids.indexOf(rData.result) > -1) {
                            t = req.app.locals.lang[req.session.lang][0];
                        } else {
                            t = bsrl.lang[req.session.lang][rData.result];
                        }
                    } else if (rData.result == 'SUC100') {

                        t = "SUC";
                        r = 0;

                        if (req.cookies.recentProjects != undefined) {
                            recentProjects = req.cookies.recentProjects;
                            if (recentProjects.indexOf(req.body.code) > -1) {
                                delete recentProjects.splice(recentProjects.indexOf(req.body.code), 1);
                            }
                            res.cookie('recentProjects', recentProjects);
                        }

                    } else {
                        t = req.app.locals.lang[req.session.lang][0];
                    }
                }

                res.send({ r: r, t: t });

            });
    }

});
router.post('/tables/add', function(req, res) {

    if (req.body.name == null) {
        res.send({ r: 1, t: req.app.locals.lang[req.session.lang][1] });
    } else {

        var sData = { "_action": "create_table", "_name": req.body.name, "_email": req.session.email, "_project": req.body.project };

        superagent
            .post('http://localhost:8000/adm')
            .set('accept', 'json')
            .set('Authorization', bsrl.requestDataAuth(sData))
            .send(sData) // sends a JSON post body
            .end((err, res_2) => {

                t = req.app.locals.lang[req.session.lang][0];
                r = 1;

                if (err == null) {

                    try {
                        rData = JSON.parse(res_2.text);
                    } catch {

                    }

                    if (rData.result != null) {
                        if (bsrl.invalids.indexOf(rData.result) > -1) {
                            t = req.app.locals.lang[req.session.lang][0];
                        } else {
                            t = bsrl.lang[req.session.lang][rData.result];
                        }
                    } else if (rData.table != null) {
                        t = "SUC";
                        r = 0;
                    } else {
                        t = req.app.locals.lang[req.session.lang][0];
                    }
                }

                res.send({ r: r, t: t });

            });
    }

});
router.post('/tables/edit', function(req, res) {

    if (req.body.code == null) {
        res.send({ r: 1, t: req.app.locals.lang[req.session.lang][1] });
    } else {

        var sData = { "_action": "edit_table", "_table": req.body.code, "_name": req.body.name, "_email": req.session.email, "_project": req.body.project, "_columns_sort": req.body.columns_sort };

        superagent
            .post('http://localhost:8000/adm')
            .set('accept', 'json')
            .set('Authorization', bsrl.requestDataAuth(sData))
            .send(sData) // sends a JSON post body
            .end((err, res_2) => {

                rData = {};

                t = req.app.locals.lang[req.session.lang][0];
                r = 1;

                if (err == null) {

                    try {
                        rData = JSON.parse(res_2.text);
                    } catch {

                    }

                    if (rData.result != null && rData.result != 'SUC100') {
                        if (bsrl.invalids.indexOf(rData.result) > -1) {
                            t = req.app.locals.lang[req.session.lang][0];
                        } else {
                            t = bsrl.lang[req.session.lang][rData.result];
                        }
                    } else if (rData.result == 'SUC100') {
                        t = "SUC";
                        r = 0;
                    } else {
                        t = req.app.locals.lang[req.session.lang][0];
                    }
                }

                res.send({ r: r, t: t });

            });
    }

});
router.post('/tables/delete', function(req, res) {

    if (req.body.code == null) {
        res.send({ r: 1, t: req.app.locals.lang[req.session.lang][1] });
    } else {

        var sData = { "_action": "delete_table", "_table": req.body.code, "_email": req.session.email, "_project": req.body.project };

        superagent
            .post('http://localhost:8000/adm')
            .set('accept', 'json')
            .set('Authorization', bsrl.requestDataAuth(sData))
            .send(sData) // sends a JSON post body
            .end((err, res_2) => {

                rData = {};

                t = req.app.locals.lang[req.session.lang][0];
                r = 1;

                if (err == null) {

                    try {
                        rData = JSON.parse(res_2.text);
                    } catch {

                    }

                    if (rData.result != null && rData.result != 'SUC100') {
                        if (bsrl.invalids.indexOf(rData.result) > -1) {
                            t = req.app.locals.lang[req.session.lang][0];
                        } else {
                            t = bsrl.lang[req.session.lang][rData.result];
                        }
                    } else if (rData.result == 'SUC100') {
                        t = "SUC";
                        r = 0;
                    } else {
                        t = req.app.locals.lang[req.session.lang][0];
                    }
                }

                res.send({ r: r, t: t });

            });
    }

});
router.post('/columns/add', function(req, res) {

    if (req.body['columns[]'] == null) {
        res.send({ r: 1, t: req.app.locals.lang[req.session.lang][1] });
    } else {
        var t;
        var r;

        const columns = req.body['columns[]'].constructor === Array ? req.body['columns[]'].join(',') : req.body['columns[]'];

        var requestObj = { "_action": "add_table_columns", "_email": req.session.email, "_project": req.body.project, "_table": req.body.table, "_columns": columns };

        superagent
            .post('http://localhost:8000/adm')
            .set('accept', 'json')
            .set('Authorization', bsrl.requestDataAuth(requestObj))
            .send(requestObj) // sends a JSON post body
            .end((err, res_2) => {

                t = req.app.locals.lang[req.session.lang][0];
                r = 1;

                if (err == null) {

                    try {
                        rData = JSON.parse(res_2.text);
                    } catch {

                    }

                    console.log(rData);

                    if (rData.result != null && rData.result != 'SUC100') {
                        if (bsrl.invalids.indexOf(rData.result) > -1) {
                            t = req.app.locals.lang[req.session.lang][0];
                        } else {
                            t = bsrl.lang[req.session.lang][rData.result];
                        }
                    } else if (rData.result == 'SUC100') {
                        t = "SUC";
                        r = 0;
                    } else {
                        t = req.app.locals.lang[req.session.lang][0];
                    }
                }

                res.send({ r: r, t: t });

            });

    }

});

router.post('/columns/edit', function(req, res) {

    if (req.body.column == null) {
        res.send({ r: 1, t: req.app.locals.lang[req.session.lang][1] });
    } else {

        var requestObj = { "_action": "edit_table_column", "_email": req.session.email, "_project": req.body.project, "_table": req.body.table, "_column": req.body.column, "_alias": req.body.alias, "_new_column": req.body.new_column };

        superagent
            .post('http://localhost:8000/adm')
            .set('accept', 'json')
            .set('Authorization', bsrl.requestDataAuth(requestObj))
            .send(requestObj) // sends a JSON post body
            .end((err, res_2) => {

                var t = req.app.locals.lang[req.session.lang][0];
                var r = 1;

                if (err == null) {

                    try {
                        rData = JSON.parse(res_2.text);
                    } catch {

                    }

                    if (rData.result != null && rData.result != 'SUC100') {
                        if (bsrl.invalids.indexOf(rData.result) > -1) {
                            t = req.app.locals.lang[req.session.lang][0];
                        } else {
                            t = bsrl.lang[req.session.lang][rData.result];
                        }
                    } else if (rData.result == 'SUC100') {
                        t = "SUC";
                        r = 0;
                    } else {
                        t = req.app.locals.lang[req.session.lang][0];
                    }
                }

                res.send({ r: r, t: t });

            });
    }

});
router.post('/columns/delete', function(req, res) {

    if (req.body.column == null) {
        res.send({ r: 1, t: req.app.locals.lang[req.session.lang][1] });
    } else {

        var requestObj = { "_action": "delete_table_column", "_email": req.session.email, "_project": req.body.project, "_table": req.body.table, "_column": req.body.column };

        superagent
            .post('http://localhost:8000/adm')
            .set('accept', 'json')
            .set('Authorization', bsrl.requestDataAuth(requestObj))
            .send(requestObj) // sends a JSON post body
            .end((err, res_2) => {

                var t = req.app.locals.lang[req.session.lang][0];
                var r = 1;

                if (err == null) {

                    try {
                        rData = JSON.parse(res_2.text);
                    } catch {

                    }

                    if (rData.result != null && rData.result != 'SUC100') {
                        if (bsrl.invalids.indexOf(rData.result) > -1) {
                            t = req.app.locals.lang[req.session.lang][0];
                        } else {
                            t = bsrl.lang[req.session.lang][rData.result];
                        }
                    } else if (rData.result == 'SUC100') {
                        t = "SUC";
                        r = 0;
                    } else {
                        t = req.app.locals.lang[req.session.lang][0];
                    }
                }

                res.send({ r: r, t: t });

            });
    }

});
router.post('/records/add/:projectCode/:tableCode', function(req, res) {

    if (req.body == {}) {
        res.send({ r: 1, t: req.app.locals.lang[req.session.lang][1] });
    } else {

        var requestObj = req.body;

        superagent
            .post('http://localhost:8000/put/' + req.params.projectCode + "/" + req.params.tableCode)
            .set('accept', 'json')
            .set('Authorization', req.session.fingerprint)
            .send(requestObj) // sends a JSON post body
            .end((err, res_2) => {

                var t = req.app.locals.lang[req.session.lang][0];
                var r = 1;

                if (err == null) {

                    try {
                        rData = JSON.parse(res_2.text);
                    } catch {

                    }

                    if (rData.result != null && rData.result != 'SUC100') {
                        if (bsrl.invalids.indexOf(rData.result) > -1) {
                            t = req.app.locals.lang[req.session.lang][0];
                        } else if (bsrl.lang[req.session.lang][rData.result] != undefined) {
                            t = bsrl.lang[req.session.lang][rData.result];
                        }
                    } else if (rData.result == 'SUC100') {
                        t = "SUC";
                        r = 0;
                    } else {
                        t = req.app.locals.lang[req.session.lang][0];
                    }
                }

                res.send({ r: r, t: t });

            });
    }

});
router.post('/records/edit/:projectCode/:tableCode', function(req, res) {

    if (req.body == {}) {
        res.send({ r: 1, t: req.app.locals.lang[req.session.lang][1] });
    } else {

        var requestObj = req.body;

        superagent
            .post('http://localhost:8000/put/' + req.params.projectCode + "/" + req.params.tableCode)
            .set('accept', 'json')
            .set('Authorization', req.session.fingerprint)
            .send(requestObj) // sends a JSON post body
            .end((err, res_2) => {

                var t = req.app.locals.lang[req.session.lang][0];
                var r = 1;

                if (err == null) {

                    try {
                        rData = JSON.parse(res_2.text);
                    } catch {

                    }

                    if (rData.result != null && rData.result != 'SUC100') {
                        if (bsrl.invalids.indexOf(rData.result) > -1) {
                            t = req.app.locals.lang[req.session.lang][0];
                        } else if (bsrl.lang[req.session.lang][rData.result] != undefined) {
                            t = bsrl.lang[req.session.lang][rData.result];
                        }
                    } else if (rData.result == 'SUC100') {
                        t = "SUC";
                        r = 0;
                    } else {
                        t = req.app.locals.lang[req.session.lang][0];
                    }
                }

                res.send({ r: r, t: t });

            });
    }

});
router.post('/records/delete/:projectCode/:tableCode', function(req, res) {

    if (req.body["_where"] == null) {
        res.send({ r: 1, t: req.app.locals.lang[req.session.lang][1] });
    } else {

        var requestObj = req.body;

        superagent
            .post('http://localhost:8000/del/' + req.params.projectCode + "/" + req.params.tableCode)
            .set('accept', 'json')
            .set('Authorization', req.session.fingerprint)
            .send(requestObj) // sends a JSON post body
            .end((err, res_2) => {

                var t = req.app.locals.lang[req.session.lang][0];
                var r = 1;

                if (err == null) {

                    try {
                        rData = JSON.parse(res_2.text);
                    } catch {

                    }

                    if (rData.result != null && rData.result != 'SUC100') {
                        if (bsrl.invalids.indexOf(rData.result) > -1) {
                            t = req.app.locals.lang[req.session.lang][0];
                        } else if (bsrl.lang[req.session.lang][rData.result] != undefined) {
                            t = bsrl.lang[req.session.lang][rData.result];
                        }
                    } else if (rData.result == 'SUC100') {
                        t = "SUC";
                        r = 0;
                    } else {
                        t = req.app.locals.lang[req.session.lang][0];
                    }
                }

                res.send({ r: r, t: t });

            });
    }

});

router.post('/users/add', function(req, res) {

    if (req.body.email == null) {
        res.send({ r: 1, t: req.app.locals.lang[req.session.lang][1] });
    } else {

        var sData = { "_action": "create_user", "_name": req.body.name, "_email": req.body.email, "_pass": req.body.pass, "_enabled": req.body.enabled, "_super": req.body.super };

        superagent
            .post('http://localhost:8000/adm')
            .set('accept', 'json')
            .set('Authorization', bsrl.requestDataAuth(sData))
            .send(sData) // sends a JSON post body
            .end((err, res_2) => {

                t = req.app.locals.lang[req.session.lang][0];
                r = 1;

                if (err == null) {

                    try {
                        rData = JSON.parse(res_2.text);
                    } catch {

                    }

                    if (rData.result != null) {
                        if (bsrl.invalids.indexOf(rData.result) > -1) {
                            t = req.app.locals.lang[req.session.lang][0];
                        } else {
                            t = bsrl.lang[req.session.lang][rData.result];
                        }
                    } else if (rData.table != null) {
                        t = "SUC";
                        r = 0;
                    } else {
                        t = req.app.locals.lang[req.session.lang][0];
                    }
                }

                res.send({ r: r, t: t });

            });
    }

});
router.post('/users/edit', function(req, res) {

    if (req.body.code == null) {
        res.send({ r: 1, t: req.app.locals.lang[req.session.lang][1] });
    } else {

        var sData = { "_action": "edit_table", "_table": req.body.code, "_name": req.body.name, "_email": req.session.email, "_project": req.body.project, "_columns_sort": req.body.columns_sort };

        superagent
            .post('http://localhost:8000/adm')
            .set('accept', 'json')
            .set('Authorization', bsrl.requestDataAuth(sData))
            .send(sData) // sends a JSON post body
            .end((err, res_2) => {

                rData = {};

                t = req.app.locals.lang[req.session.lang][0];
                r = 1;

                if (err == null) {

                    try {
                        rData = JSON.parse(res_2.text);
                    } catch {

                    }

                    if (rData.result != null && rData.result != 'SUC100') {
                        if (bsrl.invalids.indexOf(rData.result) > -1) {
                            t = req.app.locals.lang[req.session.lang][0];
                        } else {
                            t = bsrl.lang[req.session.lang][rData.result];
                        }
                    } else if (rData.result == 'SUC100') {
                        t = "SUC";
                        r = 0;
                    } else {
                        t = req.app.locals.lang[req.session.lang][0];
                    }
                }

                res.send({ r: r, t: t });

            });
    }

});
router.post('/users/delete', function(req, res) {

    if (req.body.code == null) {
        res.send({ r: 1, t: req.app.locals.lang[req.session.lang][1] });
    } else {

        var sData = { "_action": "delete_table", "_table": req.body.code, "_email": req.session.email, "_project": req.body.project };

        superagent
            .post('http://localhost:8000/adm')
            .set('accept', 'json')
            .set('Authorization', bsrl.requestDataAuth(sData))
            .send(sData) // sends a JSON post body
            .end((err, res_2) => {

                rData = {};

                t = req.app.locals.lang[req.session.lang][0];
                r = 1;

                if (err == null) {

                    try {
                        rData = JSON.parse(res_2.text);
                    } catch {

                    }

                    if (rData.result != null && rData.result != 'SUC100') {
                        if (bsrl.invalids.indexOf(rData.result) > -1) {
                            t = req.app.locals.lang[req.session.lang][0];
                        } else {
                            t = bsrl.lang[req.session.lang][rData.result];
                        }
                    } else if (rData.result == 'SUC100') {
                        t = "SUC";
                        r = 0;
                    } else {
                        t = req.app.locals.lang[req.session.lang][0];
                    }
                }

                res.send({ r: r, t: t });

            });
    }

});

router.post('/console/tables/:projectCode', function(req, res, next) {

    if (req.session.fingerprint == null) {
        res.status(403).send("Something went wrong.");
    } else {

        var recentProjects = new Array();

        if (req.cookies.recentProjects != undefined) {
            recentProjects = req.cookies.recentProjects;
        }

        if (recentProjects.indexOf(req.params.projectCode) > -1) {
            recentProjects.splice(recentProjects.indexOf(req.params.projectCode), 1);
        }

        recentProjects.unshift(req.params.projectCode);

        res.cookie('recentProjects', recentProjects);

        var rData = {};
        var sData = { "_action": "get_project", "_email": req.session.email, "_project": req.params.projectCode };
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

                if (err == null) {

                    try {
                        rData = JSON.parse(res_2.text);
                        rData.code = req.params.projectCode;
                    } catch {

                    }

                    if (rData.result != null) {
                        res.status(403).send("Something went wrong.");
                    } else if (isEmpty(rData)) {
                        res.status(404).send("Something went wrong.");
                    } else {

                        rData2 = {};
                        sData2 = { "_action": "get_tables", "_email": req.session.email, "_project": req.params.projectCode };

                        superagent
                            .post('http://localhost:8000/adm')
                            .set('accept', 'json')
                            .set('Authorization', bsrl.requestDataAuth(sData2))
                            .send(sData2) // sends a JSON post body
                            .end((err_3, res_3) => {

                                try {
                                    rData2 = JSON.parse(res_3.text);
                                } catch {

                                }

                                if (rData2.result != null) {
                                    res.status(404).send("Something went wrong.");
                                } else {
                                    res.send(rData2);
                                }
                            });
                    }
                }

            });
    }
});

router.post('/console/request', function(req, res, next) {

    if (req.session.fingerprint == null || req.body.request_address == null || req.body.request_body == null) {
        res.status(403).send("Something went wrong.");
    } else {

        rData3 = {};

        superagent
            .post(req.body.request_address.replace("locNaN.undefined.undefined", "localhost:8000"))
            .set('accept', 'json')
            .set('Authorization', req.session.fingerprint)
            .send(req.body.request_body) // sends a JSON post body
            .end((err_3, res_3) => {

                res.send(res_3.text);

            });

    }

});

router.post('/scripts/add', function(req, res) {

    if (req.body.name == null) {
        res.send({ r: 1, t: req.app.locals.lang[req.session.lang][1] });
    } else {

        var sData = { "_action": "create_script", "_name": req.body.name, "_email": req.session.email, "_project": req.body.project };

        superagent
            .post('http://localhost:8000/adm')
            .set('accept', 'json')
            .set('Authorization', bsrl.requestDataAuth(sData))
            .send(sData) // sends a JSON post body
            .end((err, res_2) => {

                t = req.app.locals.lang[req.session.lang][0];
                r = 1;

                if (err == null) {

                    try {
                        rData = JSON.parse(res_2.text);
                    } catch {

                    }

                    if (rData.result != null) {
                        if (bsrl.invalids.indexOf(rData.result) > -1) {
                            t = req.app.locals.lang[req.session.lang][0];
                        } else {
                            t = bsrl.lang[req.session.lang][rData.result];
                        }
                    } else if (rData.script != null) {
                        t = "SUC";
                        r = 0;
                        req.session.scripts_script = rData.script;
                        req.session.scripts_project = req.body.project;
                    } else {
                        t = req.app.locals.lang[req.session.lang][0];
                    }
                }

                res.send({ r: r, t: t });

            });
    }

});

router.post('/scripts/edit', function(req, res) {

    if (req.body.code == null) {
        res.send({ r: 1, t: req.app.locals.lang[req.session.lang][1] });
    } else {

        var sData = { "_action": "edit_script", "_script": req.body.code, "_name": req.body.name, "_script_str": req.session.script, "_project": req.body.project };

        superagent
            .post('http://localhost:8000/adm')
            .set('accept', 'json')
            .set('Authorization', bsrl.requestDataAuth(sData))
            .send(sData) // sends a JSON post body
            .end((err, res_2) => {

                rData = {};

                t = req.app.locals.lang[req.session.lang][0];
                r = 1;

                if (err == null) {

                    try {
                        rData = JSON.parse(res_2.text);
                    } catch {

                    }

                    if (rData.result != null && rData.result != 'SUC100') {
                        if (bsrl.invalids.indexOf(rData.result) > -1) {
                            t = req.app.locals.lang[req.session.lang][0];
                        } else {
                            t = bsrl.lang[req.session.lang][rData.result];
                        }
                    } else if (rData.result == 'SUC100') {
                        t = "SUC";
                        r = 0;
                        req.session.scripts_script = req.body.code;
                        req.session.scripts_project = req.body.project;
                    } else {
                        t = req.app.locals.lang[req.session.lang][0];
                    }
                }

                res.send({ r: r, t: t });

            });
    }

});

router.post('/scripts/delete', function(req, res) {

    if (req.body.code == null) {
        res.send({ r: 1, t: req.app.locals.lang[req.session.lang][1] });
    } else {

        var sData = { "_action": "delete_script", "_script": req.body.code, "_email": req.session.email, "_project": req.body.project };

        superagent
            .post('http://localhost:8000/adm')
            .set('accept', 'json')
            .set('Authorization', bsrl.requestDataAuth(sData))
            .send(sData) // sends a JSON post body
            .end((err, res_2) => {

                rData = {};

                t = req.app.locals.lang[req.session.lang][0];
                r = 1;

                if (err == null) {

                    try {
                        rData = JSON.parse(res_2.text);
                    } catch {

                    }

                    if (rData.result != null && rData.result != 'SUC100') {
                        if (bsrl.invalids.indexOf(rData.result) > -1) {
                            t = req.app.locals.lang[req.session.lang][0];
                        } else {
                            t = bsrl.lang[req.session.lang][rData.result];
                        }
                    } else if (rData.result == 'SUC100') {
                        t = "SUC";
                        r = 0;
                    } else {
                        t = req.app.locals.lang[req.session.lang][0];
                    }
                }

                res.send({ r: r, t: t });

            });
    }

});

router.post('/scripts/get/:projectCode', function(req, res) {

    if (req.params.projectCode == null) {
        res.status(403).send("Something went wrong.");
    } else {

        var sData = { "_action": "get_scripts", "_email": req.session.email, "_project": req.params.projectCode };

        superagent
            .post('http://localhost:8000/adm')
            .set('accept', 'json')
            .set('Authorization', bsrl.requestDataAuth(sData))
            .send(sData) // sends a JSON post body
            .end((err, res_2) => {

                rData = {};

                if (err == null) {

                    try {
                        rData = JSON.parse(res_2.text);
                    } catch {

                    }

                    if (rData.result != null) {
                        res.status(403).send("Something went wrong.");
                    } else {
                        res.send(rData);
                    }
                }

            });
    }

});

router.post('/scripts/set/:projectCode/:scriptCode', function(req, res) {

    if (req.params.scriptCode == null) {
        res.status(403).send("Something went wrong.");
    } else {

        var sData = { "_action": "get_script", "_email": req.session.email, "_script": req.params.scriptCode, "_project": req.params.projectCode };

        superagent
            .post('http://localhost:8000/adm')
            .set('accept', 'json')
            .set('Authorization', bsrl.requestDataAuth(sData))
            .send(sData) // sends a JSON post body
            .end((err, res_2) => {

                rData = {};

                if (err == null) {

                    try {
                        rData = JSON.parse(res_2.text);
                    } catch {

                    }

                    if (rData.result != null) {
                        res.status(403).send("Something went wrong.");
                    } else {
                        req.session.scripts_script = req.params.scriptCode;
                        req.session.scripts_project = req.params.projectCode;
                        res.send({ r: 1 });
                    }
                }

            });
    }

});

router.post('/scripts/save/:projectCode/:scriptCode', function(req, res) {

    if (req.body.script == null || req.params.projectCode == null || req.params.scriptCode == null) {
        res.status(403).send("Something went wrong.");
    } else {

        var sData = { "_action": "edit_script", "_email": req.session.email, "_script": req.params.scriptCode, "_script_str": req.body.script, "_script_request": req.body.request, "_project": req.params.projectCode };

        superagent
            .post('http://localhost:8000/adm')
            .set('accept', 'json')
            .set('Authorization', bsrl.requestDataAuth(sData))
            .send(sData) // sends a JSON post body
            .end((err, res_2) => {

                rData = {};

                if (err == null) {

                    try {
                        rData = JSON.parse(res_2.text);
                    } catch {

                    }

                    if (rData.result == null) {
                        res.status(403).send("Something went wrong.");
                    } else if (rData.result == "SUC100") {
                        res.send({ r: 1 });
                    } else {
                        res.status(403).send("Something went wrong.");
                    }
                }

            });
    }

});

router.post('/scripts/delete/:projectCode/:scriptCode', function(req, res) {

    if (req.params.projectCode == null || req.params.scriptCode == null) {
        res.status(403).send("Something went wrong.");
    } else {

        var sData = { "_action": "delete_script", "_email": req.session.email, "_script": req.params.scriptCode, "_project": req.params.projectCode };

        superagent
            .post('http://localhost:8000/adm')
            .set('accept', 'json')
            .set('Authorization', bsrl.requestDataAuth(sData))
            .send(sData) // sends a JSON post body
            .end((err, res_2) => {

                rData = {};

                if (err == null) {

                    try {
                        rData = JSON.parse(res_2.text);
                    } catch {

                    }

                    if (rData.result == null) {
                        res.status(403).send("Something went wrong.");
                    } else if (rData.result == "SUC100") {
                        req.session.scripts_script = null;
                        req.session.scripts_project = null;
                        res.send({ r: 1 });
                    } else {
                        res.status(403).send("Something went wrong.");
                    }
                }

            });
    }

});
router.post('/scripts/run/:projectCode/:scriptCode', function(req, res) {

    if (req.params.projectCode == null || req.params.scriptCode == null) {
        res.status(403).send("Something went wrong.");
    } else {

        superagent
            .post('http://localhost:8000/cmd/' + req.params.projectCode + '/' + req.params.scriptCode)
            .set('accept', 'json')
            .set('Authorization', req.session.fingerprint)
            .send(req.body) // sends a JSON post body
            .end((err, res_2) => {

                rData = {};

                if (err == null) {

                    if (rData.result != null) {
                        res.status(403).send("Something went wrong.");
                    } else {
                        res.send(res_2.text);
                    }
                } else {
                    console.log(err);
                    res.status(500).send("Something went wrong.");
                }

            });
    }

});


module.exports = router;