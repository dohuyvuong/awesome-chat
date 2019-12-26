function handleAcceptReceivedRequestingContact() {
  $(".user-accept-received-requesting-contact").off("click").on("click", function () {
    let targetId = $(this).data("uid");

    $.ajax({
      url: "/contact/accept-received-requesting-contact",
      type: "put",
      data: { uid: targetId },
      success: function (data) {
        if (data.result) {
          decreaseNoOfContact(".count-request-contact-received");
          decreaseNoOfNotification(".noti_contact_counter", 1);
          increaseNoOfContact(".count-contacts");

          let targetElement = $("#request-contact-received ul.contactList").find(`li[data-uid=${targetId}]`);
          $(targetElement).find("div.user-accept-received-requesting-contact").remove();
          $(targetElement).find("div.user-reject-received-requesting-contact").remove();
          $(targetElement).find("div.contactPanel").append(`<div class="user-talk" data-uid="${targetId}">
                                                                Trò chuyện
                                                            </div>
                                                            <div class="user-remove-contact action-danger" data-uid="${targetId}">
                                                                Xóa liên hệ
                                                            </div>`);
          $("#contacts ul.contactList").find(".no-contacts").remove();
          $("#contacts ul.contactList").prepend(targetElement);

          displayChatAndRemoveActionsAndRemoveOthers(targetId);

          // $("#request-contact-received ul.contactList").find(`li[data-uid=${targetId}]`).remove();
          if (!$("#request-contact-received ul.contactList").children().length) {
            $("#request-contact-received ul.contactList").html(`<div class="no-received-requesting-contacts">There are no received requesting contacts!</div>`);
          }

          $.post("/conversation/add-new-personal", {
            userId: targetId,
          }, function (conversation) {
            // Step 1: add to leftside section
            let newLeftSideConversation = `
              <a href="#uid_${conversation._id}" class="room-chat" data-target="#to_${conversation._id}">
                  <li class="person" data-chat="${conversation._id}">
                      <div class="left-avatar">
                          <div class="dot"></div>
                          <img src="images/users/${conversation.avatar}" alt="">
                      </div>
                      <div class="name">
                          ${conversation.name}
                      </div>
                      <div class="preview convert-emoji"></div>
                      <div class="time">vài giây trước</div>
                  </li>
              </a>
            `;
            $("#all-chat").find("ul").prepend(newLeftSideConversation);
            $("#personal-chat").find("ul").prepend(newLeftSideConversation);

            // Step 2: add to rightside section
            let newRightSideConversation = `
              <div class="right tab-pane" data-chat="${conversation._id}" id="to_${conversation._id}">
                  <div class="top">
                      <div class="conversation-bar-left">To: <div class="name">
                          ${conversation.name}
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
                      <div class="chat" data-chat="${conversation._id}"></div>
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
                          <a href="javascript:void(0)" id="video-chat-${conversation._id}" class="video-chat" data-chat="${conversation._id}">
                              <i class="fa fa-video-camera"></i>
                          </a>
                      </div>
                  </div>
              </div>
            `;
            $("#screen-chat").prepend(newRightSideConversation);
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
                              <div class="all-images" style="visibility: hidden;"></div>
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
                              <ul class="list-attachs"></ul>
                          </div>
                      </div>
                  </div>
              </div>
            `;
            $("body").append(attachmentModal);

            // Step 5
            socket.emit("accept-received-requesting-contact", {
              contactId: targetId,
              conversationId: conversation._id,
            });
          })
          .fail(function (response) {
            alertify.notify(response.responseText, "error", 5);
          });
        }
      },
    });
  });
}

socket.on("response-accept-received-requesting-contact", function ({ user, conversation }) {
  let notification = `<div data-uid="${user._id}" class="noti-read-false">
                        <img class="avatar-small" src="images/users/${user.avatar}" alt="">
                        <strong>${user.username}</strong> đã chấp nhận lời mời kết bạn của bạn!
                      </div>`;

  $(".noti_content .no-notifications").remove();
  $(".noti_content").prepend(notification);
  $(".list-notifications .no-notifications").parent().remove();
  $(".list-notifications").prepend(`<li>${notification}</li>`);

  increaseNoOfContact(".count-contacts");
  decreaseNoOfContact(".count-request-contact-sent");
  decreaseNoOfNotification(".noti_contact_counter", 1);
  increaseNoOfNotification(".noti_counter");

  $("#request-contact-sent ul.contactList").find(`li[data-uid=${user._id}]`).remove();

  let newContactElement = `
      <li class="_contactList" data-uid="${user._id}">
        <div class="contactPanel">
            <div class="user-avatar">
                <img src="images/users/${user.avatar}" alt="">
            </div>
            <div class="user-name">
                <p>
                    ${user.username}
                </p>
            </div>
            <br>
            <div class="user-address">
                <span>${user.address}</span>
            </div>
            <div class="user-talk" data-uid="${user._id}">
                Trò chuyện
            </div>
            <div class="user-remove-contact action-danger" data-uid="${user._id}">
                Xóa liên hệ
            </div>
        </div>
      </li>
  `;
  $("#contacts ul.contactList").find(".no-contacts").remove();
  $("#contacts ul.contactList").prepend(newContactElement);

  displayChatAndRemoveActionsAndRemoveOthers(user._id);

  $("#request-contact-sent ul.contactList").find(`li[data-uid=${user._id}]`).remove();
  if (!$("#request-contact-sent ul.contactList").children().length) {
    $("#request-contact-sent ul.contactList").html(`<div class="no-sent-requesting-contacts">There are no sent requesting contacts!</div>`);
  }

  // Step 1: add to leftside section
  let newLeftSideConversation = `
    <a href="#uid_${conversation._id}" class="room-chat" data-target="#to_${conversation._id}">
        <li class="person" data-chat="${conversation._id}">
            <div class="left-avatar">
                <div class="dot"></div>
                <img src="images/users/${conversation.avatar}" alt="">
            </div>
            <div class="name">
                ${conversation.name}
            </div>
            <div class="preview convert-emoji"></div>
            <div class="time">vài giây trước</div>
        </li>
    </a>
  `;
  $("#all-chat").find("ul").prepend(newLeftSideConversation);
  $("#personal-chat").find("ul").prepend(newLeftSideConversation);

  // Step 2: add to rightside section
  let newRightSideConversation = `
    <div class="right tab-pane" data-chat="${conversation._id}" id="to_${conversation._id}">
        <div class="top">
            <div class="conversation-bar-left">To: <div class="name">
                ${conversation.name}
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
            <div class="chat" data-chat="${conversation._id}"></div>
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
                <a href="javascript:void(0)" id="video-chat-${conversation._id}" class="video-chat" data-chat="${conversation._id}">
                    <i class="fa fa-video-camera"></i>
                </a>
            </div>
        </div>
    </div>
  `;
  $("#screen-chat").prepend(newRightSideConversation);
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
                    <div class="all-images" style="visibility: hidden;"></div>
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
                    <ul class="list-attachs"></ul>
                </div>
            </div>
        </div>
    </div>
  `;
  $("body").append(attachmentModal);
});

$(document).ready(function () {
  handleAcceptReceivedRequestingContact(); // from js/handleAcceptReceivedRequestingContact.js
});
