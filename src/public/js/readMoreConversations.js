$(document).ready(function () {
  $("#link-read-more-all-conversations").click(function () {
    let offset = 0;
    if ($("#all-chat ul.people").find("a.room-chat").length) {
      offset = $("#all-chat ul.people").find("a.room-chat").length;
    }

    $(".read-more-all-conversations").hide();
    $(".read-more-all-conversations-loader").show();

    $.get(`/conversation/get-conversations?offset=${offset}`, function (conversations) {
      $(".read-more-all-conversations-loader").hide();

      if (!conversations.length) {
        alertify.notify("Tất cả cuộc trò chuyện đã được hiển thị!", "success", 5);
        return;
      }

      let userId = $("#dropdown-navbar-user").data("uid");

      conversations.forEach(conversation => {
        let lastMessage = "";
        if (conversation.messages.length > 0) {
          switch (conversation.messages[conversation.messages.length - 1].messageType) {
            case "text":
              lastMessage = conversation.messages[conversation.messages.length - 1].text;
              break;
            case "image":
              lastMessage = "<i>[Hình ảnh]</i>";
            case "file":
              lastMessage = "<i>[Tệp tin]</i>";
            default:
              break;
          }
        }
        let isGroupConversation = conversation.conversationType == "group";

        // Step 1: add to leftside section
        let newLeftSideConversation = `
          <a href="#uid_${conversation._id}" class="room-chat" data-target="#to_${conversation._id}">
              <li class="person ${isGroupConversation ? "group-chat" : ""}" data-chat="${conversation._id}">
                  <div class="left-avatar">
                      ${isGroupConversation ? "" : `<div class="dot"></div>`}
                      <img src="images/users/${conversation.avatar}" alt="">
                  </div>
                  <div class="name">
                      ${isGroupConversation ? `<span class="group-chat-name">Group:</span>` : ""} ${conversation.name}
                  </div>
                  <div class="preview convert-emoji">${lastMessage}</div>
                  <div class="time">${conversation.updatedAtText}</div>
              </li>
          </a>
        `;
        $("#all-chat").find("ul").append(newLeftSideConversation);
        if (isGroupConversation) {
          $("#group-chat").find("ul").append(newLeftSideConversation);
        } else {
          $("#personal-chat").find("ul").append(newLeftSideConversation);
        }

        // Step 2: add to rightside section
        let newRightSideConversation = `
          <div class="right tab-pane" data-chat="${conversation._id}" id="to_${conversation._id}">
              <div class="top">
                  <div class="conversation-bar-left">To: <div class="name">
                      ${isGroupConversation ? `<a href="#conversation-users-modal-${conversation._id}" class="show-conversation-users" data-toggle="modal">${conversation.name}</a>` : conversation.name}
                  </div>
                  </div>
                  <div class="conversation-bar-right">
                      <div class="chat-menu-right">
                          <a href="#attachs-modal-${conversation._id}" class="show-attachs" data-toggle="modal">
                              Tệp đính kèm
                              <i class="fa fa-paperclip"></i>
                          </a>
                      </div>
                      <div class="chat-menu-right">
                          <a href="#images-modal-${conversation._id}" class="show-images" data-toggle="modal">
                              Hình ảnh
                              <i class="fa fa-photo"></i>
                          </a>
                      </div>
                  </div>
              </div>
              <div class="content-chat">
                  <div class="chat" data-chat="${conversation._id}">${conversation.messages.map(message => {
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
                                  ${message.messageType == "text" ? message.text : ""}
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
                  })}</div>
              </div>
              <div class="write" data-chat="${conversation._id}">
                  <input type="text" id="write-chat-${conversation._id}" class="write-chat" data-chat="${conversation._id}">
                  <div class="icons">
                      <a href="#" class="icon-chat" data-chat="${conversation._id}"><i class="fa fa-smile-o"></i></a>
                      <label for="image-chat-${conversation._id}">
                          <input type="file" id="image-chat-${conversation._id}" name="my-image-chat" class="image-chat" data-chat="${conversation._id}">
                          <i class="fa fa-photo"></i>
                      </label>
                      <label for="attach-chat-${conversation._id}">
                          <input type="file" id="attach-chat-${conversation._id}" name="my-attach-chat" class="attach-chat" data-chat="${conversation._id}">
                          <i class="fa fa-paperclip"></i>
                      </label>
                      <a href="javascript:void(0)" ${isGroupConversation ? `class="video-chat-group"` : `id="video-chat-${conversation._id}" class="video-chat" data-chat="${conversation._id}"`}>
                          <i class="fa fa-video-camera"></i>
                      </a>
                  </div>
              </div>
          </div>
        `;
        $("#screen-chat").append(newRightSideConversation);
        handleChangeScreenChat();

        // Step 3: add image modal
        let imageModal = `
          <div class="modal fade" id="images-modal-${conversation._id}" role="dialog">
              <div class="modal-dialog modal-lg">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal">&times;</button>
                          <h4 class="modal-title">Hình ảnh trong cuộc trò chuyện.</h4>
                      </div>
                      <div class="modal-body">
                          <div class="all-images" style="visibility: hidden;">
                              ${conversation.messages.filter(message => message.messageType == "image").map(message => {
                                return `<img src="data:${message.file.contentType}; base64, ${message.file.data}">`;
                              }).join("")}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        `;
        $("body").append(imageModal);
        gridPhotos(5);

        // Step 4: add file modal
        let attachmentModal = `
          <div class="modal fade" id="attachs-modal-${conversation._id}" role="dialog">
              <div class="modal-dialog modal-lg">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal">&times;</button>
                          <h4 class="modal-title">Tệp đính kèm trong cuộc trò chuyện.</h4>
                      </div>
                      <div class="modal-body">
                          <ul class="list-attachs">
                              ${conversation.messages.filter(message => message.messageType == "file").map(message => {
                                return `
                                  <li>
                                      <a href="data:${message.file.contentType}; base64, ${message.file.data}}"
                                      download="${message.file.fileName}">
                                          ${message.file.fileName}
                                      </a>
                                  </li>
                                `;
                              }).join("")}
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
        `;
        $("body").append(attachmentModal);
      });

      $(".read-more-all-conversations").show();
    });
  });
});
