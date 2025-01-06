import dotenv from 'dotenv';
dotenv.config();


const config = {
    port: process.env.PORT || 6900,
    throttleLimit: process.env.THROTTLE_LIMIT || 100,
    throttleWindow: process.env.THROTTLE_WINDOW || 15,  // in minutes
    jwtSecret: process.env.JWT_SECRET || 'horizon-secret',
};

export default config;