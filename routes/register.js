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
    let uid=-1;
    let date = req.body.birthday.substring(0,10)
    const rows = await query('insert into c_user(uname,password,gender,birthday,weight,height,allergic,nname,phone) values(?,?,?,?,?,?,?,?,?)',
        [req.body.uname,req.body.password,req.body.gender,date,req.body.weight,req.body.height,req.body.allergic,req.body.nname,req.body.phone]);
    if(rows.affectedRows > 0){
        uid = (await query('select uid from c_user order by uid desc limit 1'))[0].uid;
    }
    res.json({uid:uid});
});

module.exports = router;