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
      }, function (data) {
        console.log(data);
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
});
