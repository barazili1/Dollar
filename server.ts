import express from "express";
import path from "path";
import multer from "multer";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// API Routes
const telegramCheckSchema = z.object({
  username: z.string().min(1).max(64),
});

app.post("/api/public/check-telegram", async (req, res) => {
  let username: string;
  try {
    const parsed = telegramCheckSchema.parse(req.body);
    username = parsed.username.replace(/^@/, "").trim();
  } catch {
    return res.status(400).json({ exists: false, error: "invalid" });
  }

  if (!/^[A-Za-z0-9_]{5,32}$/.test(username)) {
    return res.json({ exists: false, reason: "format" });
  }

  try {
    const tgRes = await fetch(`https://t.me/${username}`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; TelegramCheck/1.0)" },
    });
    if (!tgRes.ok) return res.json({ exists: false, reason: "not_found" });
    const html = await tgRes.text();
    const exists = html.includes("tgme_page_title") || html.includes("tgme_page_photo");
    return res.json({ exists, reason: exists ? "ok" : "not_found" });
  } catch (err) {
    console.error("Telegram username check failed:", err);
    // Fail open so users are not blocked by network issues
    return res.json({ exists: true, reason: "check_unavailable" });
  }
});

app.post(
  "/api/public/submit-verification",
  upload.fields([
    { name: "depositImage", maxCount: 1 },
    { name: "idImage", maxCount: 1 },
  ]),
  async (req, res) => {
    const botToken =
      process.env.TELEGRAM_BOT_TOKEN ||
      "8930769624:AAHTxqCaBRSbeaEXAkvFOj32b6axRSZDWSs";
    const chatId = process.env.TELEGRAM_CHAT_ID || "8900261197";

    const userId = (req.body.userId || "").slice(0, 200);
    const telegramUsername = (req.body.telegramUsername || "").slice(0, 200);
    const selectedGame = (req.body.selectedGame || "").slice(0, 50);
    const timestamp = (req.body.timestamp || "").slice(0, 200);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const deposit = files?.depositImage?.[0];
    const idImg = files?.idImage?.[0];

    const gameDisplayName =
      selectedGame === "apple"
        ? "تفاحة الحظ (Apple of Fortune)"
        : selectedGame === "mines"
        ? "الألغام (Gems Mines)"
        : selectedGame || "VIP Script";

    const formattedTime =
      timestamp ||
      new Date().toLocaleString("ar-EG", {
        timeZone: "Africa/Cairo",
        dateStyle: "full",
        timeStyle: "medium",
      });

    const caption = `طلب تفعيل جديد 🔔
━━━━━━━━━━━━━━━━━
🆔 ID: ${userId || "غير محدد"}
👤 يوزر التلجرام: ${telegramUsername.startsWith("@") ? telegramUsername : `@${telegramUsername}`}
🎮 اللعبة: ${gameDisplayName}
⏰ الوقت: ${formattedTime}`;

    if (!botToken || !chatId) {
      console.warn("TELEGRAM_BOT_TOKEN / CHAT_ID not set. Logging locally:", {
        userId,
        telegramUsername,
        selectedGame,
        depositSize: deposit?.size,
        idImgSize: idImg?.size,
      });
      return res.json({ success: true, telegramSent: false });
    }

    try {
      if (deposit && idImg) {
        // Send both photos in a single media group album with caption under them
        const mediaForm = new FormData();
        mediaForm.append("chat_id", chatId);
        mediaForm.append(
          "media",
          JSON.stringify([
            {
              type: "photo",
              media: "attach://deposit_file",
              caption: caption,
            },
            {
              type: "photo",
              media: "attach://id_file",
            },
          ])
        );
        mediaForm.append(
          "deposit_file",
          new Blob([deposit.buffer], { type: deposit.mimetype }),
          deposit.originalname || "deposit-image.jpg"
        );
        mediaForm.append(
          "id_file",
          new Blob([idImg.buffer], { type: idImg.mimetype }),
          idImg.originalname || "id-image.jpg"
        );

        const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMediaGroup`, {
          method: "POST",
          body: mediaForm,
        });

        if (!tgRes.ok) {
          const errText = await tgRes.text();
          console.error("Telegram sendMediaGroup failed:", errText);
        }
      } else if (deposit || idImg) {
        // Send single photo with caption
        const fileToSend = deposit ?? idImg;
        if (fileToSend) {
          const photoForm = new FormData();
          photoForm.append("chat_id", chatId);
          photoForm.append("caption", caption);
          photoForm.append(
            "photo",
            new Blob([fileToSend.buffer], { type: fileToSend.mimetype }),
            fileToSend.originalname || "verification-image.jpg"
          );

          const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
            method: "POST",
            body: photoForm,
          });

          if (!tgRes.ok) {
            const errText = await tgRes.text();
            console.error("Telegram sendPhoto failed:", errText);
          }
        }
      } else {
        // Fallback to text message if no photos attached
        const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: caption }),
        });

        if (!tgRes.ok) {
          const errText = await tgRes.text();
          console.error("Telegram sendMessage failed:", errText);
        }
      }

      return res.json({ success: true, telegramSent: true });
    } catch (err) {
      console.error("Telegram verification send failed:", err);
      return res.json({
        success: true,
        telegramSent: false,
        warning: "Logged locally, Telegram forwarding error",
      });
    }
  }
);

// Serve frontend via Vite middleware (dev) or static files (prod)
async function setupFrontend() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupFrontend().catch((err) => {
  console.error("Failed to start server:", err);
});
