import express from "express";
import fs from "fs";
import path from "path";
import morgan from "morgan";
import { createStream as rfs } from "rotating-file-stream";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import moment from "moment";

// Setup log directory
let logDirectory = path.join(__dirname, "../../", "logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Configure access logs stream
let accessLogStream = rfs("access.log", {
  interval: "1d",
  path: logDirectory,
});

// Log filter
let logFilter = winston.format((info, opts) => info);

// Log format
let logFormat = winston.format.printf(info => {
  let message = `${moment().format('YYYY-MM-DD HH:mm:ss')} - [${info.level.toUpperCase()}]: ${info.message}`;
  if (info.stack) {
    message += "\n  " + info.stack;
  }

  return message;
});

// Log transport
let logTransport = new (winston.transports.DailyRotateFile)({
  dirname: logDirectory,
  filename: "template-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "15d",
  json: false,
  level: "debug",
});

/**
 * Config session for app
 * @param {express.Express} app from exactly express module
 */
let configLogger = (app) => {
  app.use(morgan("combined", { stream: accessLogStream }));

  // Configure debug log
  winston.configure({
    format: winston.format.combine(logFilter(), winston.format.splat(), winston.format.timestamp({}), logFormat),
    transports: [ logTransport ],
    exitOnError: false,
  });
};

export default configLogger;
