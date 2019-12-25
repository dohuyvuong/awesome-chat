import { body } from "express-validator";
import { transValidation } from "../../lang/vi";

let validateAddNewGroupChat = [
  body("userIds", transValidation.conversation_group_add_new_invalid_size)
    .custom((userIds) => {
      if (!Array.isArray(userIds) || userIds.length < 2) {
        return false;
      }

      return true;
    }),
  body("name", transValidation.conversation_group_add_new_invalid_name)
    .isLength({ min: 3, max: 50 })
    .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ @.-]+$/),
];

export const groupChatValidation = {
  validateAddNewGroupChat,
};
