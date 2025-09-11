import express from "express";
import cors from "cors";
import twilio from "twilio";
import sgMail from "@sendgrid/mail";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  const msg = {
    to: email,
    from: process.env.FROM_EMAIL,
    subject: "Thank you for subscribing!",
    text: "You’ve successfully subscribed to our newsletter.",
    html: "<strong>Welcome aboard! 🎉</strong><p>You’ll start receiving updates soon.</p>",
  };

  try {
    await sgMail.send(msg);
    res.json({ success: true, message: "Email sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/signup", async (req, res) => {
  const { fullName, country, phone, email, password } = req.body;

  try {
    const customerId = "CUS" + Math.floor(100000 + Math.random() * 900000);

    const msg = {
      to: email,
      from: process.env.FROM_EMAIL,
      subject: "Welcome to AiShopClone 🎉",
      html: `
        <h2>Hello ${fullName},</h2>
        <p>Thank you for signing up! 🎊</p>
        <p>Your <strong>Customer ID</strong> is: <b>${customerId}</b></p>
        <p>Keep this ID safe for future reference.</p>
      `,
    };

    await sgMail.send(msg);

    res.json({ success: true, customerId });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Reservation Deposit",
              description: "Reserve your plan now for $79",
            },
            unit_amount: 79 * 100, // $79 → cents
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/success", // where user goes after successful payment
      cancel_url: "http://localhost:3000/cancel",   // if they cancel checkout
    });

    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
