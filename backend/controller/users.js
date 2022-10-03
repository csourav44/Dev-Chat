const Users = require("../models/user");
const bcrypt = require("bcrypt");

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await Users.findOne({ username });
        if (!user) {
            return res.json({ message: "Incorrect Username or Password", status: false });
        }
        const isPassvalid = await bcrypt.compare(password, user.password);
        if (!isPassvalid) {
            return res.json({ message: "Incorrect  Password , please enter correct one to login", status: false });
        }
        delete user.password;
        return res.json({ status: true, user });


    } catch (error) {
        next(error)
    }
}
const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const isalreadyuser = await Users.findOne({ username });
        if (isalreadyuser) {
            return res.json({ message: "User already exists", status: false })
        }
        const emailCheck = await Users.findOne({ email });
        if (emailCheck){
            return res.json({ msg: "Email already used", status: false });
        }
        const encryptedpw = await bcrypt.hash(password , 10);
        const user = await Users.create({
            username,
            email,
            password:encryptedpw,
        });
        delete user.password;
        return res.json({status:true , user});
    } catch (error) {
        next(error);
    }
}

const getAllUsers = async(req,res,next)=>{
    try {
        const users = await Users.find({_id:{$ne:req.params.id}}).select(
            [
                "email",
                "username",
                "avatarImage",
                "_id",
            ]
        );
        return res.json(users)
    } catch (error) {
        next(error)
    }
}

const setAvarter = async(req,res,next)=>{
    try {
        const userId = req.params.id;
        const {avatarImage} = req.body;
        const userData = await Users.findByIdAndUpdate(userId,
            {
            isAvatarImageSet: true,
            avatarImage,
            },
           {new:true}
            );
            // console.log(userData)
        return res.json({
            isSet:userData.isAvatarImageSet,
            image:userData.avatarImage,
        });
    } catch (error) {
        next(error)
    }
}

const logOut = async(req,res,next)=>{
    try {
        if(!req.params.id){
            return res.json({message:"User id is required"});
        }
        onlineUsers.delete(req.params.id);
        return res.status(200).send();
        
    } catch (error) {
        next(error)
    }
}

module.exports = {login , register , getAllUsers , setAvarter , logOut};