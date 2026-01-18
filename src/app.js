import express from "express";
import elevatorRouter from "./routes/elevator.routes.js";
import notifyRouter from "./routes/notify.routes.js";

const app = express();

app.use(express.json());

app.use("/elevator", elevatorRouter);
app.use("/notify", notifyRouter);

export default app;
