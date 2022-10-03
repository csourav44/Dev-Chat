const {
    login , register ,getAllUsers , setAvarter , logOut
}  = require('../controller/users')

const express = require('express')

const router = express.Router();

router.post("/login" , login);
router.post("/signup",register);
router.put("/setavarter/:id" , setAvarter);
router.get("/allusers/:id",getAllUsers);
router.get("/logout/:id", logOut);

module.exports = router;