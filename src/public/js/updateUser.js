let userAvatar = null;
let userInfo = {};

function updateUserInfo() {
  let currentAvatarSrc = $("#user-modal-avatar").attr("src");

  $("#input-change-avatar").bind("change", function() {
    let fileData = $(this).prop("files")[0];
    let match = ["image/png", "image/jpg", "image/jpeg"];
    let limit = 1048576; // 1048576 B = 1 MB

    if ($.inArray(fileData.type, match) === -1) {
      alertify.notify("Kiểu file không hợp lệ, chỉ cho phép các loại file jpg, jpeg, png.", "error", 3);
      $(this).val(null);
      return false;
    }
    if (fileData.size > limit) {
      alertify.notify("Ảnh upload tối đa cho phép là 1 MB!", "error", 3);
      $(this).val(null);
      return false;
    }

    if (typeof (FileReader) != "undefined") {
      let imagePreview = $("#image-edit-profile");
      imagePreview.empty();

      let fileReader = new FileReader();
      fileReader.onload = function(element) {
        $("<img>", {
          "src": element.target.result,
          "class": "avatar img-circle",
          "id": "user-modal-avatar",
          "alt": "avatar",
        }).appendTo(imagePreview);
      };

      imagePreview.show();
      fileReader.readAsDataURL(fileData);

      let formData = new FormData();
      formData.append("avatar", fileData);

      userAvatar = formData;
    } else {
      alertify.notify("Trình duyệt của bạn không hỗ trợ FileReader!", "error", 3);
    }
  });

  $("#input-change-username").bind("change", function() {
    userInfo.username = $(this).val();
  });

  $("#input-change-gender-male").bind("click", function() {
    userInfo.gender = $(this).val();
  });

  $("#input-change-gender-female").bind("click", function() {
    userInfo.gender = $(this).val();
  });

  $("#input-change-address").bind("change", function() {
    userInfo.address = $(this).val();
  });

  $("#input-change-phone").bind("change", function() {
    userInfo.phone = $(this).val();
  });

  $("#input-btn-update-user").bind("click", function() {
    if ($.isEmptyObject(userInfo) && !userAvatar) {
      alertify.notify("Bạn chưa thay đổi thông ti!", "error", 3);
    }

    $.ajax({
      url: "/user/update-avatar",
      type: "put",
      cache: false,
      contentType: false,
      processData: false,
      data: userAvatar,
      success: function(result) {
        //
      },
      error: function(error) {
        //
      }
    });
  });

  $("#input-btn-cancel-update-user").bind("click", function() {
    $("#user-modal-avatar").attr("src", currentAvatarSrc);

    userAvatar = null;
    userInfo = {};
  });
}

$(document).ready(function() {
  updateUserInfo();
});
