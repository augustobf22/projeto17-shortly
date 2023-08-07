import { db } from "../database/database.connection.js"
import { nanoid } from "nanoid";

export async function postShorten(req, res) {
    const token = req.headers.authorization.replace('Bearer ', '');
    const { url } = req.body;

    try {
        const userQuery = await db.query(`SELECT "userId" FROM sessions WHERE token = $1`, [token]);
        const userId = userQuery.rows[0].userId;
        if(!userId || userId === undefined) return res.status(401).send("Token inválido!"); 

        const shortUrl = nanoid();

        const result = await db.query(`INSERT INTO urls ("userId", "originalUrl", "shortUrl", visits) VALUES ($1, $2, $3, $4) RETURNING id;`, [userId, url, shortUrl, 0]);
        const urlId = result.rows[0].id;

        res.status(201).send({ "id": urlId, "shortUrl": shortUrl });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getUrlsById(req, res) {
    const { id } = req.params;

    try {
        const urlQuery = await db.query(`SELECT id, "shortUrl", "originalUrl" AS url FROM urls WHERE id = $1`, [id]);
        if(urlQuery.rowCount === 0) return res.sendStatus(404);

        res.status(200).send(urlQuery.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getShortUrl(req, res) {
    const { shortUrl } = req.params;

    try {
        const urlQuery = await db.query(`SELECT * FROM urls WHERE "shortUrl" = $1`, [shortUrl]);
        if(urlQuery.rowCount === 0) return res.sendStatus(404);

        const originalUrl = urlQuery.rows[0].originalUrl;
        const visits = urlQuery.rows[0].visits;
        const newVisits = Number(visits)+1;

        await db.query(`UPDATE urls SET visits = $2 WHERE "shortUrl" = $1;`,[shortUrl, newVisits]);
        res.redirect(originalUrl);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function deleteUrlById(req, res) {
    const token = req.headers.authorization.replace('Bearer ', '');
    const urlId = req.params.id;

    try {
        const userQuery = await db.query(`SELECT "userId" FROM sessions WHERE token = $1`, [token]);
        const userId = userQuery.rows[0].userId;
        if(!userId) return res.status(401).send("Token inválido!"); 

        const urlQuery = await db.query(`SELECT * FROM urls WHERE id = $1`, [urlId]);
        if(urlQuery.rowCount === 0) return res.status(404).send("URL não encontrada!");
        const userIdByUrl = urlQuery.rows[0].userId;
        if(userId !== userIdByUrl) return res.status(401).send("Essa url não pertence ao usuário!");

        await db.query(`DELETE FROM urls WHERE id = $1`, [urlId]);
        res.status(204).send("URL deletada!");
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getRanking(req, res) {
    try {
        
    } catch (err) {
        res.status(500).send(err.message);
    }
}