import moment from "moment";

/**
 * Calculate time to now as text
 * @param {Number} timestamp The number value of the time
 */
let timeToNowAsText = (timestamp) => {
  if (!timestamp) {
    return "";
  }

  return moment(timestamp).locale("vi").startOf("seconds").fromNow();
};

/**
 * Convert timestamp to text
 * @param {Number} timestamp The number value of the time
 */
let convertTimeAsNumberToText = (timestamp) => {
  return moment(timestamp).locale("vi").format("HH:mm:ss DD/MM/YYYY");
};

export default {
  timeToNowAsText,
  convertTimeAsNumberToText,
};
