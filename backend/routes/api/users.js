const express = require('express')
const asyncHandler = require('express-async-handler');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, UserFriend, DirectMessage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const router = express.Router();



const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];
router.post(
    '/',
    validateSignup,
    asyncHandler(async (req, res) => {
        const { email, password, username } = req.body;
        const user = await User.signup({ email, username, password });

        await setTokenCookie(res, user);

        return res.json({
            user,
        });
    }),
);

router.get("/active/messages/:id", asyncHandler(async (req, res) => {
    const id = req.params.id
    const activeDirectMessages = await User.findOne({
        where: {
            id: id
        },
        include: ["messager", "messagee"]
    })

    let dms = [...activeDirectMessages.messager, ...activeDirectMessages.messagee]
    return res.json(dms)
}))

router.get("/other/person/:id", asyncHandler(async(req,res)=>{
    const id = req.params.id
    const otherPerson = await User.findByPk(id)
    return res.json(otherPerson)
}))


router.get("/single/dm/:userId/:id",asyncHandler(async(req,res) =>{
    const {userId, id} = req.params
    const singleDM = await DirectMessage.findOne({
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                { user1: userId },
                { user2: id }
              ]
            },
            {
              [Op.and]: [
                { user1: id },
                { user2: userId }
              ]
            }
          ]
        }
      })
      return res.json(singleDM)
}))

router.delete("/delete/dm", asyncHandler(async(req,res)=>{
    const {userId, otherId} = req.body
    await DirectMessage.destroy({
        where:{
            [Op.or]:[
                {
                    [Op.and]:[
                        {user1:userId},
                        {user2:otherId}
                    ]
                },
                {
                    [Op.and]:[
                        {user1:otherId},
                        {user2:userId}
                    ]
                }
            ]
        }
    })
    const activeDirectMessages = await User.findOne({
        where: {
            id: userId
        },
        include: ["messager", "messagee"]
    })

    let dms = [...activeDirectMessages.messager, ...activeDirectMessages.messagee]
    return res.json(dms)

}))
router.get("/get/dms/temp/:id", asyncHandler(async(req,res)=>{
    const id = req.params.id
    const activeDirectMessages = await User.findOne({
        where: {
            id
        },
        include: ["messager", "messagee"]
    })

    let dms = [...activeDirectMessages.messager, ...activeDirectMessages.messagee]
    return res.json(dms)
}))

router.post("/create/dm", asyncHandler(async (req, res) => {
    const { userId, friendId } = req.body
    let oldCheck = await DirectMessage.findOne({
        where: {
            [Op.or]:
                [
                    {
                        [Op.and]: [
                            { user1: userId },
                            { user2: friendId }
                        ]
                    },
                    {
                        [Op.and]: [
                            { user1: friendId },
                            { user2: userId }
                        ]
                    }
                ]
        }
    })

    if (!oldCheck) {
        await DirectMessage.create({
            user1: userId,
            user2: friendId
        })
    }
    const activeDirectMessages = await User.findOne({
        where: {
            id: userId
        },
        include: ["messager", "messagee"]
    })

    let dms = [...activeDirectMessages.messager, ...activeDirectMessages.messagee]
    return res.json(dms)
}))


router.get("/pending/friends/:id", asyncHandler(async(req,res)=>{
    const id = req.params.id
    const pendingFriends = await UserFriend.findAll({
        where:{
            [Op.and]:[
                {pending:true},
                {friend2: id}
            ]
        },
        include: {model:User, as:'added'}
    })
    return res.json(pendingFriends)
}))

router.get("/not/friends/:id", asyncHandler(async(req,res)=>{
    const id = req.params.id
    const friend1 = await UserFriend.findAll({
        where: {
            [Op.and]:[
                {friend1:id},
                {pending:false}
            ]
        },
        include: {model:User, as:'addee'}
    })
    const friend2 = await UserFriend.findAll({
        where: {
            [Op.and]:[
                {friend2:id},
                {pending:false}
            ]
        },
        include: {model:User, as:'added'}
    })
    // console.log("###what is happening", friend1, friend2[0].added)


    const allUsers = await User.findAll()

    let friendObjs = []

    friend1.forEach(ele=>{
        if(ele){
            friendObjs.push(ele.addee)
        }
    })
    friend2.forEach(ele=>{
        if(ele){
            friendObjs.push(ele.added)
        }
    })
    let friendIds = []
    friendObjs.forEach(ele =>{
        friendIds.push(ele.id)
    })
    let postUsers = []
    allUsers.forEach((ele,i) =>{
        if(!friendIds.includes(ele.id) && parseInt(ele.id) !== parseInt(id)){
            postUsers.push(ele)
        }
    })

    return res.json(postUsers)
}))


router.get("/friends/:id", asyncHandler(async (req, res) => {
    const id = req.params.id

    const friend1 = await UserFriend.findAll({
        where: {
            [Op.and]:[
                {friend1:id},
                {pending:false}
            ]
        },
        include: {model:User, as:'addee'}
    })
    const friend2 = await UserFriend.findAll({
        where: {
            [Op.and]:[
                {friend2:id},
                {pending:false}
            ]
        },
        include: {model:User, as:'added'}
    })
    // console.log("###what is happening", friend1, friend2[0].added)


    let friendObjs = []

    friend1.forEach(ele=>{
        if(ele){
            friendObjs.push(ele.addee)
        }
    })
    friend2.forEach(ele=>{
        if(ele){
            friendObjs.push(ele.added)
        }
    })
    // const friendsOneWay = await User.findOne({
    //     where: {
    //         id: id
    //     },
    //     include: ["User_Friends", "Friends"]
    // })
    // const friendsOtherWay = await User.findOne({
    //     where: {
    //         id: id
    //     },
    //     include:"Friends"
    // })
    // console.log("###these are my friends", friendsOneWay.User_Friends)

    // let friendObjs = [...friendsOneWay.User_Friends, ...friendsOneWay.Friends]
    // friendsOneWay.User_Friends.forEach(ele =>{
    //     console.log('myfriendids', ele.id)
    // })
    // console.log('###what why', friendObjs)
    // friends.forEach(ele => {
    //     if (ele.friend1 === id) {
    //         friendObjs.push(ele)
    //     } else {
    //         let currObj = {}
    //         currObj["friend1"] = ele.friend2
    //         currObj["friend2"] = ele.friend1
    //         friendObjs.push(currObj)
    //     }
    // })
    return res.json(friendObjs)
}))


router.put("/accept/friend", asyncHandler(async(req,res) =>{
    const {id, userId} = req.body
    const update = await UserFriend.findOne({
        where:{
            id
        }
    })
    let updated = await update.update({pending:false})
    const pendingFriends = await UserFriend.findAll({
        where:{
            [Op.and]:[
                {pending:true},
                {friend2: userId}
            ]
        },
        include: {model:User, as:'added'}
    })
    return res.json(pendingFriends)
}))


router.get("/all/pending/sent/:friend1", asyncHandler(async(req,res)=>{
    const friend1 = req.params.friend1
    const allPendingSent = await UserFriend.findAll({
        where:{
            [Op.and]:[
                {friend1:friend1},
                {pending:true}
            ]
        }
    })
    return res.json(allPendingSent)
}))

router.post("/new/friend", asyncHandler(async (req, res) => {
    const { friend1, friend2 } = req.body
    const allFriends = await UserFriend.findAll();
    if (friend1 === friend2) {
        throw new Error("Cannot friend yourself")
    }
    allFriends.forEach(ele => {
        if (ele.friend1 === friend1) {
            if (ele.friend2 === friend2) {
                throw new Error("Friendship already exists")
            }
        }
        if (ele.friend1 === friend2) {
            if (ele.friend2 === friend1) {
                throw new Error("Friendship already exists")
            }
        }
    })
    let newFriend = await UserFriend.create({
        friend1,
        friend2,
        pending:true
    })
    return res.json(newFriend)
}))


router.delete("/delete/friend", asyncHandler(async (req, res) => {
    const { id,userId } = req.body
    let destroyedFriend = await UserFriend.findOne({
        where:{
            id
        }
    })
    await UserFriend.destroy({
        where:{
            id
        }
    })
    const pendingFriends = await UserFriend.findAll({
        where:{
            [Op.and]:[
                {pending:true},
                {friend2: userId}
            ]
        },
        include: {model:User, as:'added'}
    })
    return res.json(pendingFriends)

}))

router.delete("/remove/friend", asyncHandler(async (req, res) => {
    const {friend1,friend2 } = req.body
    console.log("##hitting correctly", friend1, friend2)
    let destroyedFriend = await UserFriend.findOne({
        where:{
            [Op.or]:[
                {
                    [Op.and]:[
                        {friend1},
                        {friend2},
                        {pending:false}
                    ]
                },
                {
                    [Op.and]:[
                        {friend1:friend2},
                        {friend2:friend1},
                        {pending:false}
                    ]
                }
            ]

        }
    })
    await UserFriend.destroy({
        where:{
            [Op.or]:[
                {
                    [Op.and]:[
                        {friend1},
                        {friend2},
                        {pending:false}
                    ]
                },
                {
                    [Op.and]:[
                        {friend1:friend2},
                        {friend2:friend1},
                        {pending:false}
                    ]
                }
            ]

        }
    })

    return res.json(destroyedFriend)

}))




module.exports = router;
