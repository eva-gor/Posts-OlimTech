Structure:
This project conatains two application:
- server app (inside of './server' folder)
- client app (inside of './client' folder)

Task related to client app. So, everything what you have to do you will do it inside of './client' folder

Steps:
1. Download and install node here - https://nodejs.org/en/ (if needed)
2. Open project using VSC or some other code editor
3. Run command in terminal (inside of this folder): npm run setup (it should install all dependencies)
4. Run commant in terminal (inside of this folder): npm run start_server (it should start server app)
5. Open additional terminal and run command: npm run start_client (it should start client app)

API
Client app should use api provided by server app.
Here is endpoints description:

MAIN_URL = http://localhost:8080/

CREATE POST:
url: MAIN_URL + 'post/'
method: post
body: {
    title: <string>,
    username: <string>
}
response: {
    id: <number>,
    title: <string>,
    username: <string>
    likes: <Array<string>> //usernames
    dislikes: <Array<string>> //usernames
    imageSrc: <string> //path
    date: <number>,
    comments: <Array<Comment>>
}

UPDATE POST
url: MAIN_URL + 'post/{id}'
method: put
body: {
    title?: <string>,
    likes?: Array<<string>>,
    dislikes?: Array<<strings>>
}
response: {
    id: <number>,
    title: <string>,
    username: <string>
    likes: <Array<string>>
    dislikes: <Array<string>>
    date: <number>,
    comments: <Array<Comment>>
}

FILTER/SEARCH POSTS BY KEYWORD
url MAIN_URL + 'post/search/${keyWord}'
method: get
response: [
    {
        id: <number>,
        title: <string>,
        username: <string>
        likes: <Array<string>> //usernames
        dislikes: <Array<string>> //usernames
        imageSrc: <string> //path
        date: <number>,
        comments: <Array<Comment>>
    }
    ...
]

GET POSTS BY PAGES (9 posts per page)
url MAIN_URL + 'post/page/${pageNumber}' // pageNumber > 0
response: [
    {
        id: <number>,
        title: <string>,
        username: <string>
        likes: <Array<string>> //usernames
        dislikes: <Array<string>> //usernames
        imageSrc: <string> //path
        date: <number>,
        comments: <Array<Comment>>
    }
    ...
]
+ response conains additional information: totalPages, total and page

DELETE POST
url: MAIN_URL + 'post/{id}'
method: delete
response: {
    id: <number>,
    title: <string>,
    username: <string>
    likes: <Array<string>> //usernames
    dislikes: <Array<string>> //usernames
    imageSrc: <string> //path
    date: <number>,
    comments: <Array<Comment>>
}

UPLOAD POST PICTURE
url: MAIN_URL + 'post/{id}/picture'
method: post
body: FormData // should contain file like this formData.append("picture", file);
response: {
    id: <number>,
    title: <string>,
    username: <string>
    likes: <Array<string>> //usernames
    dislikes: <Array<string>> //usernames
    imageSrc: <string> //path
    date: <number>,
    comments: <Array<Comment>>
}

CREATE COMMENT
url: MAIN_URL + 'comment'
method: post
body: {
    text: <string>,
    postId: <number>,
    username: <string>,
}
response: {
    id: <number>,
    text: <string>,
    postId: <number>,
    username: <string>,
    likes: <Array<strings>>,
    dislikes: <Array<strings>>,
    date: <number>
}

UPDATE COMMENT
url: MAIN_URL + 'comment/{id}'
method: put
body: {
    text: <string>,
    likes: <Array<strings>>,
    dislikes: <Array<strings>>,
}
response: {
    id: <number>,
    text: <string>,
    postId: <number>,
    username: <string>,
    likes: <Array<strings>>,
    dislikes: <Array<strings>>,
    date: <number>
}

DELETE COMMENT
url: MAIN_URL + 'comment/{id}'
method: delete
response: {
    id: <number>,
    text: <string>,
    postId: <number>,
    username: <string>,
    likes: <Array<strings>>,
    dislikes: <Array<strings>>,
    date: <number>
}


=============== i hope next endpoints will shouldn't be used, but i'll left it here, just in case ====================

GET ALL POSTS
url: MAIN_URL + 'post'
method: get
response: [
    {
        id: <number>,
        title: <string>,
        username: <string>
        likes: <Array<string>> //usernames
        dislikes: <Array<string>> //usernames
        imageSrc: <string> //path
        date: <number>,
        comments: <Array<Comment>>
    }
    ...
]

GET POST
url: MAIN_URL + 'post/{id}'
method: get
response: {
    id: <number>,
    title: <string>,
    username: <string>
    likes: <Array<string>> //usernames
    dislikes: <Array<string>> //usernames
    imageSrc: <string> //path
    date: <number>,
    comments: <Array<Comment>>
}

GET COMMENT
url: MAIN_URL + 'comment/{id}'
method: get
response: {
    id: <number>,
    text: <string>,
    postId: <number>,
    username: <string>,
    likes: <Array<strings>>,
    dislikes: <Array<strings>>,
    date: <number>
}

GET COMMENTS
url: MAIN_URL + 'comment'
method: get
response: [
    {
        id: <number>,
        text: <string>,
        postId: <number>,
        username: <string>,
        likes: <Array<strings>>,
        dislikes: <Array<strings>>,
        date: <number>
    },
    ...
]