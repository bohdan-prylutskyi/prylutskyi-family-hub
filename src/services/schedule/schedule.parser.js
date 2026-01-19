import sharp from "sharp";
import dayjs from "dayjs";

/**
 * Парсить графік відключень зі збереженої картинки
 *
 * @param {string} imagePath - шлях до картинки
 * @param {Object} options
 * @param {string} options.rowLabel - наприклад '4.1'
 * @param {boolean} options.debug - зберігати debug-клітинки
 */
export async function parseOutageSchedule(imagePath, { rowLabel = "4.1", debug = false } = {}) {
  const ROWS_Y_NORMALIZED = {
    1.1: 0.2,
    2.1: 0.4,
    4.1: 0.6,
  };

  const NUM_COLS = 48;
  const ROI_START_X = 0.1;
  const ROI_END_X = 0.99;
  const ROW_SCAN_HEIGHT = 10;

  if (!ROWS_Y_NORMALIZED[rowLabel]) {
    throw new Error(`Unknown rowLabel: ${rowLabel}`);
  }

  const image = sharp(imagePath);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Invalid image metadata");
  }

  const width = metadata.width;
  const height = metadata.height;
  const channels = metadata.channels;

  // Y координата потрібного рядка
  const targetY = Math.floor(height * ROWS_Y_NORMALIZED[rowLabel]);

  // ROI по X
  const roiLeft = Math.floor(width * ROI_START_X);
  const roiRight = Math.floor(width * ROI_END_X);
  const roiWidth = roiRight - roiLeft;

  // Вирізаємо вузьку смугу
  const buffer = await sharp(imagePath)
    .extract({
      left: roiLeft,
      top: targetY - Math.floor(ROW_SCAN_HEIGHT / 2),
      width: roiWidth,
      height: ROW_SCAN_HEIGHT,
    })
    .raw()
    .toBuffer();

  const slots = [];
  const minutesPerSlot = 30;

  for (let i = 0; i < NUM_COLS; i++) {
    const x = Math.floor((roiWidth / NUM_COLS) * (i + 0.5));
    const y = Math.floor(ROW_SCAN_HEIGHT / 2);

    const idx = (y * roiWidth + x) * channels;

    const r = buffer[idx];
    const g = buffer[idx + 1];
    const b = buffer[idx + 2];

    const state = classifyColor(r, g, b);

    slots.push({
      index: i,
      from: minutesToTime(i * minutesPerSlot),
      to: minutesToTime((i + 1) * minutesPerSlot),
      state,
    });
  }

  return slots;
}

function classifyColor(r, g, b) {
  if (r > 150 && g < 100 && b < 100) return "off";
  if (g > 150 && r < 100 && b < 100) return "on";
  if (r > 150 && g > 150 && b < 120) return "transition";
  return "unknown";
}

function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return dayjs().hour(h).minute(m).format();
}
