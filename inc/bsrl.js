var exports = module.exports = {};

exports.requestDataAuth = function(postData){
    
    // var sa = require('superagent');
    var crypto = require('crypto');

    var auth = "ntiqfki5h28HaVd2eycytwHZn4ooQmRmsU4tQx2y3g7aZCoE8CFbvEWT2omjDjj4";

    eData = {};
    rData = {};
    eAuth = "";

    Object.keys(postData).sort().forEach(function(key) {
        eData[key] = postData[key];
        eAuth += eData[key];
    });

    eAuth += auth;
    eData._auth = crypto.createHash('md5').update(eAuth).digest('hex');

    return eData._auth;
    
}

exports.rawAuth = function(eAuth){
    var crypto = require('crypto');
    return crypto.createHash('md5').update(eAuth).digest('hex');
}

exports.lang = 
{
    "en":
    {
        "ERR123":"User email already exists.",
        "ERR125":"User email is invalid.",
        "ERR126":"We could not find this email.",
        "ERR137":"Invalid password.",
        "ERR139":"This column key already exists in this table"
    }
}

exports.invalids = 
[
    "ERR100",
    "ERR101",
    "ERR102",
    "ERR103",
    "ERR104",
    "ERR105",
    "ERR106",
    "ERR107",
    "ERR113",
    "ERR114",
    "ERR115",
    "ERR116",
    "ERR117",
    "ERR118",
    "ERR119",
    "ERR120",
    "ERR121",
    "ERR122",
    "ERR123",
    "ERR124",
    "ERR135"
]