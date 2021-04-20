const mysql = require('mysql')
const dbObject = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'domain',
  multipleStatements: true,
}

class Conn {
  constructor() {
    const pool = mysql.createPool(dbObject)
    pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
      if (error) throw error
      console.log('mysql connection success! ')
    })
    this.pool = pool
  }

  q(sql, values) {
    return new Promise((resolve, reject) => {
      this.pool.getConnection(function(err, conn) {
        if (err) {
          conn.release()
          reject(err)
        } else {
          conn.query(sql, values, (err, rows) => {
            conn.release()
            if (err) {
              console.log(err)
              reject(err)
            } else {
              resolve(rows)
            }
          })
        }
      })
    })
  }
}

module.exports = new Conn()
