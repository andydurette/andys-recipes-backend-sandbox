import "dotenv/config.js";

export const config = {
    REGION: process.env.REGION,
    USER_POOL_ID: process.env.USER_POOL_ID,
    APP_CLIENT_ID: process.env.APP_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.IDENTITY_POOL_ID,
    TEST_USER_NAME: process.env.TEST_USER_NAME,
    TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD,
}
