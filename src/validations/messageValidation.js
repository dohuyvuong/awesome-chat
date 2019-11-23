import { body } from "express-validator";
import { transValidation } from "../../lang/vi";

let checkMessageText = [
  body("text", transValidation.message_text_invalid)
    .isLength({ min: 1, max: 1000 }),
];

export const messageValidation = {
  checkMessageText,
};
