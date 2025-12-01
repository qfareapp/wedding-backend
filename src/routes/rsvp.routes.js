import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { members } = req.body || {};

    if (!Array.isArray(members) || !members.length) {
      return res.status(400).json({ message: "Please provide at least one member name." });
    }

    const trimmedNames = members
      .map((m) => (m?.name || "").trim())
      .filter((n) => n);

    if (!trimmedNames.length) {
      return res.status(400).json({ message: "Please provide at least one member name." });
    }

    const names = trimmedNames.join(", ");

    const emailBody = `
Hi,

I/We will be attending your wedding. Congrats on your wedding.
Guests: ${names}

Regards,
Wedding Website
    `;

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_EMAIL_PASS) {
      return res.status(500).json({ message: "Email is not configured on the server." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: "me.pranjal@gmail.com",
      subject: "New RSVP Received",
      text: emailBody,
    });

    res.json({ message: "RSVP Sent Successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send RSVP" });
  }
});

export default router;
