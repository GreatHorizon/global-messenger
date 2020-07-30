DROP TABLE IF EXISTS "user_has_friend";
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS "message_history";

CREATE TABLE "user" (
	"id_user"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"telephone"	TEXT NOT NULL UNIQUE,
	"name"	TEXT NOT NULL,
	"crypted_password"	TEXT NOT NULL,
	"salt_password"	TEXT NOT NULL
);

CREATE TABLE "user_has_friend" (
	"id_user_has_friend"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"id_user"	INTEGER NOT NULL,
	"id_friend"	INTEGER NOT NULL,
	FOREIGN KEY("id_user") REFERENCES "user"("id_user"),
	FOREIGN KEY("id_friend") REFERENCES "user"("id_user")
);

CREATE TABLE "message_history" (
	"id_message_history"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"sender"	TEXT NOT NULL,
	"receiver"	TEXT NOT NULL,
	"message" TEXT NOT NULL,
	"date" TEXT NOT NULL
);

CREATE UNIQUE INDEX iu_telephone_user
ON user (telephone);

CREATE INDEX ix_id_friend_user_has_friend
ON user_has_friend (id_friend);

CREATE INDEX ix_id_friend_user_has_friend
ON user_has_friend (id_friend);

CREATE INDEX ix_id_user_id_friend_user_has_friend
ON user_has_friend (id_user, id_friend);


<<<<<<< Updated upstream
INSERT INTO user_has_friend(id_user, id_friend) VALUES ('q', 654654);

SELECT userId, friendId FROM
(SELECT user.id_user AS userId, id_friend AS friendId FROM user 
INNER JOIN user_has_friend ON user.id_user = user_has_friend.id_user
WHERE user.telephone = 'q')
INNER JOIN user ON user.id_user = friendId
WHERE telephone = '11'
=======

SELECT *
FROM(SELECT * FROM user
INNER JOIN user_has_friend ON user_has_friend.id_user = user.id_user
WHERE user.telephone = 'q')
INNER JOIN user ON id_friend = user.id_user
//WHERE 


>>>>>>> Stashed changes


SELECT  datetime('now')


SELECT telephone, message, date FROM 
(SELECT * FROM message_history
WHERE (sender = '79024669422' AND receiver = '99999999999') OR (receiver = '99999999999' AND sender = '79024669422')
ORDER BY date ASC)



