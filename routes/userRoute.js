const { Router } = require("express");
const userController = require("../controllers/usercontroller");
const router = Router();
const User = require('../models/userModel');


router.get("/signup", userController.signup_get);
router.post("/signup", userController.signup_post);

router.get("/login", userController.login_get);
router.post("/login", userController.login_post);

router.get("/user/:id", userController.get_singleUser);

router.delete("/user/:id", userController.delete_user)


router.get('/verify/:token', usercontroller.verifyemail)

module.exports = router;



