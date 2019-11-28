function handleChatText(conversationId) {
  $(`#image-chat-${conversationId}`).off("change").on("change", function () {
    let fileData = $(this).prop("files")[0];
    if (fileData == null) {
      return false;
    }

    let match = ["image/png", "image/jpg", "image/jpeg"];
    let limit = 1048576; // 1048576 B = 1 MB

    if ($.inArray(fileData.type, match) === -1) {
      alertify.notify("Kiểu file không hợp lệ, chỉ cho phép các loại file jpg, jpeg, png.", "error", 5);
      $(this).val(null);
      return false;
    }
    if (fileData.size > limit) {
      alertify.notify("Ảnh upload tối đa cho phép là 1 MB!", "error", 5);
      $(this).val(null);
      return false;
    }

    let messageFormData = new FormData();
    messageFormData.append("my-image-chat", fileData);
    messageFormData.append("conversationId", conversationId);

    $.ajax({
      url: "/message/add-new-message-image",
      type: "post",
      cache: false,
      contentType: false,
      processData: false,
      data: messageFormData,
      success: function(message) {
        let newMessageHTML = `<div class="bubble convert-emoji me bubble-image-file"
                                  data-toggle="tooltip" title="${getMessageTooltip(message)}"
                                  data-mess-id="${message._id}">
                                  <img src="images/users/${message.sender.avatar}" class="avatar-small">
                                      <div class="message-tooltip">${getMessageTooltip(message)}</div>
                                      <div class="message-content">
                                          <img src="data:${message.file.contentType}; base64, ${message.file.data}" class="show-image-chat">
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
        $(`.left .people li[data-chat=${conversationId}]`).find(".preview").html("<i>[Hình ảnh]</i>");
        $(`.left .people li[data-chat=${conversationId}]`).find(".time").text(timeToNowAsText(message));

        // Scroll to bottom of conversation
        nineScrollRight(conversationId);

        // Add image to image-modal
        $(`#images-modal-${conversationId}`).find(".all-images").append(
          `<img src="data:${message.file.contentType}; base64, ${message.file.data}">`
        );

        // Real-time
        socket.emit("chat-message-image", {
          conversationId,
          message,
        });
      },
      error: function(error) {
        alertify.notify(error.responseText, "error", 5);
      }
    });
  });
}

socket.on("response-chat-message-image", function ({ conversation, sender, message }) {
  let newMessageHTML = `<div class="bubble convert-emoji you bubble-image-file"
                            data-toggle="tooltip" title="${getMessageTooltip(message, sender)}"
                            data-mess-id="${message._id}">
                            <img src="images/users/${sender.avatar}" class="avatar-small">
                                <div class="message-tooltip">${getMessageTooltip(message, sender)}</div>
                                <div class="message-content">
                                    <img src="data:${message.file.contentType}; base64, ${message.file.data}" class="show-image-chat">
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
  $(`.left .people li[data-chat=${conversation._id}]`).find(".preview").html("<i>[Hình ảnh]</i>");
  $(`.left .people li[data-chat=${conversation._id}]`).find(".time").text(timeToNowAsText(message));

  // Add image to image-modal
  $(`#images-modal-${conversationId}`).find(".all-images").append(
    `<img src="data:${message.file.contentType}; base64, ${message.file.data}">`
  );
});
