// import { app, server } from './src/socket/socket.js';
import "dotenv/config";
import { dbConnection } from "./src/config/database.config.js";
import { server } from "./src/socket/socket.js";

import express from "express";
import bodyParser from "body-parser";

import corsConfig from "./src/config/cors.config.js";

import { userRouter } from "./src/routes/user.route.js";
import cors from "cors";
import { app } from "./src/socket/socket.js";
import { messageRouter } from "./src/routes/message.routes.js";
import { statusRoute } from "./src/routes/status.route.js";

// Add this line before cors middleware
app.use(express.json());
app.use(corsConfig);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// all routes

app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/status", statusRoute);

app.get("/", (req, res) => {
    res.send("application is run ").json({
        message: "all ok ",
    });
});

const PORT = process.env.PORT || 5000;

dbConnection();

server.listen({ port: PORT, host: "0.0.0.0" }, () => {
    console.log(" your server is running successfully ", PORT);
});
