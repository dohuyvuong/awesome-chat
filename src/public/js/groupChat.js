function handleAddFriendsToGroup() {
  $("ul#group-chat-friends").find("div.add-user").on("click", function() {
    let uid = $(this).data("uid");
    $(this).remove();
    let html = $("ul#group-chat-friends").find("div[data-uid=" + uid + "]").html();

    let promise = new Promise(function(resolve, reject) {
      $("ul#friends-added").append(html);
      $("#groupChatModal .list-user-added").show();
      resolve(true);
    });
    promise.then(function(success) {
      $("ul#group-chat-friends").find("div[data-uid=" + uid + "]").remove();
    });
  });
}

function handleCancelCreateGroup() {
  $("#btn-cancel-group-chat").on("click", function() {
    $("#groupChatModal .list-user-added").hide();
    if ($("ul#friends-added>li").length) {
      $("ul#friends-added>li").each(function(index) {
        $(this).remove();
      });
    }
  });
}

function findFriends(element) {
  if (element.which === 13 || element.type === "click") {
    $("#find-user .contactList").html("");

    let keyword = $("#input-find-friends-to-add-group-chat").val().trim();
    let keywordRegex = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ @.-]+$/);

    $("#input-find-friends-to-add-group-chat").val(keyword);

    if (keyword.length < 2) {
      alertify.notify("Từ khoá tìm kiếm có độ dài từ 2 đến 30 kí tự!", "error", 5);
      return;
    }

    if (!keywordRegex.test(keyword)) {
      alertify.notify("Từ khoá tìm kiếm không được chứa kí tự đặc biệt ngoại trừ @ . -", "error", 5);
      return;
    }

    $.get(`/contact/find?keyword=${keyword}`, function (data) {
      $("ul#group-chat-friends").html(data);
      // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
      handleAddFriendsToGroup();
      // Lắng nghe tạo nhóm trò chuyện
      handleCreateGroupChat();
      // Lắng nghe hủy việc tạo nhóm trò chuyện
      handleCancelCreateGroup();
    });
  }
}

function handleCreateGroupChat() {
  $("#btn-create-group-chat").off("click").on("click", function () {
    let friendsAddedList = $("ul#friends-added").find("li");
    if (friendsAddedList.length < 2) {
      alertify.notify("Nhóm trò chuyện có tối thiểu 3 người bao gồm bạn!", "error", 5);
      return false;
    }

    let groupChatName = $("#input-name-group-chat").val();
    let groupChatNameRegex = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ @.-]+$/);
    if (groupChatName.length < 3 || groupChatName.length > 50 || !groupChatNameRegex.test(groupChatName)) {
      alertify.notify("Tên Nhóm trò chuyện có độ dài từ 3 đến 50 kí tự và không được phép chứa các kí tự đặc biệt ngoại trừ @ . -!", "error", 5);
      return false;
    }

    let userIds = [];
    friendsAddedList.each(function (index, item) {
      userIds.push($(item).data("uid"));
    });

    Swal.fire({
      title: `Bạn có chắc chắn muốn tạo Nhóm trò chuyện <span style="color: #2ECC71; display: contents;">${groupChatName}</span>?`,
      type: "info",
      showCancelButton: true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#FF7675",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Huỷ"
    }).then((result) => {
      if (!result.value) {
        return false;
      }

      $.post("/conversation/add-new-group", {
        userIds,
        name: groupChatName,
      }, function (conversation) {
        // Step 1: hide modal
        $("#input-name-group-chat").val("");
        $("#btn-cancel-group-chat").click();
        $("#groupChatModal").modal("hide");

        // Step 2: add to leftside section
        let newLeftSideConversation = `
          <a href="#uid_${conversation._id}" class="room-chat" data-target="#to_${conversation._id}">
              <li class="person group-chat" data-chat="${conversation._id}">
                  <div class="left-avatar">
                      <!-- <div class="dot"></div> -->
                      <img src="images/users/${conversation.avatar}" alt="">
                  </div>
                  <div class="name">
                      <span class="group-chat-name">Group:</span> ${conversation.name}
                  </div>
                  <div class="preview convert-emoji"></div>
                  <div class="time">vài giây trước</div>
              </li>
          </a>
        `;
        $("#all-chat").find("ul").prepend(newLeftSideConversation);
        $("#group-chat").find("ul").prepend(newLeftSideConversation);

        // Step 3: add to rightside section
        let newRightSideConversation = `
          <div class="right tab-pane" data-chat="${conversation._id}" id="to_${conversation._id}">
              <div class="top">
                  <div class="conversation-bar-left">To: <div class="name">
                      <a href="#conversation-users-modal-${conversation._id}" class="show-conversation-users" data-toggle="modal">${conversation.name}</a>
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
                      <a href="javascript:void(0)" class="video-chat-group">
                          <i class="fa fa-video-camera"></i>
                      </a>
                  </div>
              </div>
          </div>
        `;
        $("#screen-chat").prepend(newRightSideConversation);
        handleChangeScreenChat();

        // Step 4: add image modal
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

        // Step 5: add file modal
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

        // Step 6: Emit new group conversation was created
        socket.emit("conversation-add-new-group", {
          conversationId: conversation._id,
        });
      })
      .fail(function (response) {
        alertify.notify(response.responseText, "error", 5);
      });
    });
  });
}

$(document).ready(function () {
  $("#input-find-friends-to-add-group-chat").on("keypress", findFriends);
  $("#btn-find-friends-to-add-group-chat").on("click", findFriends);

  socket.on("response-conversation-add-new-group", function ({ conversation }) {
    // Step 1: add to leftside section
    let newLeftSideConversation = `
      <a href="#uid_${conversation._id}" class="room-chat" data-target="#to_${conversation._id}">
          <li class="person group-chat" data-chat="${conversation._id}">
              <div class="left-avatar">
                  <!-- <div class="dot"></div> -->
                  <img src="images/users/${conversation.avatar}" alt="">
              </div>
              <div class="name">
                  <span class="group-chat-name">Group:</span> ${conversation.name}
              </div>
              <div class="preview convert-emoji"></div>
              <div class="time">vài giây trước</div>
          </li>
      </a>
    `;
    $("#all-chat").find("ul").prepend(newLeftSideConversation);
    $("#group-chat").find("ul").prepend(newLeftSideConversation);

    // Step 2: add to rightside section
    let newRightSideConversation = `
      <div class="right tab-pane" data-chat="${conversation._id}" id="to_${conversation._id}">
          <div class="top">
              <div class="conversation-bar-left">To: <div class="name">
                  <a href="#conversation-users-modal-${conversation._id}" class="show-conversation-users" data-toggle="modal">${conversation.name}</a>
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
                  <a href="javascript:void(0)" class="video-chat-group">
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
});
