const express = require('express');

const commentCtrl = require('../controllers/commentCtrl');
const router = express.Router();

router.post('', commentCtrl.addComment);
router.put('/:id', commentCtrl.editComment);
router.delete('/:id', commentCtrl.deleteComment);
router.get('/:id', commentCtrl.getComment);
router.get('', commentCtrl.getComments);

module.exports = router;
