const express = require('express');
const { multipleFilesUpload, multipleMulterUpload, deleteFile } = require("../../awsS3");
const { requireAuth } = require('../../utils/auth');
const { Track } = require('../../db/models');
const router = express.Router();



router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const { user } = req;
        const userTracks = await Track.findAll({ where: { userId: user.id } });
        return res.status(200).json({ userTracks: userTracks });
    },
);

router.post(
    '/',
    requireAuth,
    multipleMulterUpload('tracks'),
    async (req, res) => {
        const { user } = req;
        const userId = user.id
        const username = user.username
        const awsResponse = await multipleFilesUpload({ files: req.files, public: true, username})

        const tracks = await Promise.all(
            awsResponse.map(track => Track.create({
                filePath: track.url,
                userId: userId,
                title: track.title,
                duration: Math.ceil(track.duration)
            }))
        );

        return res.json(tracks);
    },
)



////////////////DELETING FROM AWS AND DTABASE
router.delete(
    '/:trackId',
    requireAuth,
    async (req, res, next) => {
        const trackId = req.params.trackId
        //search for the track in the db
        const track = await Track.findByPk(trackId)
        if(!track) return res.status(404).json("Couldn't find track in database")
        //format the filePath to match AWS key
        const filePath =  track.filePath.split('.com/')[1]
        const key = filePath.replaceAll('+', ' ')
        //send the delete command to AWS
        const successfulDelete = await deleteFile(key)
        //if successful => delete from db
        if(successfulDelete) {
            const deleteFromDb = await track.destroy()
            return res.status(201).json({success: deleteFromDb})
        }
        else return res.status(500).json({error: 'An error ocurred while trying to delete the track from the database'})
    }
)

/////////////UPDATING RENAME TITLE
router.put(
    '/:trackId',
    requireAuth,
    async (req, res, next) => {
        const trackId = req.params.trackId
        const { title } = req.body
        const track = await Track.findByPk(trackId)
        if (!track) return res.status(404).json("Couldn't find track in database")
        track.update({title: title})
        res.status(201).json({ newTitle: track.title })
    }
)

module.exports = router
