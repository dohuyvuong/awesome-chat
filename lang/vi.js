export const transValidation = {
  email_invalid: "Email không hợp lệ! Email phải có dạng example@abc.com!",
  gender_invalid: "Giới tính không hợp lệ!",
  password_invalid: "Mật khẩu không hợp lệ! Mật khẩu phải chứa ít nhất 8 kí tự, bao gồm chữ hoa, chữ thường, chữ số và kí tự đặc biệt!",
  password_current_invalid: "Mật khẩu hiện tại không hợp lệ! Mật khẩu phải chứa ít nhất 8 kí tự, bao gồm chữ hoa, chữ thường, chữ số và kí tự đặc biệt!",
  password_new_invalid: "Mật khẩu mới không hợp lệ! Mật khẩu phải chứa ít nhất 8 kí tự, bao gồm chữ hoa, chữ thường, chữ số và kí tự đặc biệt!",
  password_confirmation_incorrect: "Mật khẩu nhập lại chưa chính xác!",
  username_invalid: "Username có độ dài từ 3 đến 30 kí tự, và không được phép chứa các kí tự đặc biệt!",
  address_invalid: "Địa chỉ có độ dài từ 3 đến 100 kí tự, và ngoài các dấu [ <strong>, -</strong> ] không được phép chứa các kí tự đặc biệt khác!",
  phone_invalid: "Số điện thoại bắt đầu bắng số 0, và có độ dài từ 10 đến 11 số!",
  keyword_search_new_contact: "Từ khoá tìm kiếm có độ dài từ 2 đến 30 kí tự, và không được phép chứa các kí tự đặc biệt ngoại trừ @ . -",
  keyword_find_contact: "Từ khoá tìm kiếm có độ dài từ 2 đến 30 kí tự, và không được phép chứa các kí tự đặc biệt ngoại trừ @ . -",
  message_text_invalid: "Tin nhắn chứa ít nhất 1 kí tự và không được vượt quá 1000 kí tự!",
  conversation_group_add_new_invalid_size: "Nhóm trò chuyện có tối thiểu 3 người bao gồm bạn!",
  conversation_group_add_new_invalid_name: "Tên Nhóm trò chuyện có độ dài từ 3 đến 50 kí tự và không được phép chứa các kí tự đặc biệt ngoại trừ @ . -!",
};

export const transErrors = {
  account_email_is_exist: "Email này đã được sử dụng.",
  account_email_is_exist_but_disabled: "Email này đã bị vô hiệu hoá.",
  account_email_is_exist_but_not_active: "Email này đã được đăng kí nhưng chưa kích hoạt. Vui lòng kiểm tra email và kích hoạt tài khoản để sử dụng.",
  account_create_failed: "Có lỗi xảy ra trong quá trình tạo tài khoản. Vui lòng thử lại!",
  account_active_token_invalid: "Mã kích hoạt không hợp lệ, hoặc tài khoản đã được kích hoạt trước đó.<br/>Bạn có thể kiểm tra bằng cách đăng nhập tài khoản!",
  account_active_failed: "Có lỗi xảy ra trong quá trình kích hoạt tài khoản. Vui lòng thử lại!",
  account_not_found: "Tài khoản này không tồn tại.",
  login_failed: "Tài khoản hoặc mật khẩu không chính xác!",
  server_error: "Có lỗi thuộc về server. Vui lòng liên hệ với chúng tôi và rất mong bạn thông cảm.",
  bad_request: "Yêu cầu không hợp lệ!",
  avatar_type_not_supported: "Kiểu file không hợp lệ, chỉ cho phép các loại file jpg, jpeg, png.",
  avatar_size_too_large: "Ảnh tải lên tối đa cho phép là 1 MB!",
  password_incorrect: "Mật khẩu hiện tại không chính xác!",
  message_user_not_in_conversation: "Bạn không ở trong cuộc trò chuyện!",
  message_image_type_not_supported: "Kiểu file không hợp lệ, chỉ cho phép các loại file jpg, jpeg, png.",
  message_image_size_too_large: "Ảnh tải lên tối đa cho phép là 1 MB!",
  message_attachment_size_too_large: "Tệp tin tải lên tối đa cho phép là 1 MB!",
  conversation_add_new_user_is_not_contact: "Bạn đang tạo cuộc trò chuyện với người hiện không phải là bạn bè!",
  conversation_personal_add_new_invalid_size: "Cuộc trò chuyện cá nhân có và chỉ có 2 người bao gồm bạn!",
  conversation_personal_add_new_existed: "Đã tồn tại cuộc trò chuyện cá nhân giữa hai người!",
  conversation_group_add_new_invalid_size: "Nhóm trò chuyện có tối thiểu 3 người bao gồm bạn!",
  user_not_found: "Không tìm thấy người dùng!",
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
  user_password_updated_successfully: "Cập nhật mật khẩu người dùng thành công!",
};

export const transNotify = {
  user_logging_in: "Bạn đang trong một phiên đăng nhập!",
};

export const transMail = {
  mail_active_registration_subject: "Awesome Chat: Xác nhận kích hoạt tài khoản",
  mail_active_registration_send_failed: "Tài khoản đã được tạo, nhưng có lỗi xảy ra trong quá trình gửi email xác thực.<br/>Vui lòng đăng nhập tài khoản, rồi yêu cầu gửi lại email xác thực.",
};
