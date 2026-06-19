import app,{PORT, DUMMY } from "./src/app";
//IMPORTING SAME VARIABLE 
import { PORT as API_PORT } from "./src/configs/constant";
import { connectToMongoDB} from "./src/database/mongodb";

// Attempt to connect to MongoDB but don't crash the process if it fails.
connectToMongoDB().catch((err) => {
    console.error("Warning: MongoDB connection failed:", err.message || err);
});

app.listen(
    PORT,  // start backend in this PORT
    () => {
        console.log(`Server: http://localhost:${API_PORT}`); // backtick
    }
);
// execute: npx tsx --watch index.ts
// http://localhost:8089