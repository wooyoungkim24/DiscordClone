const express = require('express')
const asyncHandler = require('express-async-handler');

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();
const { Op } = require('sequelize');
const { Member, Admin, Moderator, Server, TextChannel, VoiceChannel, User } = require('../../db/models')

//Servers
router.get("/all/:id", asyncHandler(async (req, res) => {
    const userId = req.params.id;

    const members = await Member.findAll({
        where: {
            [Op.and]:[
                {userId:userId},
                {pending:false}
            ]
        },
        include: Server
    })
    const moderators = await Moderator.findAll({
        where: {
            userId
        },
        include: Server
    })
    const admins = await Admin.findAll({
        where: {
            userId
        },
        include: Server
    })

    return res.json({
        members,
        moderators,
        admins
    })
}))

router.get("/all/members/:id", asyncHandler(async(req,res) =>{
    const serverId = req.params.id
    const members = await Member.findAll({
        where:{
            [Op.and]:[
                {serverId},
                {pending:false}
            ]

        }
    })
    const admin = await Admin.findOne({
        where:{
            serverId
        }
    })
    let returnArray = [...members, admin]
    return res.json(returnArray)
}))

router.get("/all/members/notAdmin/:id", asyncHandler(async(req,res) => {
    const serverId = req.params.id
    const members = await Member.findAll({
        where:{
            [Op.and]:[
                {serverId},
                {pending:false}
            ]
        },
        include: {model:User, as:'receivor'}
    })
    return res.json(members)
}))


router.get("/all/pending/members/:id", asyncHandler(async(req,res) =>{
    const serverId = req.params.id
    const members = await Member.findAll({
        where:{
            [Op.and]:[
                {serverId},
                {pending:true}
            ]

        }
    })
    return res.json(members)
}))


router.get("/all/pending/:id", asyncHandler(async(req,res) =>{
    const userId = req.params.id
    const pendingMembers = await Member.findAll({
        where:{
            [Op.and]:[
                {userId:userId},
                {pending:true}
            ]
        },
        include:[Server,{model:User, as:'receivor'},{model:User, as:'sender'}]
    })

    return res.json(pendingMembers)
}))
//Create new server and adds admin
router.post("/", asyncHandler(async (req, res) => {
    const { userId, serverImage, serverName } = req.body
    const newServer = await Server.create(req.body)
    const newServerId = newServer.id
    const newAdmin = await Admin.create({
        userId,
        serverId: newServerId
    })
    const findNewAdmin = await Admin.findOne({
        where:{
            [Op.and]:[
                {userId:userId},
                {serverId: newServerId}
            ]
        },
        include: Server
    })

    const newTextChannel = await TextChannel.create({
        channelName: "General",
        serverId: newServerId
    })
    // console.log("###what is the memebr object", findNewMember.Server)
    return res.json(findNewAdmin.Server)
}))

router.put("/", asyncHandler(async (req, res) => {
    const { serverId, serverName, serverImage } = req.body;
    const updateServer = await Server.findByPk(serverId)
    const updatedServer = await updateServer.update({
        serverName,
        serverImage
    })
    return res.json(updatedServer)
}))

router.delete("/", asyncHandler(async (req, res) => {
    const { id} = req.body
    const deletedServer = await Server.findByPk(id)
    await Server.destroy({
        where: {
            id: id
        }
    })
    // await Admin.destroy({
    //     where: {
    //         [Op.and]: [
    //             { serverId: id },
    //             { userId: userId }
    //         ]
    //     }
    // })
    return res.json(deletedServer)
}))



//New Member
router.post("/new/member", asyncHandler(async (req, res) => {
    const newMember = await Member.create(req.body)
    return res.json(newMember)
}))


router.put("/edit/member", asyncHandler(async(req,res) =>{
    const{id} = req.body
    const updateMember = await Member.findByPk(id, {include:Server})
    const updatedMember = await updateMember.update({pending:false})
    return res.json(updatedMember)
}))

router.delete("/delete/member/leave", asyncHandler(async(req,res) =>{
    const {userId, serverId} = req.body
    const deletedMember = await Member.findOne({
        where:{
            [Op.and]:[
                {userId},
                {serverId}
            ]
        },
        include: Server
    })
    await Member.destroy({
        where:{
            [Op.and]:[
                {userId},
                {serverId}
            ]
        }
    })
    return res.json(deletedMember)
}))
router.delete("/delete/member", asyncHandler(async (req, res) => {
    const { id } = req.body
    const deletedMember = await Member.findByPk(id)
    await Member.destroy({
        where: {
            id: id
        }
    })
    console.log('###did you delete')
    return res.json(deletedMember)
}))

router.post("/demote/member", asyncHandler(async (req, res) => {

    const { userId, serverId } = req.body
    await Moderator.destroy({
        where: {
            [Op.and]: [
                { userId: userId },
                { serverId: serverId }
            ]
        }
    })
    const newMember = await Member.create(req.body)
    return res.json(newMember)
}))


router.post("/new/moderator", asyncHandler(async (req, res) => {
    const { userId, serverId } = req.body;
    await Member.destroy({
        where: {
            [Op.and]: [
                { userId: userId },
                { serverId: serverId }
            ]
        }
    })
    const newModerator = await Member.create(req.body)
    return res.json(newModerator)
}))

router.post("/delete/moderator", asyncHandler(async(req,res)=>{
    const {id} = req.body
    const oldModerator = await Moderator.findByPk(id)
    await Moderator.destroy({
        where:{
            id:id
        }
    })
    return res.json(oldModerator)
}))


//Text Channels
router.get("/all/text/:id", asyncHandler(async (req, res) => {
    const serverId = req.params.id
    const textChannels = await TextChannel.findAll({
        where: {
            serverId
        }
    })
    return res.json(textChannels)
}))

router.get("/single/text/:id", asyncHandler(async(req,res)=>{
    const channelId = req.params.id
    const textChannel = await TextChannel.findByPk(channelId)

    return res.json(textChannel)
}))
router.post("/text", asyncHandler(async (req, res) => {
    const {serverId, channelName} = req.body
    await TextChannel.create({serverId, channelName})
    const allTextAfter = await TextChannel.findAll({
        where:{
            serverId
        }
    })
    return res.json(allTextAfter)
}))
router.put("/text", asyncHandler(async (req, res) => {
    const { id , channelName, serverId} = req.body
    const updateText = await TextChannel.findByPk(id);
    const updatedText = await updateText.update({channelName})

    const allTextAfter = await TextChannel.findAll({
        where:{
            serverId
        }
    })
    return res.json(allTextAfter)
}))
router.delete("/text", asyncHandler(async (req, res) => {
    const { id , serverId} = req.body
    let deletedChannel = await TextChannel.findByPk(id)
    await TextChannel.destroy({
        where: {
            id: id
        }
    })
    const allTextAfter = await TextChannel.findAll({
        where:{
            serverId
        }
    })
    return res.json(allTextAfter)
}))


//Voice Channels
router.get("/all/voice/:id", asyncHandler(async (req, res) => {
    const serverId = req.params.id
    const voiceChannels = await VoiceChannel.findAll({
        where: {
            serverId
        }
    })
    return res.json(voiceChannels)
}))
router.post("/voice", asyncHandler(async (req, res) => {
    const newVoiceChannel = await VoiceChannel.create(req.body)
    return res.json(newVoiceChannel)
}))

router.put("/voice", asyncHandler(async (req, res) => {
    const { id } = req.body
    const updateVoice = await VoiceChannel.findByPk(id);
    const updatedVoice = await updateText.update(req.body)
    return res.json(updatedVoice)
}))
router.delete("/voice", asyncHandler(async (req, res) => {
    const { id } = req.body
    let deletedChannel = await VoiceChannel.findByPk(id)
    await VoiceChannel.destroy({
        where: {
            id: id
        }
    })
    return res.json(deletedChannel)
}))



module.exports = router;
