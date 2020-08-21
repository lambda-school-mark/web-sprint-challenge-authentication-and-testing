const db = require("../database/dbConfig");

module.exports = {
  add,
  remove,
  findBy,
};

function add(user) {
  return db("users").insert(user);
}

function remove(id) {
  return db("users").where({ id }).del();
}

function findBy(filter) {
  return db("users").where(filter).orderBy("id");
}
