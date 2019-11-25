function getMessageTooltip (message, user) {
  return (user ? user.username : "Tôi") + ", " + moment(message.createdAt).locale("vi").format("HH:mm:ss DD/MM/YYYY");
}

function timeToNowAsText (message) {
  return moment(message.createdAt).locale("vi").startOf("seconds").fromNow();
};
