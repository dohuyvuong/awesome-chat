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

/**
 * Get Last message to preview on conversation
 * @param {Array} messages List of messages
 */
let getLastMessageAsPreview = (messages) => {
  if (messages.length > 0) {
    switch (messages[messages.length - 1].messageType) {
      case "text":
        return messages[messages.length - 1].text;
        break;
      case "image":
        return "<i>[Hình ảnh]</i>";
      case "file":
        return "<i>[Tệp tin]</i>";
      default:
        break;
    }
  }

  return "";
};

export default {
  convertBufferToBase64,
  timeToNowAsText: dateUtil.timeToNowAsText,
  getMessageTooltip,
  getLastMessageAsPreview,
};
