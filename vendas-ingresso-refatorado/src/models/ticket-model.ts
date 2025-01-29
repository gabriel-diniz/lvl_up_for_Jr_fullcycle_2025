import { DataBase } from "../database";
import { ResultSetHeader, RowDataPacket } from "mysql2";

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

    static async update(){}
    static async delete(){}

    fill(data: Partial<TicketModel>): void{
        if(data.id !== undefined) this.id = data.id;
        if(data.location !== undefined) this.location = data.location;
        if(data.price !== undefined) this.price = data.price;
        if(data.status !== undefined) this.status = data.status;
        if(data.created_at !== undefined) this.created_at = data.created_at;
        if(data.event_id !== undefined) this.event_id = data.event_id;
    }
}