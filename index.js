require("dotenv").config();
const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const PORT = process.env.PORT || 3000;

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/sendMail", async (req, res) => {
  let mailOptions = {
    from: "",
    to: "receipent email id",
    subject: "Nothing just checking",
    text: "Alright works fine!!",
    attachments: [
      {
        filename: "file.txt",
        content: "Hello World",
        path: "./file.txt",
      },
    ],
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send("Error");
    } else {
      console.log("Email sent: " + info.response);
      res.send("Email sent");
    }
  });
});

app.get("/sendSMS", async (req, res) => {
  client.messages
    .create({
      body: "Hello then!!",
      from: process.env.TWILIO_PHONE_NUMBER,
      to: "receipent phone number",
    })
    .then((message) => {
      console.log(message.sid);
      res.send("Message sent");
    })
    .catch((err) => {
      console.log(err);
      res.send("Error");
    });
});

app.use("*", (req, res) => {
  res.status(404).send("Page not found");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
