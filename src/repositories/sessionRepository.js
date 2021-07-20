import connection from "../database.js"

async function createUser(name, email, hashedPassword) {
    await connection.query(
        `INSERT INTO "users" ("name", "email", "password") VALUES ($1, $2, $3)`,
        [name, email, hashedPassword]
    );
}
async function insertTransaction(user,value,type){
    await connection.query(
        `INSERT INTO "financialEvents" ("userId", "value", "type") VALUES ($1, $2, $3)`,
        [user.id, value, type]
      );
}

async function allTransactions(user){
    const events = await connection.query(
        `SELECT * FROM "financialEvents" WHERE "userId"=$1`,
        [user.id]
      );
      return (events.rows)
}
async function orderingTransactions(user){
    const events = await connection.query(
        `SELECT * FROM "financialEvents" WHERE "userId"=$1 ORDER BY "id" DESC`,
        [user.id]
      );
  return (events.rows)
}
export default { createUser, insertTransaction, allTransactions, orderingTransactions };