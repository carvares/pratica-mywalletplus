import userRepository from "../repositories/userRepository.js"
import jwt from "jsonwebtoken";

async function authenticate(email) {
    const user = await userRepository.findByEmail(email)
    if (user) {
        return user;
    }
    return null
}

async function verifyToken(token) {
    
    const result = await jwt.verify(token, process.env.JWT_SECRET);
    return result
}
export default { authenticate, verifyToken };