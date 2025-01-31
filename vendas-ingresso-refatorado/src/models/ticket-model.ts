import { DataBase } from "../database";
import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";

export enum TicketStatus {
    available = "available",
    sold = "sold",
}

export class TicketModel{
    id: number;
    location: string;
    price: number;
    status: TicketStatus;
    created_at: Date;
    event_id: number;
    constructor(data: Partial<TicketModel> = {}){
        this.fill(data);
    }
    static async create(data: {
        location: string;
        price: number;
        status: TicketStatus;
        event_id: number;
    }): Promise<TicketModel>{
        const db = DataBase.getInstance();
        const created_at = new Date();
        const [result] = await db.execute<ResultSetHeader>(
            "INSERT INTO tickets (location, price, status, created_at, event_id) VALUES (?, ?, ?, ?, ?)",
            [data.location, data.price, data.status, created_at, data.event_id]
        );
        const ticket = new TicketModel({
            ...data,
            created_at,
            id: result.insertId
        });
        return ticket;
    }
    static async createMany(data: {
        location: string;
        price: number;
        status: TicketStatus;
        event_id: number;
    }[]
    ): Promise<TicketModel[]>{
        const db = DataBase.getInstance();
        const created_at = new Date();
        const values = Array(data.length).fill("(?, ?, ?, ?, ?)").join(", ");
        const params = data.reduce<(string | number | Date)[]>(
            (acc, ticket) => [
                ...acc,
                ticket.location,
                ticket.price,
                ticket.status,
                created_at,
                ticket.event_id,
            ],
            []
        );
        const [result] = await db.execute<ResultSetHeader>(
            `INSERT INTO tickets (location, price, status, created_at, event_id) VALUES ${values}`,
            params
        );
        const tickets = data.map(
            (ticket, index) =>
                new TicketModel({
                    ...ticket,
                    created_at,
                    id: result.insertId + index
                })
        );
        return tickets;
    }
    static async findById(id: number): Promise<TicketModel | null> {
        const db = DataBase.getInstance();
        const [rows] = await db.execute<RowDataPacket[]>(
            "SELECT * FROM tickets WHERE id = ?",
            [id]
        );
        return rows.length ? new TicketModel(rows[0] as TicketModel) : null;
    }
    static async findAll(filter?: {
        where?: { event_id?: number; ids?: number[] };
    }, options?: { connection?: PoolConnection}): Promise<TicketModel[]> {
        const db = options?.connection ?? DataBase.getInstance();
        let query = "SELECT * FROM tickets";
        const params = [];
        if (filter && filter.where){
            const where = [];
            if(filter.where.event_id){
                where.push("event_id = ?");
                params.push(filter.where.event_id);
            }
            if(filter.where.ids){
                where.push(`id IN (${filter.where.ids.map(() => "?").join(", ")})`);
                params.push(...filter.where.ids)
            }
            query += ` WHERE ${where.join(" AND ")}`;
        }
        const [rows] = await db.execute<RowDataPacket[]>(query, params);
        return rows.map((row) => new TicketModel(row as TicketModel));
    }
    async update(): Promise<void>{
        const db = DataBase.getInstance();
        const [result] = await db.execute<ResultSetHeader>(
            'UPDATE tickets SET location = ?, price = ?, status = ?, event_id = ? WHERE id = ?',
            [this.location, this.price, this.status, this.event_id, this.id]
        );
        if(result.affectedRows === 0){
            throw new Error("Tickets not found");
        }
    }
    async delete(): Promise<void>{
        const db = DataBase.getInstance();
        const [result] = await db.execute<ResultSetHeader>(
            'DELETE FROM tickets WHERE id = ?',
            [this.id]
        );
        if(result.affectedRows === 0){
            throw new Error("Tickets not found");
        }
    }
    fill(data: Partial<TicketModel>): void{
        if(data.id !== undefined) this.id = data.id;
        if(data.location !== undefined) this.location = data.location;
        if(data.price !== undefined) this.price = data.price;
        if(data.status !== undefined) this.status = data.status;
        if(data.created_at !== undefined) this.created_at = data.created_at;
        if(data.event_id !== undefined) this.event_id = data.event_id;
    }
}