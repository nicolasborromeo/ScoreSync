const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { UserDisplayInfo } = require('../../db/models');

const router = express.Router();

router.post('/current',
    requireAuth,
    async (req, res) => {
        let user = req.user;
        let userHasInfo = await UserDisplayInfo.findOne({
            where: {userId : user.id}
        });
        if(userHasInfo) return res.status(400).json({error: 'You already have a display info. If you want to update it use the Update button'});

        let usersDisplayInfo = await UserDisplayInfo.create({userId: user.id, ...req.body})

        return res.json({message:'Succesfully stored your display info', displayInfo: usersDisplayInfo});
    }
)

router.put('/current',
    requireAuth,
    async (req, res) => {
        let user = req.user;
        let userInfo = await UserDisplayInfo.findOne({
            where: {userId : user.id}
        });
        if(!userInfo) return res.status(400).json({error: 'You do not have a display info to update. Set your default info first'});

        let usersDisplayInfo = await userInfo.update({userId: user.id, ...req.body})

        return res.json({message:'Succesfully updated your display info', displayInfo: usersDisplayInfo});
    }
)


module.exports = router
