const crypto = require("crypto");

const validateEnv = () => {
    // 1. Validate required hard variables
    const required = ["MONGO_URI", "YOUTUBE_API_KEY", "YOUTUBE_CHANNEL_ID", "ZOOM_ACCOUNT_ID", "ZOOM_CLIENT_ID", "ZOOM_CLIENT_SECRET"];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        console.error(`\x1b[31m[ERROR]\x1b[0m Missing required environment variables: ${missing.join(", ")}`);
        console.error("Server startup stopped. Please check your .env file.");
        process.exit(1);
    }

    const hasMeetingSdkKey = process.env.SDK_ID || process.env.ZOOM_MEETING_SDK_KEY || process.env.ZOOM_SDK_KEY;
    const hasMeetingSdkSecret = process.env.SDK_SECRET || process.env.ZOOM_MEETING_SDK_SECRET || process.env.ZOOM_SDK_SECRET;
    if (!hasMeetingSdkKey || !hasMeetingSdkSecret) {
        console.error("\x1b[31m[ERROR]\x1b[0m Missing Zoom Meeting SDK credentials. Add SDK_ID and SDK_SECRET, or ZOOM_MEETING_SDK_KEY and ZOOM_MEETING_SDK_SECRET.");
        process.exit(1);
    }

    // 2. Validate JWT_SECRET and generate if missing
    if (!process.env.JWT_SECRET) {
        const generatedSecret = crypto.randomBytes(64).toString("hex");
        
        console.error("\x1b[33m=================================================================\x1b[0m");
        console.error("\x1b[31m[ERROR] JWT_SECRET is missing in environment variables!\x1b[0m");
        console.error("To ensure secure and stable authentication, you must explicitly define it.");
        console.error(`Here is a securely generated 64-byte secret you can use:`);
        console.error(`\x1b[36m${generatedSecret}\x1b[0m`);
        console.error("\nPlease add this to your .env file:");
        console.error(`JWT_SECRET=${generatedSecret}`);
        console.error("\x1b[33m=================================================================\x1b[0m");
        console.error("Server startup stopped. Please configure JWT_SECRET.");
        process.exit(1);
    }
};

module.exports = validateEnv;
