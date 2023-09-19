const { addCommentDB, editCommentDB, getCommentsTable, getCommentDB, deleteCommentDB } = require("../models/comment");

exports.addComment = async (req, res, next) => {
    try {
        const comment = await addCommentDB(req.body);
        return res.status(201).send({success: true, result: comment});
    } catch (e) {
        return res.status(400).send({success: false, result: e.message});
    }
}

exports.editComment = async (req, res, next) => {
    try {
        const id = +req.params.id;
        let comment = req.body;
        delete comment.username;
        delete comment.postId;
        delete comment.id;
        comment = await editCommentDB(id, req.body);
        // comment = await getCommentDB(id)
        return res.status(200).send({success: true, result: comment});
    } catch (e) {
        return res.status(400).send({success: false, result: e.message});
    }
}

exports.deleteComment = async (req, res, next) => {
    try {
        const comment = await deleteCommentDB(+req.params.id);
        return res.status(200).send({success: true, result: comment});
    } catch (e) {
        return res.status(400).send({success: false, result: e.message});
    }
}

exports.getComments = async (req, res, next) => {
    try {
        const comments = await getCommentsTable();
        return res.status(200).send({success: true, result: comments || []});
    } catch (e) {
        return res.status(400).send({success: false, result: e.message});
    }
}

exports.getComment = async (req, res, next) => {
    try {
        const comment = await getCommentDB(+req.params.id);
        if (!comment) throw new Error(`Comment ${req.params.id} not found`);
        return res.status(200).send({success: true, result: comment});
    } catch (e) {
        return res.status(400).send({success: false, result: e.message});
    }
}
