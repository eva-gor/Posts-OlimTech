const { getTable, updateTable, generateId } = require("../db/dbUtils");
const { TABLE_NAMES } = require("../db/tables/tables");
const { validate } = require("../db/validation");;

exports.postSchema = {
    title: {
        validator: (val) => typeof val === 'string',
        required: true,
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
    imageSrc: {
        validator: (val) => typeof val === 'string',
        required: false,
    },
    date: {
        validator: (val) => typeof +val === 'number' && +val !== NaN,
        required: false,
        default: () => Date.now().toString(),
    },
};

exports.getPostsTable = async () => {
    const posts = await getTable(TABLE_NAMES.post);
    const postsObj = {};
    posts.forEach(post => {
        post.comments = [];
        postsObj[post.id] = post;
    });
    const comments = await getTable(TABLE_NAMES.comment);
    comments.forEach(comment => {
        if (comment.postId && postsObj[comment.postId]) {
            postsObj[comment.postId].comments.push(comment);
        }    
    });
    return Object.values(postsObj);
};

exports.getPostDB = async (id) => {
    const posts = await this.getPostsTable();
    return posts.find(post => post.id === id);
};

exports.addPostDB = async (post) => {
    let posts = await this.getPostsTable();
    const id = await generateId(TABLE_NAMES.post);
    delete post.id;
    posts.push(validate(this.postSchema, {id, ...post}));
    posts = await updateTable(TABLE_NAMES.post, posts);
    return posts.find(post => post.id === id);
};

exports.editPostDB = async (id, updPost) => {
    let posts = await this.getPostsTable();
    delete updPost.id;
    delete updPost.date;
    posts = posts.map(item => item.id === id ? validate(this.postSchema, {...item, ...updPost}) : item);
    posts = await updateTable(TABLE_NAMES.post, posts);
    return posts.find(post => post.id === id);
};

exports.deletePostDB = async (id) => {
    const posts = await this.getPostsTable();
    const idx = posts.findIndex(item => item.id === id);
    if (idx === -1) throw new Error(`Post ${id} does not exist`);
    const post = posts.find(post => post.id === id);
    if (idx > -1) posts.splice(idx, 1);
    await updateTable(TABLE_NAMES.post, posts);
    return post;
};

exports.createPost = (title, username, imageSrc) => {
    return {
        title, username, imageSrc,
        likes: [], dislikes: [], date: +Date.now().toString()
    }
};
