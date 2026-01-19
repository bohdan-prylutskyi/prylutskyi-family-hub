import "dotenv/config";
import app from "./src/app.js";
import { startScheduleUpdater } from "./src/services/schedule/schedule.updater.js";

const PORT = process.env.PORT || 3000;

startScheduleUpdater();

app.listen(PORT, () => {
  console.log(`🚀 Server listening on ${PORT}`);
});
