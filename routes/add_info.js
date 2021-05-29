var express = require('express');
var router = express.Router();
var mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'care_admin',
    password: '1320',
    database: 'care_system'
})

let query = function( sql, values ) {
    // 返回一个 Promise
    return new Promise(( resolve, reject ) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject( err )
            } else {
                connection.query(sql, values, ( err, rows) => {
                    if ( err ) {
                        reject( err )
                    } else {
                        resolve( rows )
                    }
                    // 结束会话
                    connection.release()
                })
            }
        })
    })
}

router.post('/', async function(req, res, next) {
    let result=0;
    const rows = await query('insert into c_info(detail,sid,uid) values(?,?,?)', [req.body.detail,req.body.sid,req.body.uid]);
    if(rows.affectedRows > 0){
        result = 1;
    }
    res.json({result:result});
});

module.exports = router;