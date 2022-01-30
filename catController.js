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

        


        // lastweekdate
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

        // nowdate
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
        
        //console.log(stringdate)

        let nofc = ''; // name of category
        if (category == 'all') nofc = 'Все потоки';
        if (category == 'dev') nofc = 'Разработка';
        if (category == 'admin') nofc = 'Администрирование';
        if (category == 'design') nofc = 'Дизайн';
        if (category == 'marketing') nofc = 'Маркетинг';

        
        //
        let query = '';
        if (category == 'all')
        {
            query = "SELECT * FROM `articles` WHERE `createDate` between ? and ?";
            console.log(query) // test
            pool.query(query, [intdate, nowdate], (err, rrr) => {
                if(err) console.log(err);
                rrr.reverse(); // test
                res.render('articleslist.hbs', {
                    name_of_cat: nofc,
                    arc: rrr,
                    catinurl: category,
                    timeinurl: time
                })
            });
        } else {
            query = "SELECT * FROM `articles` WHERE `categoryName` = ? and `createDate` between ? and ?";
            console.log(query) // test
            pool.query(query, [category, intdate, nowdate], (err, rrr) => {
                if(err) console.log(err);
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
        let {category, time, postid} = req.params;

        let query = "SELECT * FROM `articles` WHERE `id` = ?";

        pool.query(query, [postid], (err, rrr) => {
            if(err) console.log(err);

            if (query[0] == undefined) return res.send('404');

            res.render('article.hbs', {
                author: rrr[0]['author'],
                time: rrr[0]['createDate'],
                title: rrr[0]['title'],
                tags: rrr[0]['tags'],
                textt: rrr[0]['textFull']
            })
        });
    }
}

module.exports = new catController();