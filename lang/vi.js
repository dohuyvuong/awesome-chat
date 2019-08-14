export const transValidation = {
  email_incorrect: "Email không hợp lệ! Email phải có dạng example@abc.com!",
  gender_incorrect: "Giới tính không hợp lệ!",
  password_incorrect: "Mật khẩu không hợp lệ! Mật khẩu phải chứa ít nhất 8 kí tự, bao gồm chữ hoa, chữ thường, chữ số và kí tự đặc biệt!",
  password_confirmation_incorrect: "Mật khẩu nhập lại chưa chính xác!",
};

export const transErrors = {
  account_email_is_exist: "Email này đã được sử dụng.",
  account_email_is_exist_but_disabled: "Email này đã bị vô hiệu hoá.",
  account_email_is_exist_but_not_active: "Email này đã được đăng kí nhưng chưa kích hoạt. Vui lòng kiểm tra email và kích hoạt tài khoản để sử dụng."
};

export const transSuccess = {
  userCreated: (email) => {
    return `Tài khoản <strong>${email}</strong> đã được đăng kí.<br/> Vui lòng kiểm tra email và kích hoạt tài khoản để sử dụng.`;
  }
};
