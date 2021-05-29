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

async function to_list(rows){
    let rlist=[];
    for (let i = 0; i < rows.length; i++) {
        let oitem={
            name:rows[i].sp_name,
            id:rows[i].sp_id,
            detail:rows[i].sp_detail
        };
        oitem.doctors=[];
        let drows=await query('select * from c_staff where speciality=?',[rows[i].sp_id]);
        for (let j = 0; j < drows.length; j++) {
            let ditem={
                name:drows[j].nname,
                id:drows[j].sid,
                detail:drows[j].description
            }
            oitem.doctors.push(ditem)
        }
        rlist.push(oitem)
    }
    return rlist;
}

router.post('/', async function(req, res, next) {
    const rows = await query('select * from c_speciality');
    let re = await to_list(rows);
    res.json(re);
});

module.exports = router;