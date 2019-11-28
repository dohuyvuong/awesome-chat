function handleChatText(conversationId) {
  $(".emojionearea").off("keyup").on("keyup", function (element) {
    if (element.which === 13) {
      let text = $(`#write-chat-${conversationId}`).val();

      if (!text.length) {
        return;
      }

      let dataChat = {
        conversationId,
        text,
      };

      // Clear input chat
      $(`#write-chat-${conversationId}`).val("");
      $(`.right .write[data-chat=${conversationId}]`).find(".emojionearea-editor").html("");

      $.post("/message/add-new-message-text", dataChat, function (message) {
        let newMessageHTML = `<div class="bubble convert-emoji me"
                                  data-toggle="tooltip" title="${getMessageTooltip(message)}"
                                  data-mess-id="${message._id}">
                                  <img src="images/users/${message.sender.avatar}" class="avatar-small">
                                      <div class="message-tooltip">${getMessageTooltip(message)}</div>
                                      <div class="message-content">
                                          ${emojione.toImage(message.text)}
                                      </div>
                              </div>`;

        // Add message to conversation
        $(".right .content-chat").find(`.chat[data-chat=${conversationId}]`).append(newMessageHTML);

        // Move conversation to top - all conversations
        let conversationInAll = $("#all-chat .people").find(`li[data-chat=${conversationId}]`).parent();
        $("#all-chat .people").prepend(conversationInAll);

        // Move conversation to top - personal conversation
        let conversationInPersonal = $("#personal-chat .people").find(`li[data-chat=${conversationId}]`).parent();
        $("#personal-chat .people").prepend(conversationInPersonal);

        // Move conversation to top - group conversation
        let conversationInGroup = $("#group-chat .people").find(`li[data-chat=${conversationId}]`).parent();
        $("#group-chat .people").prepend(conversationInGroup);

        // Preview message and timing
        $(`.left .people li[data-chat=${conversationId}]`).find(".preview").html(emojione.toImage(message.text));
        $(`.left .people li[data-chat=${conversationId}]`).find(".time").text(timeToNowAsText(message));

        // Scroll to bottom of conversation
        nineScrollRight(conversationId);

        // Real-time
        socket.emit("chat-message-text", {
          conversationId,
          message,
        });
      }).fail(function (res) {
        alertify.notify(res.responseText, "error", 5);
      });
    }
  });
}

socket.on("response-chat-message-text", function ({ conversation, sender, message }) {
  let newMessageHTML = `<div class="bubble convert-emoji you"
                            data-toggle="tooltip" title="${getMessageTooltip(message, sender)}"
                            data-mess-id="${message._id}">
                            <img src="images/users/${sender.avatar}" class="avatar-small">
                                <div class="message-tooltip">${getMessageTooltip(message, sender)}</div>
                                <div class="message-content">
                                    ${emojione.toImage(message.text)}
                                </div>
                        </div>`;

        // Add message to conversation
        $(".right .content-chat").find(`.chat[data-chat=${conversation._id}]`).append(newMessageHTML);

        // Move conversation to top - all conversations
        let conversationInAll = $("#all-chat .people").find(`li[data-chat=${conversation._id}]`).parent();
        $("#all-chat .people").prepend(conversationInAll);

        // Move conversation to top - personal conversation
        let conversationInPersonal = $("#personal-chat .people").find(`li[data-chat=${conversation._id}]`).parent();
        $("#personal-chat .people").prepend(conversationInPersonal);

        // Move conversation to top - group conversation
        let conversationInGroup = $("#group-chat .people").find(`li[data-chat=${conversation._id}]`).parent();
        $("#group-chat .people").prepend(conversationInGroup);

        // Preview message and timing
        $(`.left .people li[data-chat=${conversation._id}]`).find(".preview").html(emojione.toImage(message.text));
        $(`.left .people li[data-chat=${conversation._id}]`).find(".time").text(timeToNowAsText(message));

        // Scroll to bottom of conversation
        nineScrollRight(conversation._id);
});
