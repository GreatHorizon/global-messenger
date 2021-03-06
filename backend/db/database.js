var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('messenger.sqlite3');


var InsertNewUser = (telephone, name, password, salt) => {
    db.serialize(() => {     
        var prep = db.prepare('INSERT INTO user(telephone, name, crypted_password, salt_password)'
        + 'VALUES (?, ?, ?, ?);')
        prep.run(telephone, name, password, salt)
    })
}

var GetUserInfoByNumber = function(telephone) {
    return new Promise(resolve => {
        db.serialize(() => {
            var prep = db.prepare('SELECT * FROM user WHERE telephone = ?;')
            prep.get(telephone, (err, result) => {
                resolve(result);
            })
        })
    })
}

var GetUsersInfoByNumber = function(telephone) {
    return new Promise(resolve => {
        db.serialize(() => {
            var prep = db.prepare('SELECT id_user, name, telephone FROM user WHERE telephone LIKE ?;')
            const param = telephone + '%'
            prep.all(param, (err, result) => {
                resolve(result);
            })
        })
    })
}

var GetUsersIdByNumber = function(userPhone, friendPhone) {
    return new Promise(resolve => {
        db.serialize(() => {
            db.get('SELECT id_user FROM user WHERE telephone = ?;', userPhone, (err, user) => {
                db.get('SELECT id_user FROM user WHERE telephone = ?;', friendPhone, (err, friend) => {
                    var usersIds = {userId: user.id_user, friendId: friend.id_user}
                    resolve(usersIds)
                })
            })
        })
    })
}

var GetChatList = function(userPhone) {
    var prepSql = db.prepare('SELECT friendPhone, friendName, sender, message, date FROM\n' +
    '(SELECT userName, userPhone, telephone AS friendPhone, name AS friendName FROM\n' +
    '(SELECT name AS userName,user.id_user AS userId, telephone AS userPhone, id_friend AS friendId FROM user\n' +
    'INNER JOIN user_has_friend ON user.id_user = user_has_friend.id_user\n' +
    'WHERE user.telephone = ?)\n' +
    'INNER JOIN user ON user.id_user = friendId)\n' +
    'INNER JOIN message_history ON (sender = userPhone AND receiver = friendPhone)\n' +
    ' OR (receiver = userPhone AND sender = friendPhone)\n' +
    'GROUP BY friendPhone\n' +
    'HAVING MAX(date)\n' +
    'ORDER BY date DESC;\n') 
    return new Promise((resolve) => {
        db.serialize(() => {
            prepSql.all(userPhone, (err, result) => {
                resolve(result)
            })
        })
    })  
}

var CheckHasChat = function(userPhone, friendPhone) {
    return new Promise(resolve => {
        db.serialize(() => {
            var prep = db.prepare('SELECT userId, friendId FROM\n' +
            '(SELECT user.id_user AS userId, id_friend AS friendId FROM user\n' + 
            'INNER JOIN user_has_friend ON user.id_user = user_has_friend.id_user\n' +
            'WHERE user.telephone = ?)\n' +
            'INNER JOIN user ON user.id_user = friendId\n' +
            'WHERE telephone = ?')
            prep.get(userPhone, friendPhone, (err, result) => {
                if (err) throw err;
                if (result) { 
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        })
    })
}

var InsertNewChat = (userId, friendId) => {
    db.serialize(() => {     
        var prep = db.prepare('INSERT INTO user_has_friend(id_user, id_friend) VALUES (?, ?);')
        prep.run(userId, friendId,  (err, res) => {
            if (err) throw err;
        })
    })
}

var DeleteChat = (userId, friendId) => {
    db.serialize(() => {
        var prepSql = db.prepare('DELETE FROM user_has_friend WHERE (id_user = ?) AND (id_friend = ?);')
        prepSql.run(userId, friendId, (err, res) => {
            if (err) throw err;
        })
    })
}

var InsertNewMessage = (from, to, msg, date) => {
    db.serialize(() => {     
        var prep = db.prepare('INSERT INTO message_history(sender, receiver, message, date)'
        + 'VALUES (?, ?, ?, ?);')
        prep.run(from, to, msg, date)
    })
}

var GetMessageHistory = (userPhone, friendPhone) => {
    var prepSql = db.prepare('SELECT sender, receiver, message, date FROM message_history\n' +
    'WHERE (sender = ? AND receiver = ?)\n' +
    'OR (receiver = ? AND sender = ?)\n' +
    'ORDER BY date ASC;\n')
    return new Promise((resolve) => {
        db.serialize(() => {
            prepSql.all(userPhone, friendPhone, userPhone, friendPhone, (err, result) => {
                resolve(result)
            })
        })
    })  
}

module.exports = {GetUserInfoByNumber,
                 InsertNewUser,
                 GetUsersInfoByNumber,
                 CheckHasChat,
                 GetUsersIdByNumber,
                 InsertNewChat,
                 GetChatList,
                 DeleteChat,
                 InsertNewMessage,
                 GetMessageHistory
                };