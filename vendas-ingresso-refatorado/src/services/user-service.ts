import { createConnection } from "../database";
import * as mysql from 'mysql2/promise';

export class UserService{
    async findByEmail(email: number){
        const connection = await createConnection();
        try{
            const [rows] = await connection.execute<mysql.RowDataPacket[]>(
                'SELECT * FROM users WHERE email = ?', 
                [email]
            );
            return rows.length ? rows[0] : null;
        }finally{
            await connection.end();
        }
    }
}