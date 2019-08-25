let currentAvatarSrc = null;
let currentUserInfo = {};
let updatingUserAvatar = null;
let updatingUserInfo = {};

function updateUserInfo() {
  initCurrentUserData();

  $("#input-change-avatar").bind("change", function() {
    let fileData = $(this).prop("files")[0];
    if (fileData == null) {
      resetImageData();

      return false;
    }

    let match = ["image/png", "image/jpg", "image/jpeg"];
    let limit = 1048576; // 1048576 B = 1 MB

    if ($.inArray(fileData.type, match) === -1) {
      alertify.notify("Kiểu file không hợp lệ, chỉ cho phép các loại file jpg, jpeg, png.", "error", 3);
      $(this).val(null);
      resetImageData();

      return false;
    }
    if (fileData.size > limit) {
      alertify.notify("Ảnh upload tối đa cho phép là 1 MB!", "error", 3);
      $(this).val(null);
      resetImageData();

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

      updatingUserAvatar = formData;
    } else {
      alertify.notify("Trình duyệt của bạn không hỗ trợ FileReader!", "error", 3);
    }
  });

  $("#input-change-username").bind("change", function() {
    let username = $(this).val();
    let usernameRegex = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);

    if (username.length < 3 || username.length > 30 || !usernameRegex.test(username)) {
      alertify.notify("Username có độ dài từ 3 đến 30 kí tự, và không được phép chứa các kí tự đặc biệt!", "error", 3);
      $(this).val(currentUserInfo.username);
      delete updatingUserInfo.username;

      return false;
    }

    updatingUserInfo.username = username;
  });

  $("#input-change-gender-male").bind("click", function() {
    let gender = $(this).val();

    if (gender != "male") {
      alertify.notify("Giới tính không hợp lệ!", "error", 3);
      $(this).val(currentUserInfo.gender);
      delete updatingUserInfo.gender;

      return false;
    }

    updatingUserInfo.gender = gender;
  });

  $("#input-change-gender-female").bind("click", function() {
    let gender = $(this).val();

    if (gender != "female") {
      alertify.notify("Giới tính không hợp lệ!", "error", 3);
      $(this).val(currentUserInfo.gender);
      delete updatingUserInfo.gender;

      return false;
    }

    updatingUserInfo.gender = gender;
  });

  $("#input-change-address").bind("change", function() {
    let address = $(this).val();
    let addressRegex = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ,\- ]+$/);

    if (address.length < 3 || address.length > 100 || !addressRegex.test(address)) {
      alertify.notify("Địa chỉ có độ dài từ 3 đến 100 kí tự, và ngoài các dấu [ <strong>, -</strong> ] không được phép chứa các kí tự đặc biệt khác!", "error", 3);
      $(this).val(currentUserInfo.address);
      delete updatingUserInfo.address;

      return false;
    }

    updatingUserInfo.address = address;
  });

  $("#input-change-phone").bind("change", function() {
    let phone = $(this).val();
    let phoneRegex = new RegExp(/^(0)[1-9]{1}[0-9]{8,9}$/);

    if (!phoneRegex.test(phone)) {
      alertify.notify("Số điện thoại bắt đầu bắng số 0, và có độ dài từ 10 đến 11 số!", "error", 3);
      $(this).val(currentUserInfo.phone);
      delete updatingUserInfo.phone;

      return false;
    }

    updatingUserInfo.phone = phone;
  });

  $("#input-btn-update-user").bind("click", function() {
    resetAlert();

    if ($.isEmptyObject(updatingUserInfo) && !updatingUserAvatar) {
      return alertify.notify("Bạn chưa thay đổi thông tin!", "error", 3);
    }

    if (updatingUserAvatar) {
      callUpdateUserAvatar();
    }
    if (!$.isEmptyObject(updatingUserInfo)) {
      callUpdateUserInfo();
    }
  });

  $("#input-btn-cancel-update-user").bind("click", function() {
    resetAlert();
    resetImageData();
    resetUserInfoData();
  });
}

function initCurrentUserData() {
  currentAvatarSrc = $("#user-modal-avatar").attr("src");
  currentUserInfo = {
    username: $("#input-change-username").val(),
    gender: $("#seting-profile .personal-info input[name='gender']:checked").val(),
    address: $("#input-change-address").val(),
    phone: $("#input-change-phone").val(),
  };
}

function resetAlert() {
  $("#seting-profile .personal-info .alert").css("display", "none");
}

function resetData() {
  resetImageData();
  updatingUserInfo = {};
}

function resetImageData() {
  $("#user-modal-avatar").attr("src", currentAvatarSrc);
  $("#input-change-avatar").val(null);
  updatingUserAvatar = null;
}

function resetUserInfoData() {
  $("#input-change-username").val(currentUserInfo.username);
  $(`#seting-profile .personal-info input[name="gender"][value="${currentUserInfo.gender}"]`).prop("checked", true);
  $("#input-change-address").val(currentUserInfo.address);
  $("#input-change-phone").val(currentUserInfo.phone);
  updatingUserInfo = {};
}

function callUpdateUserAvatar() {
  $.ajax({
    url: "/user/update-avatar",
    type: "put",
    cache: false,
    contentType: false,
    processData: false,
    data: updatingUserAvatar,
    success: function(result) {
      $("#seting-profile .personal-info .user-avatar-message.alert-success span").html(result.message);
      $("#seting-profile .personal-info .user-avatar-message.alert-success").css("display", "block");

      currentAvatarSrc = result.imageSrc;

      $("#navbar-avatar").attr("src", currentAvatarSrc);

      resetImageData();
    },
    error: function(error) {
      $("#seting-profile .personal-info .user-avatar-message.alert-danger span").html(error.responseText);
      $("#seting-profile .personal-info .user-avatar-message.alert-danger").css("display", "block");
      resetImageData();
    }
  });
}

function callUpdateUserInfo() {
  $.ajax({
    url: "/user/update-info",
    type: "put",
    data: updatingUserInfo,
    success: function(result) {
      $("#seting-profile .personal-info .user-info-message.alert-success span").html(result.message);
      $("#seting-profile .personal-info .user-info-message.alert-success").css("display", "block");

      currentUserInfo = Object.assign(currentUserInfo, updatingUserInfo);

      $("#navbar-username").text(currentUserInfo.username);

      resetUserInfoData();
    },
    error: function(error) {
      $("#seting-profile .personal-info .user-info-message.alert-danger span").html(error.responseText);
      $("#seting-profile .personal-info .user-info-message.alert-danger").css("display", "block");
      resetUserInfoData();
    }
  });
}

$(document).ready(function() {
  updateUserInfo();
});
