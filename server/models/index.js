const { TABLE_NAMES } = require("../db/tables/tables");
const { commentSchema } = require("./comment");
const { postSchema } = require("./post");

exports.schemas = {
    [TABLE_NAMES.post]: postSchema,
    [TABLE_NAMES.comment]: commentSchema,
};