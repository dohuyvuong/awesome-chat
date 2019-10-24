import { check } from "express-validator";
import { transValidation } from "../../lang/vi";

let updateInfo = [
  check("username", transValidation.username_invalid)
    .optional()
    .isLength({ min: 3, max: 30 })
    .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/),
  check("gender", transValidation.gender_invalid)
    .optional()
    .isIn(["male", "female"]),
  check("address", transValidation.address_invalid)
    .optional()
    .isLength({ min: 3, max: 100 })
    .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ,\- ]+$/),
  check("phone", transValidation.phone_invalid)
    .optional()
    .matches(/^(0)[1-9]{1}[0-9]{8,9}$/),
];

let updatePassword = [
  check("currentPassword", transValidation.password_current_invalid)
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
  check("newPassword", transValidation.password_new_invalid)
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
  check("confirmNewPassword", transValidation.password_confirmation_incorrect)
    .custom((value, { req }) => {
      return value === req.body.newPassword;
    }),
];

export const userValidation = {
  updateInfo,
  updatePassword,
};
