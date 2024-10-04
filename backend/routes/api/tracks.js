const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Track } = require('../../db/models');

const router = express.Router();

router.get(
    '/current',
    requireAuth,
    async (req, res, next) => {
        const { user } = req;
        const userTracks = await Track.findAll({where: {userId: user.id}});
        return res.status(200).json({userTracks: userTracks});
    },
);


module.exports = router
