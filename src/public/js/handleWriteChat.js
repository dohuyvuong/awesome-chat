function handleWriteChat(conversationId) {
  $(".emojionearea").off("keyup").on("keyup", function (element) {
    if (element.which === 13) {
      let text = $(`#write-chat-${conversationId}`).val();

      if (!text.length) {
        return;
      }

      let dataChat = {
        conversationId: "1",
        text,
      };

      $.post("/message/add-new-message-text", dataChat, function (data) {
        console.log(data);
      }).fail(function (res) {
        alertify.notify(res.responseText, "error", 5);
      });
    }
  });
}
