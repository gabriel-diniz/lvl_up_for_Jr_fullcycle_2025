import * as mysql from 'mysql2/promise';

export class DataBase {
    private static instance: mysql.Pool;

    private constructor(){}

    public static getInstance(): mysql.Pool{
        if(!DataBase.instance){
            DataBase.instance = mysql.createPool({
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'tickets',
                port: 33060,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
            });
        }
        return DataBase.instance;
    }
}