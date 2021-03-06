const express = require('express')
const path = require('path')
const mysql = require('mysql')

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    password: "", 
    database: "habrcopy"
});

class catController {
    async cattime(req, res) {
        let {category, time} = req.params;


        // getting -week date
        let stringdate = '';
        var date = new Date();

        if (time == 'week') {
            var from = date.setDate(date.getDate() - 7);
        } else {
            var from = date.setDate(date.getDate() - 1);
        }

        stringdate += date.getFullYear();
        let month = date.getMonth() + 1 + '';
        if (month.length == 1) month = '0' + month;
        stringdate += month;
        let day = date.getDate() + '';
        if (day.length == 1) day = '0' + day;
        stringdate += day;
        var intdate = parseInt(stringdate);

        // getting now date
        let nowstringdate = '';  
        let d = new Date();
        nowstringdate += d.getFullYear();
        month = d.getMonth() + 1 + '';
        if (month.length == 1) month = '0' + month;
        nowstringdate += month;
        day = d.getDate() + '';
        if (day.length == 1) day = '0' + day;
        nowstringdate += day;
        var nowdate = parseInt(nowstringdate);

        let nofc = ''; // name of category
        if (category == 'all') nofc = 'Все потоки';
        if (category == 'dev') nofc = 'Разработка';
        if (category == 'admin') nofc = 'Администрирование';
        if (category == 'design') nofc = 'Дизайн';
        if (category == 'marketing') nofc = 'Маркетинг';

        let query = '';
        if (category == 'all')
        {
            query = "SELECT * FROM `articles` WHERE `verified` = 2 AND `createDate` between ? and ?";
            pool.query(query, [intdate, nowdate], (err, rrr) => {
                if(err) return console.log(err);
                //console.log('articles :' + rrr.length)
                rrr.reverse(); // test
                res.render('articleslist.hbs', {
                    name_of_cat: nofc,
                    arc: rrr,
                    catinurl: category,
                    timeinurl: time
                })
            });
        } else {
            query = "SELECT * FROM `articles` WHERE `categoryName` = ? AND `verified` = 2 and `createDate` between ? and ?";
            pool.query(query, [category, intdate, nowdate], (err, rrr) => {
                if(err) return console.log(err);
                rrr.reverse(); // test
                res.render('articleslist.hbs', {
                    name_of_cat: nofc,
                    arc: rrr,
                    catinurl: category,
                    timeinurl: time
                })
            });
        }

    }

    async catpost(req, res) {
        let {postid} = req.params;

        let query = "SELECT * FROM `articles` WHERE `id` = ?";

        pool.query(query, [postid], (err, rrr) => {
            if(err) return console.log(err);

            if (rrr[0] == undefined) return res.send('404');

            let banned = false;
            let verify = false;

            if (rrr[0]['verified'] == 0) banned = true;
            if (rrr[0]['verified'] == 1) verify = false;
            if (rrr[0]['verified'] == 2) verify = true;

            // gettings comments 
            pool.query("SELECT * FROM `comments` WHERE `acticle_id` = ?", [postid], (err, result) => {
                if(err) return console.log(err)
                

                res.render('article.hbs', {
                    author: rrr[0]['author'],
                    time: rrr[0]['createDate'],
                    title: rrr[0]['title'],
                    tags: rrr[0]['tags'],
                    textt: rrr[0]['textFull'],
                    verified: verify,
                    ban: banned,
                    cms: result
                })
            });
            //


        });
    }

    async newcomm(req, res) {
        if(!req.body) return res.status(400);

        let {postid} = req.params;
        let {commtext} = req.body;
        //console.log(req.body)
        //commtext

        if (commtext.length > 1200) return 1; // change later

        let query = "INSERT INTO `comments` (`acticle_id`, `author`, `text`) VALUES (?, ?, ?)";

        pool.query(query, [postid, 'anonimius', commtext], (err, rrr) => {
            if(err) return console.log(err);
            
            res.redirect(req.get('referer')); // refresh page ???
        });
    }
}

module.exports = new catController();