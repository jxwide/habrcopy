const Router = require('express')
const router = new Router()
const controller = require('./catController')

router.get('/:category/:time', controller.cattime)

module.exports = router