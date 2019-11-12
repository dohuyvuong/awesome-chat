/**
 * Calculate the diffTime from the timeFrom to the timeTo or now if the timeTo is empty
 * @param {Number} timeFromAsNumber The number value of the date from
 * @param {Number} timeToAsNumber The number value of the date to
 */
let diffAsText = (timeFromAsNumber, timeToAsNumber) => {
  let timeFrom = new Date(timeFromAsNumber);
  let timeTo = timeToAsNumber ?  new Date(timeToAsNumber) : new Date();
  let diffAsText;

  if (timeTo.getFullYear() > timeFrom.getFullYear()) {
    let diffYear = (timeTo.getFullYear() - timeFrom.getFullYear());
    diffAsText = diffYear > 1 ? diffYear + " years ago" : diffYear + " year ago";
  } else if (timeTo.getMonth() > timeFrom.getMonth()) {
    let diffMonth = (timeTo.getMonth() - timeFrom.getMonth());
    diffAsText = diffMonth > 1 ? diffMonth + " months ago" : diffMonth + " month ago";
  } else if (timeTo.getDate() > timeFrom.getDate()) {
    let diffDate = (timeTo.getDate() - timeFrom.getDate());
    diffAsText = diffDate > 1 ? diffDate + " days ago" : diffDate + " day ago";
  } else if (timeTo.getHours() > timeFrom.getHours()) {
    let diffHour = (timeTo.getHours() - timeFrom.getHours());
    diffAsText = diffHour > 1 ? diffHour + " hours ago" : diffHour + " hour ago";
  } else if (timeTo.getMinutes() > timeFrom.getMinutes()) {
    let diffMinute = (timeTo.getMinutes() - timeFrom.getMinutes());
    diffAsText = diffMinute > 1 ? diffMinute + " minutes ago" : diffMinute + " minute ago";
  } else {
    diffAsText = "Just few seconds ago!"
  }

  return diffAsText;
};

/**
 * Convert timeAsNumber to text
 * @param {Number} timeAsNumber The number value of the time
 */
let convertTimeAsNumberToText = (timeAsNumber) => {
  let time = new Date(timeAsNumber);

  let hour = time.getHours();
  let minute = time.getMinutes();
  let second = time.getSeconds();
  let year = time.getFullYear();
  let month = time.getMonth();
  let day = time.getDate();

  let timeAsText = `${hour}:${minute}:${second} ${day}/${month}/${year}`;

  return timeAsText;
};

export default {
  diffAsText,
  convertTimeAsNumberToText,
};
