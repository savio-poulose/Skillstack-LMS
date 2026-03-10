const express = require("express");
const router = express.Router();

const Contact = require("../models/contact.model");
const authMiddleware = require("../middlewares/auth");

/* =========================
   CREATE MESSAGE (PUBLIC)
========================= */

router.post("/", async (req, res) => {
  try {

    const { name, email, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      message
    });

    res.json({
      message: "Message sent successfully",
      contact
    });

  } catch (error) {

    console.error(error);
    console.error("CONTACT ERROR:", error); 

    res.status(500).json({
      message: "Failed to send message"
    });

  }
});


/* =========================
   ADMIN FETCH MESSAGES
========================= */

router.get("/admin", authMiddleware, async (req, res) => {
  try {

    const messages = await Contact.find()
      .sort({ createdAt: -1 });

    res.json(messages);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch messages"
    });

  }
});

module.exports = router;