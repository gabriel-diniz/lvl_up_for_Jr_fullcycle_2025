import { DataBase } from "../database";
import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { UserModel } from "./user-model";

export class CustomerModel {
    id: number;
    user_id: number;
    address: string;
    phone: string;
    created_at: Date;
    user?: UserModel;
    constructor(data: Partial<CustomerModel> = {}){
        this.fill(data);
    }
    static async create(
        data: { user_id: number; address: string, phone: string },
        options?: {connection?: PoolConnection }
    ): Promise<CustomerModel>{
        const db = options?.connection ?? DataBase.getInstance();
        const created_at = new Date();
        const [result] = await db.execute<ResultSetHeader>(
            "INSERT INTO customers (user_id, address, phone, created_at) VALUES (?, ?, ?, ?)",
            [data.user_id, data.address, data.phone, created_at]
        );
        const customer = new CustomerModel({
            ...data,
            created_at,
            id: result.insertId,
        });
        return customer;
    }
    static async findById(id: number, options?: {user?: boolean }): Promise<CustomerModel | null>{
        const db = DataBase.getInstance();
        let query = "SELECT * FROM customers WHERE id = ?";
        if (options?.user){
            query = "SELECT p.*, users.id as user_id, users.name as user_name, users.email as user_email FROM customers p JOIN users ON p.id = users.id WHERE p.id = ?";
        }
        const [rows] = await db.execute<RowDataPacket[]>(query, [id]);
        if(rows.length === 0) return null;
        const customer = new CustomerModel(rows[0] as CustomerModel);
        if(options?.user){
            customer.user = new UserModel({
                id: rows[0].user_id,
                name: rows[0].user_name,
                email: rows[0].user_email
            });
        }
        return customer;
    }
    static async findByUserId(userId: number, options?: {user?: boolean }): Promise<CustomerModel | null>{
        const db = DataBase.getInstance();
        let query = "SELECT * FROM customers WHERE user_id = ?";
        if (options?.user){
            query = "SELECT p.*, users.id as user_id, users.name as user_name, users.email as user_email FROM customers p JOIN users ON p.user_id = users.id WHERE p.user_id = ?";
        }
        const [rows] = await db.execute<RowDataPacket[]>(query, [userId]);
        if(rows.length === 0) return null;
        const customer = new CustomerModel(rows[0] as CustomerModel);
        if(options?.user){
            customer.user = new UserModel({
                id: rows[0].user_id,
                name: rows[0].user_name,
                email: rows[0].user_email
            });
        }
        return customer;
    }
    static async findAll(): Promise<CustomerModel[]>{
        const db = DataBase.getInstance();
        const [rows] = await db.execute<RowDataPacket[]>("SELECT * FROM customers");
        return rows.map((row) => new CustomerModel(row as CustomerModel));
    }
    async update(): Promise<void>{
        const db = DataBase.getInstance();
        const [result] = await db.execute<ResultSetHeader>(
            'UPDATE customers SET user_id = ?, address = ?, phone = ? WHERE id = ?',
            [this.user_id, this.address, this.phone, this.id]
        );
        if(result.affectedRows === 0){
            throw new Error("Customer not found");
        }
    }
    async delete(): Promise<void>{
        const db = DataBase.getInstance();
        const [result] = await db.execute<ResultSetHeader>(
            'DELETE FROM customers WHERE id = ?',
            [this.id]
        );
        if(result.affectedRows === 0){
            throw new Error("Customer not found");
        }
    }
    fill(data: Partial<CustomerModel>): void {
        if (data.id !== undefined) this.id = data.id;
        if (data.user_id !== undefined) this.user_id = data.user_id;
        if (data.address !== undefined) this.address = data.address;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.created_at !== undefined) this.created_at = data.created_at;
    }
}