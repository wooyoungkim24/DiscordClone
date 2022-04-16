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




router.get("/friends/:id", asyncHandler(async (req, res) => {
    const id = req.params.id

    const friendsOneWay = await User.findOne({
        where: {
            id: id
        },
        include: ["User_Friends", "Friends"]
    })
    // const friendsOtherWay = await User.findOne({
    //     where: {
    //         id: id
    //     },
    //     include:"Friends"
    // })

    let friendObjs = [...friendsOneWay.User_Friends, ...friendsOneWay.Friends]
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


router.post("/new/friend", asyncHandler(async (req, res) => {
    const { userId, friendId } = req.body
    const allFriends = await UserFriend.findAll();
    if (userId === friendId) {
        throw new Error("Cannot friend yourself")
    }
    allFriends.forEach(ele => {
        if (ele.friend1 === userId) {
            if (ele.friend2 === friendId) {
                throw new Error("Friendship already exists")
            }
        }
        if (ele.friend1 === friendId) {
            if (ele.friend2 === userId) {
                throw new Error("Friendship already exists")
            }
        }
    })
    let newFriend = await UserFriend.create({
        friend1: userId,
        friend2: friendId
    })
    return res.json(newFriend)
}))


router.delete("/delete/friend", asyncHandler(async (req, res) => {
    const { userId, friendId } = req.body
    let destroyedFriend = await UserFriend.findOne({
        where: {
            [Op.or]: [
                {
                    [Op.and]: [
                        { friend1: userId },
                        { friend2: friendId }
                    ]

                },
                {
                    [Op.and]: [
                        { friend1: friendId },
                        { friend2: userId }
                    ]
                }
            ]
        }
    })
    await UserFriend.destroy({
        where: {
            [Op.or]: [
                {
                    [Op.and]: [
                        { friend1: userId },
                        { friend2: friendId }
                    ]

                },
                {
                    [Op.and]: [
                        { friend1: friendId },
                        { friend2: userId }
                    ]
                }
            ]
        }
    })
    return res.json(destroyedFriend)
}))
module.exports = router;
