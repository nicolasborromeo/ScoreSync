const express = require('express');
const router = express.Router();

const { multipleImagesUpload, multipleMulterUpload, deleteFile } = require("../../awsS3");
const { requireAuth } = require('../../utils/auth');

const { Image } = require('../../db/models');

router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const { user } = req;
        const userImages = await Image.findAll({ where: { userId: user.id } });
        return res.status(200).json({ userImages });
    },
)

router.put(
    '/:imageId',
    requireAuth,
    async (req, res) => {
        const imageId = req.params.imageId
        const { name } = req.body
        const image = await Image.findByPk(imageId)
        if (!image) return res.status(404).json("Couldn't find image in database")
        image.update({name: name})
        res.status(201).json({ newName: image.name })
    }
)

router.delete(
    '/:imageId',
    requireAuth,
    async (req, res) => {
        const imageId = req.params.imageId
        //search for the track in the db
        const image = await Image.findByPk(imageId)


        // if(!image) return res.status(404).json("Couldn't find image in database")
        //format the filePath to match AWS key
        // const filePath =  image.filePath.split('.com/')[1]
        // const key = filePath.replaceAll('+', ' ')
        const key = image.key

        //send the delete command to AWS
        const successfulDelete = await deleteFile(key)
        
        //if successful => delete from db
        if(successfulDelete) {
            const deleteFromDb = await image.destroy()
            return res.status(201).json({success: deleteFromDb})
        }
        else return res.status(500).json({error: 'An error ocurred while trying to delete the image from the database'})
    }
)

router.post(
    '/',
    requireAuth,
    multipleMulterUpload('images'),
    async (req, res) => {
        const { user } = req;
        const userId = user.id
        const username = user.username
        const awsResponse = await multipleImagesUpload({ files: req.files, public: true, username})
        const images = await Promise.all(
            awsResponse.map(image => Image.create({
                userId: userId,
                url: image.url,
                name: image.name,
                key: `${username}/images/${image.key}`
            }))
        );

        return res.json(images);
    },
)


module.exports = router
