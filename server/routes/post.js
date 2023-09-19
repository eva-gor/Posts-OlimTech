const express = require('express');
const fs = require('fs');
const postCtrl = require('../controllers/postCtrl');
const { getPostDB, editPostDB } = require('../models/post');
const { upload } = require('../utils/fileUploader');
const router = express.Router();
const FindFiles = require('file-regex');
const path = require('path');

router.get('/:id', postCtrl.getPost);

router.get('/search/:filter', postCtrl.searchPosts);
router.post('', postCtrl.addPost);
router.get('', postCtrl.getPosts);
router.get('/page/:pageNumber', postCtrl.getPostsPage);
router.put('/:id', postCtrl.editPost);
router.delete('/:id', postCtrl.deletePost);
router.post('/:id/picture', upload.single('picture'), async (req, res) => {
    const file = req.file;
    const postID = +req.params.id;
    try {
        if (file) {
            const filePath = `http://localhost:8080/${file.filename}`;
            /** 
             * tricky part
             * we need this because sometime couple of processes trying to edit the same file
             * and some of the changes doesn't saves
             * not best solution but enough for task app 
            **/
            setTimeout(async () => {
                let post = await getPostDB(postID);
                if (!post) throw new Error(`Post ${postID} doesn't exists`);
                post.imageSrc = filePath;
                await editPostDB(post.id, post);
                post = await getPostDB(postID);

                try {
                    const files = await FindFiles('./public', new RegExp(`${postID}_.*\.*`));
                    if (files) {
                        files.forEach(f => {
                            if (f.file !== file.filename) {
                                const filePath = path.join(f.dir, f.file);
                                fs.unlinkSync(filePath);
                            }
                        })
                    } 
                } catch (err) {
                    console.log('Failed to remove ald pictures for post', postID, err);
                }

                res.status(200).send({success: true, result: post});
            }, 500);
        } else {
            res.status(400).send({success: false});
        }
    } catch (e) {
        res.status(400).send({success: false, result: e.message});
    }
});

module.exports = router;
