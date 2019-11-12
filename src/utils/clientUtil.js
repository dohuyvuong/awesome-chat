import dateUtil from "./dateUtil";
import { Model } from "mongoose";

/**
 * Convert buffer data to base64
 * @param {ArrayBuffer} buffer
 */
let convertBufferToBase64 = (buffer) => {
  return Buffer.from(buffer).toString("base64");
};

/**
 * Get message tooltip
 * @param {String} currentUserId
 * @param {Model} message
 * @param {Model} sender
 */
let getMessageTooltip = (currentUserId, message, sender) => {
  return (sender._id.toString() == currentUserId ? "Tôi" : sender.username) +
            ', ' + dateUtil.convertTimeAsNumberToText(message.createdAt)
};

export default {
  convertBufferToBase64,
  diffAsText: dateUtil.diffAsText,
  getMessageTooltip,
};
