import { db } from "../database/database.connection.js"

export async function getMe(req, res) {
    const token = req.headers.authorization.replace('Bearer ', '');

    try {
        const userQuery = await db.query(`SELECT "userId" FROM sessions WHERE token = $1`, [token]);
        const userId = userQuery.rowCount !== 0 ? userQuery.rows[0].userId : undefined;
        if(userId === undefined) return res.status(401).send("Token inválido!"); 
        
        const userInfo = await db.query(`SELECT
                                            users.id, 
                                            users.name, 
                                            sum(urls.visits) AS "visitCount",
                                            json_agg(json_build_object(
                                                'id', urls.id, 
                                                'shortUrl', urls."shortUrl", 
                                                'url', urls."originalUrl", 
                                                'visitCount', urls.visits)) as "shortenedUrls" 
                                        FROM users
                                        JOIN urls ON urls."userId" = users.id
                                        GROUP BY users.id`);
        const userFormatted = userInfo.rows[0];
        res.status(200).send(userFormatted);
    } catch (err) {
        res.status(500).send(err.message);
    }
}