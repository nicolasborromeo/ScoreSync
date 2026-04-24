const express = require('express');
const router = express.Router();

const { multipleImagesUpload, multipleMulterUpload, deleteFile } = require("../../awsS3");
const { requireAuth } = require('../../utils/auth');
const { Image } = require('../../db/models');

async function getOwnedImage(imageId, userId) {
    return await Image.findOne({ where: { id: imageId, userId } });
}

router.get('/current', requireAuth, async (req, res) => {
    const userImages = await Image.findAll({ where: { userId: req.user.id } });
    return res.status(200).json({ userImages });
});

router.put('/:imageId', requireAuth, async (req, res) => {
    const image = await getOwnedImage(req.params.imageId, req.user.id);
    if (!image) return res.status(404).json("Couldn't find image in database");

    await image.update({ name: req.body.name?.trim() || image.name });
    res.status(201).json({ newName: image.name });
});

router.delete('/:imageId', requireAuth, async (req, res) => {
    const image = await getOwnedImage(req.params.imageId, req.user.id);
    if (!image) return res.status(404).json("Couldn't find image in database");

    const successfulDelete = await deleteFile(image.key);
    if (!successfulDelete) {
        return res.status(500).json({ error: 'An error ocurred while trying to delete the image from the database' });
    }

    const deleteFromDb = await image.destroy();
    return res.status(201).json({ success: deleteFromDb });
});

router.post('/', requireAuth, multipleMulterUpload('images'), async (req, res) => {
    const userId = req.user.id;
    const username = req.user.username;

    const uploadResponse = await multipleImagesUpload({ files: req.files || [], public: true, username });
    const images = await Promise.all(
        uploadResponse.map(image => Image.create({
            userId,
            url: image.url,
            name: image.name,
            key: `${username}/images/${image.key}`
        }))
    );

    return res.json(images);
});

module.exports = router;
