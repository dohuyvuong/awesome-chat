export const transValidation = {
  email_incorrect: "Email không hợp lệ! Email phải có dạng example@abc.com!",
  gender_incorrect: "Giới tính không hợp lệ!",
  password_incorrect: "Mật khẩu không hợp lệ! Mật khẩu phải chứa ít nhất 8 kí tự, bao gồm chữ hoa, chữ thường, chữ số và kí tự đặc biệt!",
  password_confirmation_incorrect: "Mật khẩu nhập lại chưa chính xác!",
  username_invalid: "Username có độ dài từ 3 đến 30 kí tự, và không được phép chứa các kí tự đặc biệt!",
  address_invalid: "Địa chỉ có độ dài từ 3 đến 100 kí tự, và ngoài các dấu [ <strong>, -</strong> ] không được phép chứa các kí tự đặc biệt khác!",
  phone_invalid: "Số điện thoại bắt đầu bắng số 0, và có độ dài từ 10 đến 11 số!",
};

export const transErrors = {
  account_email_is_exist: "Email này đã được sử dụng.",
  account_email_is_exist_but_disabled: "Email này đã bị vô hiệu hoá.",
  account_email_is_exist_but_not_active: "Email này đã được đăng kí nhưng chưa kích hoạt. Vui lòng kiểm tra email và kích hoạt tài khoản để sử dụng.",
  account_create_failed: "Có lỗi xảy ra trong quá trình tạo tài khoản. Vui lòng thử lại!",
  account_active_token_invalid: "Mã kích hoạt không hợp lệ, hoặc tài khoản đã được kích hoạt trước đó.<br/>Bạn có thể kiểm tra bằng cách đăng nhập tài khoản!",
  account_active_failed: "Có lỗi xảy ra trong quá trình kích hoạt tài khoản. Vui lòng thử lại!",
  login_failed: "Tài khoản hoặc mật khẩu không chính xác!",
  server_error: "Có lỗi thuộc về server. Vui lòng liên hệ với chúng tôi và rất mong bạn thông cảm.",
  avatar_type_not_supported: "Kiểu file không hợp lệ, chỉ cho phép các loại file jpg, jpeg, png.",
  avatar_size_too_large: "Ảnh upload tối đa cho phép là 1 MB!",
};

export const transSuccess = {
  userCreated: (email) => {
    return `Tài khoản <strong>${email}</strong> đã được đăng kí.<br/> Vui lòng kiểm tra email và kích hoạt tài khoản để sử dụng.`;
  },
  account_active_successfully: "Tài khoản của bạn đã được kích hoạt.<br/>Bạn đã có thể đăng nhập để sử dụng.",
  login_successfully: (username) => {
    return `Xin chào ${username}!`;
  },
  logout_successfully: "Tài khoản của bạn đã được đăng xuất trên phiên này!",
  avatar_updated_successfully: "Cập nhật ảnh đại diện thành công!",
  user_info_updated_successfully: "Cập nhật thông tin người dùng thành công!",
};

export const transNotify = {
  user_logging_in: "Bạn đang trong một phiên đăng nhập!",
};

export const transMail = {
  mail_active_registration_subject: "Awesome Chat: Xác nhận kích hoạt tài khoản",
  mail_active_registration_send_failed: "Tài khoản đã được tạo, nhưng có lỗi xảy ra trong quá trình gửi email xác thực.<br/>Vui lòng đăng nhập tài khoản, rồi yêu cầu gửi lại email xác thực.",
};
