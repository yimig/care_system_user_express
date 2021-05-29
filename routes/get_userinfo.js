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
    const rows = await query('select * from c_user where uid=?', [req.body.uid]);
    let rObj={}
    if(rows.length>0){
        rObj={
            avatar:rows[0].avatar,
            uname:rows[0].uname,
            nname:rows[0].nname,
            gender:rows[0].gender,
            birthday:rows[0].birthday,
            height:rows[0].height,
            weight:rows[0].weight,
            isAllergic:rows[0].allergic,
            phone:rows[0].phone
        }
    }
    res.json(rObj);
});

module.exports = router;