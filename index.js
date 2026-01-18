import "dotenv/config";
import app from "./src/app.js";
import { startElevatorUpdater } from "./src/services/elevator/elevator.updater.js";

const PORT = process.env.PORT || 3000;

startElevatorUpdater();

app.listen(PORT, () => {
  console.log(`🚀 Server listening on ${PORT}`);
});
