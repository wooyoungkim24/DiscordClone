const express = require('express')
const asyncHandler = require('express-async-handler');

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();
const { Op } = require('sequelize');
const { Member, Admin, Moderator, Server, TextChannel, VoiceChannel } = require('../../db/models')

//Servers
router.get("/all/:id", asyncHandler(async (req, res) => {
    const userId = req.params.id;

    const members = await Member.findAll({
        where: {
            userId
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

//Create new server and adds admin
router.post("/", asyncHandler(async (req, res) => {
    const { userId, serverImage, serverName } = req.body
    const newServer = await Server.create(req.body)
    const newServerId = newServer.id
    const newAdmin = await Admin.create({
        userId,
        serverId: newServerId
    })
    const newMember = await Member.create({
        userId: userId,
        serverId: newServerId
    })
    const findNewMember = await Member.findOne({
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
    return res.json(findNewMember.Server)
}))

router.put("/", asyncHandler(async (req, res) => {
    const { id } = req.body;
    const updateServer = await Server.findByPk(id)
    const updatedServer = await updateServer.update(req.body)
    return res.json(updatedServer)
}))

router.delete("/", asyncHandler(async (req, res) => {
    const { id, userId } = req.body
    const deletedServer = await Server.findByPk(id)
    await Server.destroy({
        where: {
            id: id
        }
    })
    await Admin.destroy({
        where: {
            [Op.and]: [
                { serverId: id },
                { userId: userId }
            ]
        }
    })
    return res.json(deletedServer)
}))



//New Member
router.post("/new/member", asyncHandler(async (req, res) => {
    const newMember = await Member.create(req.body)
    return res.json(newMember)
}))
router.delete("/delete/member", asyncHandler(async (req, res) => {
    const { id } = req.body
    const deletedMember = await Member.findByPk(id)
    await Member.destroy({
        where: {
            id: id
        }
    })
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
    const newTextChannel = await TextChannel.create(req.body)
    return res.json(newTextChannel)
}))
router.put("/text", asyncHandler(async (req, res) => {
    const { id } = req.body
    const updateText = await TextChannel.findByPk(id);
    const updatedText = await updateText.update(req.body)
    return res.json(updatedText)
}))
router.delete("/text", asyncHandler(async (req, res) => {
    const { id } = req.body
    let deletedChannel = await TextChannel.findByPk(id)
    await TextChannel.destroy({
        where: {
            id: id
        }
    })
    return res.json(deletedChannel)
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
