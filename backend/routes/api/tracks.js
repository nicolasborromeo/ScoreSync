const express = require('express');
const { multipleFilesUpload, multipleMulterUpload, retrievePrivateFile } = require("../../awsS3");
const { requireAuth } = require('../../utils/auth');
const { Track } = require('../../db/models');

const router = express.Router();

router.get(
    '/current',
    requireAuth,
    async (req, res, next) => {
        const { user } = req;
        const userTracks = await Track.findAll({ where: { userId: user.id } });
        return res.status(200).json({ userTracks: userTracks });
    },
);

router.post(
    '/',
    requireAuth,
    multipleMulterUpload('tracks'),
    async (req, res, next) => {
        const { user } = req;
        const userId = user.id
        const username = user.username
        const awsResponse = await multipleFilesUpload({ files: req.files, public: true, username})

        const tracks = await Promise.all(
            awsResponse.map(track => Track.create({
                filePath: track.url,
                userId: userId,
                title: track.title
            }))
        );

        return res.json(tracks);
    },
)


module.exports = router
