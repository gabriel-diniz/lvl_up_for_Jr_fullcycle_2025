import { DataBase } from "../database";
import { UserModel } from '../models/user-model';
import { PartnerModel } from '../models/partner-model';

export class PartnerService{
    async register(data: { name: string, email: string, password: string, company_name: string} ){
        const { name, email, password, company_name } = data;
        const connection = await DataBase.getInstance().getConnection();
        try {
            connection.beginTransaction();
            const user = await UserModel.create({name, email, password}, { connection });
            const partner = await PartnerModel.create({
                company_name,
                user_id: user.id,
            }, { connection });
            await connection.commit();
            return {id: partner.id, name, user_id: user.id, company_name, created_at: partner.created_at};
        } catch(e) {
            await connection.rollback();
            throw e;
        }
    }
    async findByUserId(userId: number){
        return PartnerModel.findByUserId(userId);    
    }
}