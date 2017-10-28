const user = "info@meetin.com.co";
const pass = "Flxl60kbhCe60lCmQXLTig";
const host = "smtp.mandrillapp.com";
const port = 587;
const url = "smtp://" + user + ":" + pass + "@" + host + ":" + port;

process.env.MAIL_URL = url;
