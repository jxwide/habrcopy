const Router = require('express')
const router = new Router()
const controller = require('./indexController')

const urlencodedParser = Router.urlencoded({extended: false});

//router.get('/:category/:time', controller.cattime)
router.get('/', controller.index)
router.get('/editor', (req, res) => res.redirect('/editor/new'))
router.get('/editor/new', controller.editornew)
router.post('/editor/new', urlencodedParser, controller.editornewpost)

module.exports = router