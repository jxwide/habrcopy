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

class indexController {
    async index(req, res) {
        res.redirect('/category/all/week')
    }
    async editornew(req, res) {
        res.render('editor.hbs')
    }
    async editornewpost(req, res) {
        if(!req.body) return response.sendStatus(400);
        let {ta, catname, cattitle, catdesc} = req.body;
        if (ta.length < 10 || catname.length < 3 || cattitle.length < 3) return res.redirect('/editor/new')
        if (ta.length > 16000 || catname.length > 64 || cattitle.length > 64 || catdesc.length > 164) return res.redirect('/editor/new')

        let query = "INSERT INTO `articles` (`categoryName`, `title`, `createDate`, `textDesc`, `textFull`) VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?)";
        //res.render('editor.hbs')

        pool.query(query, [catname, cattitle, catdesc, ta], (err, rrr) => {
            if(err) return console.log(err);

            let inid = rrr['insertId'];
            return res.redirect('/category/all/week/post/' + inid);
        });
    }
}

module.exports = new indexController();