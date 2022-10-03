const {
    addMessage , getMessages
} = require("../controller/messages");

const router = require('express').Router();
router.post("/sendMessage/" , addMessage);
router.post("/getmessage/" ,getMessages )

module.exports = router;