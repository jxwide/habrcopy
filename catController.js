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
        
        
        //console.log(stringdate)

        let nofc = ''; // name of category
        if (category == 'all') nofc = 'Все потоки';
        if (category == 'dev') nofc = 'Разработка';
        if (category == 'admin') nofc = 'Администрирование';
        if (category == 'design') nofc = 'Дизайн';
        if (category == 'marketing') nofc = 'Маркетинг';

        var intdate = parseInt(stringdate);
        //
        let query = "SELECT * FROM `articles` WHERE 'createDate' <= ? AND `categoryName` = ?";
        pool.query(query, [intdate, category], (err, rrr) => {
            if(err) console.log(err);
            //console.log(rrr);

            res.render('articleslist.hbs', {
                name_of_cat: nofc,
                arc: rrr
            })
        });
    }
}

module.exports = new catController();