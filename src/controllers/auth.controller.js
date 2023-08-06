import { db } from "../database/database.connection.js"
import bcrypt from "bcrypt";
import { v4 as uuid } from 'uuid';

export async function signUp(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    if(password !== confirmPassword) return res.status(422).send("As senhas digitadas não são iguais!");

    try {
        const user = await db.query(`SELECT count(*) FROM users WHERE email = $1`, [email]);

        if (user.rows[0].count > 0) return res.status(409).send("E-mail já cadastrado");

        const hash = bcrypt.hashSync(password, 10);

        await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,[name, email, hash]);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function signIn(req, res) {
    const { email, password } = req.body;

    try {
        const userFound = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if (userFound.rowCount === 0) return res.status(401).send("Usuário não encontrado!");
        
        const user = userFound.rows[0];

        if (bcrypt.compareSync(password, user.password)) {
            const token = uuid();

            await db.query(`INSERT INTO sessions ("userId", token) VALUES ($1, $2)`, [user.id, token]);

            return res.status(200).send({ "token": token });
        } else {
            return res.status(401).send("Senha incorreta!");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
};