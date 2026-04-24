const express = require('express');
const { multipleFilesUpload, multipleMulterUpload, deleteFile } = require("../../awsS3");
const { requireAuth } = require('../../utils/auth');
const { Track } = require('../../db/models');
const router = express.Router();

async function getOwnedTrack(trackId, userId) {
    return await Track.findOne({ where: { id: trackId, userId } });
}

router.get('/current', requireAuth, async (req, res) => {
    const userTracks = await Track.findAll({ where: { userId: req.user.id } });
    return res.status(200).json({ userTracks });
});

router.post('/', requireAuth, multipleMulterUpload('tracks'), async (req, res) => {
    try {
        const userId = req.user.id;
        const username = req.user.username;
        const uploadResponse = await multipleFilesUpload({ files: req.files || [], public: true, username });

        const tracks = await Promise.all(
            uploadResponse.map(track => Track.create({
                filePath: track.url,
                userId,
                title: track.title,
                duration: Math.ceil(track.duration)
            }))
        );
        return res.json(tracks);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.delete('/:trackId', requireAuth, async (req, res) => {
    const track = await getOwnedTrack(req.params.trackId, req.user.id);
    if (!track) return res.status(404).json("Couldn't find track in database");

    let key;
    if (track.filePath.includes('/media/')) {
        key = track.filePath.split('/media/')[1];
    } else {
        const filePath = track.filePath.split('.com/')[1];
        key = filePath?.replaceAll('+', ' ');
    }

    if (!key) return res.status(500).json({ error: 'Could not resolve media key for deletion' });

    const successfulDelete = await deleteFile(key);
    if (!successfulDelete) {
        return res.status(500).json({ error: 'An error ocurred while trying to delete the track from the database' });
    }

    const deleteFromDb = await track.destroy();
    return res.status(201).json({ success: deleteFromDb });
});

router.put('/:trackId', requireAuth, async (req, res) => {
    const track = await getOwnedTrack(req.params.trackId, req.user.id);
    if (!track) return res.status(404).json("Couldn't find track in database");

    await track.update({ title: req.body.title?.trim() || track.title });
    res.status(201).json({ newTitle: track.title });
});

module.exports = router;
