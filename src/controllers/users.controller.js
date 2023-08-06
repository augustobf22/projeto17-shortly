import { db } from "../database/database.connection.js"

export async function getMe(req, res) {
    const token = req.headers.authorization.replace('Bearer ', '');

    try {
        const userId = await db.query(`SELECT userId FROM sessions WHERE token = $1`, [token]);
        if(!userId) return res.status(401).send("Token inválido!"); 
        
        const userInfo = await db.query(`SELECT u.name, urls.id, urls.shortUrl, urls.originalUrl, urls.visit
                        FROM users u
                        WHERE id = $1 
                        JOIN urls
                        ON urls.userId = users.id`);

        let totalVisits = 0;

        let shortenedUrls= [];
        for (let i=0; i<userInfo.rowCount; i++){
            const u = userInfo.rows[i];
            const tempShortened = {
                id: u.urls.id,
                shorUrl: u.urls.shortUrl,
                url: u.urls.originalUrl,
                visitCount: u.urls.visit
            }; 
            shortenedUrls.push(tempShortened);
            totalVisits+=Number(u.urls.visit);
        };

        const userFormatted = {
            id: userId,
            name: userInfo.rows[0].u.name,
            visitCount: totalVisits,
            shortenedUrls: shortenedUrls
        };
        
        res.status(200).send(userFormatted);
    } catch (err) {
        res.status(500).send(err.message);
    }
}