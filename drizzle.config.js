/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://neondb_owner:npg_TKdL6uF4Ppay@ep-shiny-grass-a89xwnw4-pooler.eastus2.azure.neon.tech/neondb?sslmode=require',
    }
};