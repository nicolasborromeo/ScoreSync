const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { UserDisplayInfo } = require('../../db/models');

const router = express.Router();

router.get(
    '/current',
    requireAuth,
    async (req, res, next) => {
        const { user } = req
        try {
            const displayInfo = await UserDisplayInfo.findOne({ where: { userId: user.id } })
            res.status(200).json(displayInfo)
        } catch (error) {
            return next(error)
        }
    }
)

router.post('/current',
    requireAuth,
    async (req, res, next) => {
        let user = req.user;
        let userInfo = await UserDisplayInfo.findOne({
            where: { userId: user.id }
        });
        const { name, email, website, jobTitle, bio, phone } = req.body.data
        let usersDisplayInfo;
        try {

            if (userInfo) {
                usersDisplayInfo = await userInfo.update({ name, email, website, jobTitle, bio, phone })
            } else {
                usersDisplayInfo = await UserDisplayInfo.create({ userId: user.id, name, email, website, jobTitle, bio, phone})
            }
            return res.json({usersDisplayInfo});
        } catch (error) {
            // res.json(error)
            return next(error)
        }
    }
)

router.put('/current',
    requireAuth,
    async (req, res) => {
        let user = req.user;
        let userInfo = await UserDisplayInfo.findOne({
            where: { userId: user.id }
        });
        if (!userInfo) return res.status(400).json({ error: 'You do not have a display info to update. Set your default info first' });

        let usersDisplayInfo = await userInfo.update({ userId: user.id, ...req.body })

        return res.json({ message: 'Succesfully updated your display info', displayInfo: usersDisplayInfo });
    }
)


module.exports = router
