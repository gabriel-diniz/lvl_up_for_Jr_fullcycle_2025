import { EventModel } from "../models/event-model";
import { TicketModel, TicketStatus } from "../models/ticket-model";

export class TicketService{
    async createMany(data: { eventId: number, numTickets: number; price: number}){
        const event = await EventModel.findById(data.eventId);
        if(!event){
            throw new Error('Event not found');
        }
        const ticketsData = Array(data.numTickets).fill({}).map((_, index) => ({
            location: `Loction ${index}`,
            price: data.price,
            status: TicketStatus.available,
            event_id: event.id,  
        }));
        await TicketModel.createMany(ticketsData);
    }
}