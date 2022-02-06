const Router = require('express')
const router = new Router()
const controller = require('./catController')
const urlencodedParser = Router.urlencoded({extended: false});

router.get('/:category/:time', controller.cattime)
router.get('/:category/:time/post/:postid', controller.catpost)
router.post('/:category/:time/post/:postid', urlencodedParser, controller.newcomm)

router.get('/:category', (req, res) => res.redirect('/category/all/week'))

router.get('/', (req, res) => res.redirect('/category/all/week'))

module.exports = router