import express from "express";
import cors from "cors";
import twilio from "twilio";

const app = express();
app.use(cors());
app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID || "ACxxxxxxxxxxxxxxxxxxxx";
const authToken = process.env.TWILIO_AUTH_TOKEN || "xxxxxxxxxxxxxxxxxxxx";
const twilioNumber = process.env.TWILIO_PHONE_NUMBER || "+1234567890"; // dummy

const client = twilio(accountSid, authToken);

app.post("/send-sms", async (req, res) => {
  const { to, message } = req.body;

  try {
    // Dummy check (skip Twilio call if creds are fake)
    if (accountSid.startsWith("ACxxxx")) {
      console.log("Dummy SMS payload:", { to, from: twilioNumber, message });
      return res.json({ success: true, dummy: true });
    }

    const response = await client.messages.create({
      body: message,
      from: twilioNumber,
      to,
    });

    res.json({ success: true, sid: response.sid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
