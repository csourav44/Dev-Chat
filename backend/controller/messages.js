const Messages = require('../models/message')

const getMessages = async(req,res,next)=>{
    try {
        const {from ,to} = req.body;
        const message = await Messages.find({
            users:{$all :[from , to]}
        }).sort({updateAt:1});

        const projectedMessages = message.map((msg)=>{
            return {
                fromSelf : msg.sender.toString()===from,
                message:msg.message.text,
            }
        })
        res.json(projectedMessages);
    } catch (error) {
        next(error)
    }
}

const addMessage = async(req,res,next)=>{
    try {
        const {from ,to ,message}=req.body;
        const data = await Messages.create({
            message:{text:message},
            users:[from , to],
            sender:from,
            status:{
                sent:true,
                read:false,
            }
        });
        if (data) return res.json({ msg: "Message added successfully." });
        else return res.json({ msg: "Failed to add message to the database" });
    } catch (error) {
        next(error)
    }
}

module.exports = {getMessages ,addMessage}