const { getTable, updateTable, generateId } = require("../db/dbUtils");
const { TABLE_NAMES } = require("../db/tables/tables");
const { validate } = require("../db/validation");

exports.commentSchema = {
    text: {
        required: true,
        validator: (val) => typeof val === 'string',
    },
    postId: {
        required: true,
        validator: (val) => typeof val === 'number',
    },
    username: {
        validator: (val) => typeof val === 'string',
        required: true,
    },
    likes: {
        validator: (val) => Array.isArray(val),
        required: false,
        default: [],
    },
    dislikes: {
        validator: (val) => Array.isArray(val),
        required: false,
        default: [],
    },
    date: {
        validator: (val) => typeof +val === 'number' && +val !== NaN,
        required: false,
        default: () => Date.now().toString(),
    },
};

exports.getCommentsTable = async () => getTable(TABLE_NAMES.comment);

exports.getCommentDB = async (id) => {
    const comments = await this.getCommentsTable()
    return comments.find(post => post.id === id);
};

exports.addCommentDB = async (comment) => {
    let comments = await this.getCommentsTable();
    const id = await generateId(TABLE_NAMES.comment);
    const validatedComment = validate(this.commentSchema, {...comment, id});
    const posts = await getTable(TABLE_NAMES.post);
    const isPostExists = posts.find(post => post.id === validatedComment.postId);
    if (!isPostExists) {
        throw new Error('Invalid post id');
    }
    comments.push(validate(this.commentSchema, {id, ...comment}));
    comments = await updateTable(TABLE_NAMES.comment, comments);
    return comments.find(comment => comment.id === id);
};

exports.editCommentDB = async (id, updComment) => {
    let comments = await this.getCommentsTable();
    delete updComment.id;
    delete updComment.date;
    comments = comments.map(item => item.id === id ? validate(this.commentSchema, {...item, ...updComment}) : item);
    comments = await updateTable(TABLE_NAMES.comment, comments);
    return comments.find(comment => comment.id === id);
};

exports.deleteCommentDB = async (id) => {
    const comments = await this.getCommentsTable();
    const idx = comments.findIndex(item => item.id === id);
    if (idx === -1) throw new Error(`Comment ${id} does not exist`);
    const comment = comments.find(comment => comment.id === id);
    if (idx > -1) comments.splice(idx, 1);
    await updateTable(TABLE_NAMES.comment, comments);
    return comment;
};

exports.createComment = (text, postId, username) => {
    console.log('>>>', Date.now())
    return {
        text, postId, username,
        likes: [], dislikes: [], date: +Date.now().toString()
    }
};