const Router = require('express')
const router = new Router()
const controller = require('./catController')

router.get('/:category/:time', controller.cattime)
router.get('/:category/:time/post/:postid', controller.catpost) // /all/week/post/4

router.get('/:category', (req, res) => res.redirect('/category/all/week'))

router.get('/', (req, res) => res.redirect('/category/all/week'))

module.exports = router