import { Router } from "express";
import { AuthService, invalidCredentialsError } from "../services/auth-services";

export const authRoutes = Router();

authRoutes.post('/login', async (req,res) => {
    const { email, password } = req.body;
    const authService = new AuthService();
    try{
    const token = await authService.login(email, password);
    res.json({token});
    }catch(e){
        console.log(e);
        if(e instanceof invalidCredentialsError){
            res.status(401).json({message: 'Invalid Credentials'});
        }
        res.status(500).json({message: 'Unexpected Error occurred'});
    }
});
