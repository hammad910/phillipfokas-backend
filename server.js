import express from "express";
import cors from "cors";
import twilio from "twilio";
import sgMail from "@sendgrid/mail";
import Stripe from "stripe";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.static(path.join(__dirname, "public")));
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
  const { fullName, country, phone, email, password, UID } = req.body;

  try {
    

    const msg = {
      to: email,
      from: process.env.FROM_EMAIL,
      subject: "Welcome to AiShopClone 🎉",
      html: `
    <div style="background: #1a1625; padding: 40px; font-family: Arial, sans-serif; text-align: center; color: #f5f5fa;">
      
  <!-- Card -->
  <div style="max-width: 480px; margin: auto; background: rgba(20,19,26,0.8); border-radius: 20px; border: 1px solid rgba(162, 113, 255, 0.2); padding: 32px;">
    
    <img src="https://res.cloudinary.com/ddk3leh9p/image/upload/v1757619730/logo_kcn2w8.png" 
     alt="AiShopClone" 
     width="180" 
     style="display:block; margin:0 auto 16px auto; max-width:180px; height:auto;" />

    <p style="margin: 8px 0 24px; font-size: 14px; color: #aaa;">YOUR MIND YOUR CREATION</p>
    
    <!-- Main Heading -->
    <h3 style="margin: 0; font-size: 20px; font-weight: 700; color: #fff;">CONGRATULATIONS<br>YOU'RE IN</h3>
    
    <p style="margin: 12px 0 28px; font-size: 16px; font-weight: 500; color: #a271ff;">
      Welcome to the Future of Business Automation
    </p>
    
    <!-- Call to Action Box -->
    <div style="background: linear-gradient(90deg, #a271ff, #6b4eff); border-radius: 12px; padding: 20px; margin: 20px 0;">
      <h4 style="margin: 0; font-size: 18px; font-weight: 700; color: #fff;">Time to get excited and be prepared!</h4>
      <p style="margin: 8px 0 0; font-size: 14px; color: #f5f5fa;">Your journey to automated success begins now</p>
    </div>

    <!-- Professional Tier Section -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;">
      <tr>
        <td style="background:#1b1822; border-radius:12px; padding:20px; border:1px solid #a271ff; text-align:left;">
          <h4 style="margin:0 0 10px; font-size:18px; font-weight:700; color:#f5f5fa;">Professional Tier</h4>
          <p style="margin:0 0 16px; font-size:16px; font-weight:700; color:#31d67b;">25% Discount Applied!</p>

          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px;">
            <tr>
              <td style="background:#3d320f; border-radius:8px; padding:16px;">
                <p style="margin:0; font-size:14px; font-weight:600; color:#f5f5fa;">Your Balance to Complete Setup:</p>
                <h2 style="margin:8px 0 0; font-size:28px; font-weight:800; color:#ffd84d;">$567.75</h2>
              </td>
            </tr>
          </table>

          <p style="margin:0; font-size:14px; color:#bbb;">Original Price: $646.75 | You Save: $248.75</p>
        </td>
      </tr>
    </table>

    <!-- Launch Date Section -->
    <div style="background: linear-gradient(90deg, #ff6b6b, #ff9f43); border-radius: 12px; padding: 20px; margin: 20px 0;">
      <h4 style="margin: 0; font-size: 18px; font-weight: 700; color: #fff;">Launch Date: September 28th</h4>
      <p style="margin: 8px 0 0; font-size: 14px; color: #fff;">Your UID is critical for launch day access</p>
    </div>

    <!-- Next Steps Section -->
    <div style="text-align:left; margin:30px 0 0;">
      <h3 style="margin:0 0 20px; font-size:18px; font-weight:700; color:#f5f5fa; text-align:center; font-size: 20px; font-weight: 700;">Your Next Steps to Success</h3>
      
      <!-- Step 1 -->
      <div style="background:#1b1822; border-radius:12px; padding:16px; margin-bottom:16px; border:1px solid rgba(162,113,255,0.2);">
        <p style="margin:0; font-size:14px; color:#f5f5fa;">
          <strong style="color:#a271ff;">1 Access Your Portal</strong><br>
          Go to your personalized portal and enter your unique ID: 
          <span style="background:#2e2a3d; color:#fff; padding:4px 8px; border-radius:6px; font-size:13px; font-weight:600; display:inline-block; margin-top:4px;">
            ${UID}
          </span>
        </p>
      </div>

      <!-- Step 2 -->
      <div style="background:#1b1822; border-radius:12px; padding:16px; margin-bottom:16px; border:1px solid rgba(162,113,255,0.2);">
        <p style="margin:0; font-size:14px; color:#f5f5fa;">
          <strong style="color:#a271ff;">2 Verify Your Email</strong><br>
          Enter the same email address you used for your holding deposit: 
          <span style="color:#a271ff; font-weight:600;">AiShopClone@gmail.com</span>
        </p>
      </div>

      <!-- Step 3 -->
      <div style="background:#1b1822; border-radius:12px; padding:16px; margin-bottom:16px; border:1px solid rgba(162,113,255,0.2);">
        <p style="margin:0; font-size:14px; color:#f5f5fa;">
          <strong style="color:#a271ff;">3 Complete Your Profile</strong><br>
          Enter your full name: <span style="font-weight:600;">Ai Shop Clone User</span>
        </p>
      </div>

      <!-- Step 4 -->
      <div style="background:#1b1822; border-radius:12px; padding:16px; margin-bottom:16px; border:1px solid rgba(162,113,255,0.2);">
        <p style="margin:0; font-size:14px; color:#f5f5fa;">
          <strong style="color:#a271ff;">4 Pay Your Balance</strong><br>
          Complete your payment of <span style="color:#ffd84d; font-weight:700;">$449.25</span><br>
          <span style="font-size:13px; color:#bbb;">(automatically calculated with your 25% discount)</span>
        </p>
      </div>

      <!-- Step 5 -->
      <div style="background:#1b1822; border-radius:12px; padding:16px; border:1px solid rgba(162,113,255,0.2);">
        <p style="margin:0; font-size:14px; color:#f5f5fa;">
          <strong style="color:#a271ff;">5 YOUR MIND YOUR CREATION</strong><br>
          Portal setup complete! Your automated business system will be ready for launch on September 28th.
        </p>
      </div>
    </div>

     <div style="background: rgba(20,19,26,0.8); border: 1px solid rgba(162, 113, 255, 0.2); border-radius: 16px; padding: 24px; text-align: center;">

    <!-- Heading -->
    <h3 style="margin: 0 0 12px; margin-top: 6px; font-size: 20px; font-weight: 700; color: #31d67b;">
      AI Agent Help System
    </h3>

    <!-- Description -->
    <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #f5f5fa;">
      Need assistance? Our advanced AI agents are available 24/7 to guide you through every step of the process. Simply ask any question in your portal, and our intelligent system will provide instant, personalized help to ensure your success.
    </p>

    <!-- CTA Button -->
<a href="#"
   style="display:inline-block; width:100%; max-width:280px; text-align:center; 
          padding:14px 28px; border-radius:12px; font-size:16px; font-weight:700; 
          text-decoration:none; color:#ffffff; 
          background:linear-gradient(90deg, #a271ff, #6b4eff); 
          box-shadow:0 8px 20px rgba(162,113,255,0.3); 
          font-family:Arial, sans-serif;">
  Access Your Portal Now
</a>

  </div>

  <!-- Footer -->
  <div style="background: #1b1822; border-radius: 12px; padding: 20px; margin-top: 20px; text-align: center; border: 1px solid rgba(162,113,255,0.2);">
    <img src="https://res.cloudinary.com/ddk3leh9p/image/upload/v1757619730/logo_kcn2w8.png" 
     alt="AiShopClone" 
     width="180" 
     style="display:block; margin:0 auto 16px auto; max-width:180px; height:auto;" />
    <p style="margin: 0 0 12px; font-size: 13px; color: #aaa;">YOUR MIND YOUR CREATION</p>

    <p style="margin: 0; font-size: 13px; color: #bbb;">
      This email was sent to confirm your Professional tier subscription.<br>
      Questions? Our AI support system is ready to help you succeed.
    </p>

    <p style="margin: 16px 0 0; font-size: 13px; color: #a271ff; font-weight:600;">
      ${UID} | Launch: September 28st
    </p>
  </div>

  </div>
</div>


    `,
    };

    await sgMail.send(msg);

    res.json({ success: true, UID });
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
      cancel_url: "http://localhost:3000/cancel", // if they cancel checkout
    });

    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
