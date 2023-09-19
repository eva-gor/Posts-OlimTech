const { resetTestTables, setTestMode } = require("../db/dbUtils");
const { createComment, addCommentDB, getCommentsTable, getCommentDB, editCommentDB, deleteCommentDB } = require("../models/comment");
const { createPost, addPostDB, getPostsTable, getPostDB, editPostDB, deletePostDB } = require("../models/post");


const postTests = async () => {
    const firstPost = createPost('First post', 'Serhii', 'some/path');
    const secondPost = createPost('Second post', 'Serhii', 'some/path');
    const thirdPost = createPost('Third post', 'Serhii', 'some/path');
    
    let posts = await addPostDB(firstPost);
    posts = await getPostsTable();
    const post1 = posts[0];
    await addPostDB(secondPost);
    await addPostDB(thirdPost);

    posts = await getPostsTable();
    console.log('ALL POSTS:', posts);

    const post2 = await getPostDB(2);
    console.log('FETCHED POST 2', post2);

    const post3 = await getPostDB(3);
    post3.likes = ['Vasya'];
    await editPostDB(post3.id, post3);
    posts = await getPostsTable();

    console.log('ADDED LIKE TO POST 3', posts);

    await deletePostDB(post1.id);
    posts = await getPostsTable();
    console.log('REMOVED POST 1', posts);

    const notExistingPost = await getPostDB(1010);
    console.log('FETCHED NOT EXISTING POST', notExistingPost);

    const unvalidPost = createPost('First post', null, 'some/path');
    try {
        await addPostDB(unvalidPost);
    } catch(e) {
        console.log('ADDING UNVALID POST ERROR', e)
    }
}

const commentTests = async () => {
    let comment1 = createComment('bla', 2, 'Alex');
    let comment2 = createComment('bla bla', 2, 'Oleg');
    let comment3 = createComment('bla bla', 3, 'Alex');

    await addCommentDB(comment1);
    await addCommentDB(comment2);
    await addCommentDB(comment3);

    const invalidComment = createComment('Comment to not existing post', 1020, 'Alon');
    try {
        await addCommentDB(invalidComment);
    } catch (e) {
        console.log('INVALID POST CREATION ERROR', e);
    }

    let comments = await getCommentsTable();
    console.log('ALL COMMENTS', comments);

    comment3 = await getCommentDB(3);
    console.log('FETCHED COMMENT 3:', comment3);

    comment2 = await getCommentDB(2);
    comment2.text = 'NEW TEXT';
    await editCommentDB(comment2.id, comment2);
    comments = await getCommentsTable();
    console.log('CHANGED TEXT IN COMMENT 2', comments);

    comment1 = await getCommentDB(1);
    await deleteCommentDB(comment1.id);
    comments = await getCommentsTable();

    console.log('REMOVED COMMENT 1', comments);

    const notExistingComment = await getCommentDB(1010);
    console.log('FETCHED NOT EXISTING COMMENT', notExistingComment);
}

exports.runDbTests = async () => {
    setTestMode(true);
    resetTestTables();

    await postTests();
    await commentTests();
    

    console.log('TESTS FINISHED');
    resetTestTables();
}