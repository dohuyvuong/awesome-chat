let currentAvatarSrc = null;
let currentUserInfo = {};
let updatingUserAvatar = null;
let updatingUserInfo = {};
let updatingUserPassword = {};

function callLogout() {
  let timerInterval;

  Swal.fire({
    position: "top-end",
    type: "success",
    title: "Mật khẩu của bạn đã được thay đổi. Hệ thống sẽ tự động đăng xuất sau 5 giây!",
    html: "Thời gian: <strong>5</strong>",
    timer: 5000,
    onBeforeOpen: () => {
      Swal.showLoading();
      timerInterval = setInterval(() => {
        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
      }, 1000);
    },
    onClose: () => {
      clearInterval(timerInterval);
    }
  }).then((result) => {
    $.get("/logout", function() {
      location.reload();
    });
  });
}

function updateUserInfo() {
  initCurrentUserData();

  $("#input-change-avatar").on("change", function() {
    let fileData = $(this).prop("files")[0];
    if (fileData == null) {
      resetImageData();

      return false;
    }

    let match = ["image/png", "image/jpg", "image/jpeg"];
    let limit = 1048576; // 1048576 B = 1 MB

    if ($.inArray(fileData.type, match) === -1) {
      alertify.notify("Kiểu file không hợp lệ, chỉ cho phép các loại file jpg, jpeg, png.", "error", 5);
      $(this).val(null);
      resetImageData();

      return false;
    }
    if (fileData.size > limit) {
      alertify.notify("Ảnh tải lên tối đa cho phép là 1 MB!", "error", 5);
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
      alertify.notify("Trình duyệt của bạn không hỗ trợ FileReader!", "error", 5);
    }
  });

  $("#input-change-username").on("change", function() {
    let username = $(this).val();
    let usernameRegex = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);

    if (username.length < 3 || username.length > 30 || !usernameRegex.test(username)) {
      alertify.notify("Username có độ dài từ 3 đến 30 kí tự, và không được phép chứa các kí tự đặc biệt!", "error", 5);
      $(this).val(currentUserInfo.username);
      delete updatingUserInfo.username;

      return false;
    }

    updatingUserInfo.username = username;
  });

  $("#input-change-gender-male").on("click", function() {
    let gender = $(this).val();

    if (gender != "male") {
      alertify.notify("Giới tính không hợp lệ!", "error", 5);
      $(this).val(currentUserInfo.gender);
      delete updatingUserInfo.gender;

      return false;
    }

    updatingUserInfo.gender = gender;
  });

  $("#input-change-gender-female").on("click", function() {
    let gender = $(this).val();

    if (gender != "female") {
      alertify.notify("Giới tính không hợp lệ!", "error", 5);
      $(this).val(currentUserInfo.gender);
      delete updatingUserInfo.gender;

      return false;
    }

    updatingUserInfo.gender = gender;
  });

  $("#input-change-address").on("change", function() {
    let address = $(this).val();
    let addressRegex = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ,\- ]+$/);

    if (address.length < 3 || address.length > 100 || !addressRegex.test(address)) {
      alertify.notify("Địa chỉ có độ dài từ 3 đến 100 kí tự, và ngoài các dấu [ <strong>, -</strong> ] không được phép chứa các kí tự đặc biệt khác!", "error", 5);
      $(this).val(currentUserInfo.address);
      delete updatingUserInfo.address;

      return false;
    }

    updatingUserInfo.address = address;
  });

  $("#input-change-phone").on("change", function() {
    let phone = $(this).val();
    let phoneRegex = new RegExp(/^(0)[1-9]{1}[0-9]{8,9}$/);

    if (!phoneRegex.test(phone)) {
      alertify.notify("Số điện thoại bắt đầu bắng số 0, và có độ dài từ 10 đến 11 số!", "error", 5);
      $(this).val(currentUserInfo.phone);
      delete updatingUserInfo.phone;

      return false;
    }

    updatingUserInfo.phone = phone;
  });

  $("#input-btn-update-user").on("click", function() {
    resetAlert();

    if ($.isEmptyObject(updatingUserInfo) && !updatingUserAvatar) {
      alertify.notify("Bạn chưa thay đổi thông tin!", "error", 5);
      return false;
    }

    if (updatingUserAvatar) {
      callUpdateUserAvatar();
    }
    if (!$.isEmptyObject(updatingUserInfo)) {
      callUpdateUserInfo();
    }
  });

  $("#input-btn-cancel-update-user").on("click", function() {
    resetAlert();
    resetImageData();
    resetUserInfoData();
  });

  $("#input-change-current-password").on("change", function() {
    let currentPassword = $(this).val();
    let passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);

    if (currentPassword.length < 8 || !passwordRegex.test(currentPassword)) {
      alertify.notify("Mật khẩu không hợp lệ! Mật khẩu phải chứa ít nhất 8 kí tự, bao gồm chữ hoa, chữ thường, chữ số và kí tự đặc biệt!", "error", 5);
      $(this).val(null);
      delete updatingUserPassword.currentPassword;

      return false;
    }

    updatingUserPassword.currentPassword = currentPassword;
  });

  $("#input-change-new-password").on("change", function() {
    let newPassword = $(this).val();
    let passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);

    if (newPassword === updatingUserPassword.currentPassword) {
      alertify.notify("Mật khẩu mới phải khác mật khẩu cũ!", "error", 5);
      $(this).val(null);
      delete updatingUserPassword.newPassword;

      return false;
    }
    if (newPassword.length < 8 || !passwordRegex.test(newPassword)) {
      alertify.notify("Mật khẩu không hợp lệ! Mật khẩu phải chứa ít nhất 8 kí tự, bao gồm chữ hoa, chữ thường, chữ số và kí tự đặc biệt!", "error", 5);
      $(this).val(null);
      delete updatingUserPassword.newPassword;

      return false;
    }

    updatingUserPassword.newPassword = newPassword;
  });

  $("#input-change-confirm-new-password").on("change", function() {
    let confirmNewPassword = $(this).val();

    if (confirmNewPassword !== updatingUserPassword.newPassword) {
      alertify.notify("Mật khẩu xác nhận không khớp với mật khẩu mới!", "error", 5);
      $(this).val(null);
      delete updatingUserPassword.confirmNewPassword;

      return false;
    }

    updatingUserPassword.confirmNewPassword = confirmNewPassword;
  });

  $("#input-btn-update-user-password").on("click", function() {
    resetAlert();

    if (!(updatingUserPassword.currentPassword && updatingUserPassword.newPassword && updatingUserPassword.confirmNewPassword)) {
      alertify.notify("Vui lòng đảm bảo mật khẩu cũ, mật khẩu mới và mật khẩu xác nhận là hợp lệ!", "error", 5);
      return false;
    }

    Swal.fire({
      title: "Bạn có chắc chắn muốn thay đổi mật khẩu không?",
      text: "Bạn không thể hoàn tác quá trình này!",
      type: "info",
      showCancelButton: true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#FF7675",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Huỷ"
    }).then((result) => {
      if (!result.value) {
        $("#input-btn-cancel-update-user-password").click();
        return false;
      }

      callUpdateUserPassword();
    });
  });

  $("#input-btn-cancel-update-user-password").on("click", function() {
    resetAlert();
    resetUserPasswordData();
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
  $(".personal-info .alert").css("display", "none");
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

function resetUserPasswordData() {
  $("#input-change-current-password").val(null);
  $("#input-change-new-password").val(null);
  $("#input-change-confirm-new-password").val(null);
  updatingUserPassword = {};
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

function callUpdateUserPassword() {
  $.ajax({
    url: "/user/update-password",
    type: "put",
    data: updatingUserPassword,
    success: function(result) {
      $("#password-profile .personal-info .user-password-message.alert-success span").html(result.message);
      $("#password-profile .personal-info .user-password-message.alert-success").css("display", "block");

      resetUserPasswordData();

      callLogout();
    },
    error: function(error) {
      $("#password-profile .personal-info .user-password-message.alert-danger span").html(error.responseText);
      $("#password-profile .personal-info .user-password-message.alert-danger").css("display", "block");

      resetUserPasswordData();
    }
  });
}

$(document).ready(function() {
  updateUserInfo();
});
