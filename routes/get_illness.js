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
        let oitem={body:rows[i].name};
        oitem.illness=[];
        let irows=await query('select * from c_illness where bid=?',[rows[i].id]);
        for (let j = 0; j < irows.length; j++) {
            let iitem={
                name:irows[j].name,
                id:irows[j].id,
            }
            iitem.symptom=[];
            let srows=await query('select a.*,b.sp_name from (select * from c_symptom where iid=?) a join c_speciality b on a.sid=b.sp_id',[irows[j].id]);
            for (let k = 0; k < srows.length; k++) {
                iitem.symptom.push({
                    detail:srows[k].detail,
                    speciality:srows[k].sp_name,
                    spid:srows[k].sid
                })
            }
            oitem.illness.push(iitem)
        }
        rlist.push(oitem)
    }
    return rlist;
}

router.post('/', async function(req, res, next) {
    const rows = await query('select * from c_body');
    let re = await to_list(rows);
    res.json(re);
});

module.exports = router;