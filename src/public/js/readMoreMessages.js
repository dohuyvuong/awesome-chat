function readMoreMessages() {
  $(".right .chat").scroll(function () {
    if ($(this).scrollTop() === 0) {
      let messageLoading = `
        <div class="read-more-items-loader read-more-messages-loader">
            <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
      `;

      $(this).prepend(messageLoading);

      $(".read-more-messages-loader").show();

      let conversationId = $(this).data("chat");
      let offset = $(this).find("div.bubble").length;
      let chatElement = this;

      $.get(`/message/get-messages?conversationId=${conversationId}&offset=${offset}`, function (messages) {
        messages = messages.reverse();

        let userId = $("#dropdown-navbar-user").data("uid");

        let messageElements = messages.map(message => {
          return `
            <div class="bubble convert-emoji
                ${message.senderId == userId ? "me" : "you"}
                ${message.messageType == "image" ? "bubble-image-file" : ""}
                ${message.messageType == "file" ? "bubble-image-file" : ""}
                data-toggle="tooltip" title="${message.senderId == userId ? getMessageTooltip(message) : getMessageTooltip(message, message.sender)}"
                data-mess-id="${message._id}">
                <img src="images/users/${message.sender.avatar}" class="avatar-small">
                    <div class="message-tooltip">${message.senderId == userId ? getMessageTooltip(message) : getMessageTooltip(message, message.sender)}</div>
                    <div class="message-content">
                        ${message.messageType == "text" ? emojione.toImage(message.text) : ""}
                        ${message.messageType == "image" ? `<img src="data:${message.file.contentType}; base64, ${message.file.data}" class="show-image-chat">` : ""}
                        ${message.messageType == "file" ? `
                          <a href="data:${message.file.contentType}; base64, ${message.file.data}"
                          download="${message.file.fileName}">
                              ${message.file.fileName}
                          </a>
                        ` : ""}
                    </div>
            </div>
          `;
        });

        let imagesElements = messages.filter(message => message.messageType == "image").map(message => {
          return `<img src="data:${message.file.contentType}; base64, ${message.file.data}">`;
        }).join("");

        let attachmentElements = messages.filter(message => message.messageType == "file").map(message => {
          return `
            <li>
                <a href="data:${message.file.contentType}; base64, ${message.file.data}}" download="${message.file.fileName}">
                    ${message.file.fileName}
                </a>
            </li>
          `;
        }).join("");

        $(".read-more-messages-loader").remove();
        let preScrollHeight = $(chatElement)[0].scrollHeight;
        $(chatElement).prepend(messageElements);
        $(`.right .chat[data-chat=${conversationId}]`).scrollTop($(chatElement)[0].scrollHeight - preScrollHeight);

        $(`#images-modal-${conversationId}`).find(".all-images").prepend(imagesElements);
        gridPhotos(5);

        $(`#attachs-modal-${conversationId}`).find(".list-attachs").prepend(attachmentElements);
      });
    }
  });
}

$(document).ready(function () {
  readMoreMessages();
});
