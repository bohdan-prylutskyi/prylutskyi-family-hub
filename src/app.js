import express from "express";
import scheduleRouter from "./routes/schedule.routes.js";
import notifyRouter from "./routes/notify.routes.js";

const app = express();

app.use(express.json());

app.use("/schedule", scheduleRouter);
app.use("/notify", notifyRouter);

export default app;
