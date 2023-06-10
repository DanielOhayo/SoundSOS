const router = require("express").Router();
const UserController = require("../controller/user.controller")

router.post('/registration', UserController.register)
router.post('/login', UserController.login)
// router.post('/createMel', UserController.createMel)
router.post('/recognizeDB', UserController.recognizeDB)
router.post('/recognize', UserController.recognize)
router.post('/emotion', UserController.emotion)
router.post('/levels', UserController.levels)
router.post('/emergencyNum', UserController.emergencyNum)

module.exports = router
