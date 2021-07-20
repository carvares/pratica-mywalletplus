import sessionRepository from "../repositories/sessionRepository.js";
import userServices from "../services/userServices.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function signUp(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.sendStatus(400);
        }

        const existingUserWithGivenEmail = await userServices.authenticate(email)

        if (existingUserWithGivenEmail) {
            return res.sendStatus(409);
        }
        const hashedPassword = bcrypt.hashSync(password, 12);
        await sessionRepository.createUser(name, email, hashedPassword)

        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

async function signIn(req,res){
    try {
        const { email, password } = req.body;
    
        if (!email || !password) {
          return res.sendStatus(400);
        }
    
        const user = await userServices.authenticate(email)
        
        if (!user || !bcrypt.compareSync(password, user.password)) {
          return res.sendStatus(401);
        }
    
        const token = jwt.sign({
          id: user.id
        }, process.env.JWT_SECRET);
        
        res.send({
          token
        });

      } catch (err) {
        console.error(err);
        res.sendStatus(500);
      }
}

async function newTransaction(req,res){
    try {
        const authorization = req.headers.authorization || "";
        const token = authorization.split('Bearer ')[1];
    
        if (!token) {
          return res.sendStatus(401);
        }
    
        let user;
    
        try {
          
          user = await userServices.verifyToken(token);
          
        } catch {
          return res.sendStatus(401);
        }
    
        const { value, type } = req.body;
    
        if (!value || !type) {
          return res.sendStatus(400);
        }
    
        if (!['INCOME', 'OUTCOME'].includes(type)) {
          return res.sendStatus(400);
        }
    
        if (value < 0) {
          return res.sendStatus(400);
        }
       await sessionRepository.insertTransaction(user, value, type)
        
    
        res.sendStatus(201);
      } catch (err) {
        console.error(err);
        res.sendStatus(500);
      }
}
async function transactions(req,res){
    try {
        const authorization = req.headers.authorization || "";
        const token = authorization.split('Bearer ')[1];
    
        if (!token) {
          return res.sendStatus(401);
        }
    
        let user;
    
        try {
            user = await userServices.verifyToken(token);
        } catch {
          return res.sendStatus(401);
        }
    
        const events = await sessionRepository.allTransactions(user);
    
        res.send(events);
      } catch (err) {
        console.error(err);
        res.sendStatus(500);
      }
}
async function sumTransactions(req,res){
    try {
        const authorization = req.headers.authorization || "";
        const token = authorization.split('Bearer ')[1];
    
        if (!token) {
          return res.sendStatus(401);
        }
    
        let user;
    
        try {
            user = await userServices.verifyToken(token);
        } catch {
          return res.sendStatus(401);
        }
    
        const events = await sessionRepository.orderingTransactions(user);
        

        const sum = events.reduce((total, event) => event.type === 'INCOME' ? total + event.value : total - event.value, 0);
    
        res.send({ sum });
      } catch (err) {
        console.error(err);
        res.sendStatus(500);
      }
}
export default { signUp,signIn,newTransaction, transactions, sumTransactions };