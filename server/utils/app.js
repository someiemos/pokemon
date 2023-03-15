import express from "express";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;
