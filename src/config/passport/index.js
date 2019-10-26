import { FacebookPassport } from "./facebook";
import { GooglePassport } from "./google";
import { LocalPassport } from "./local";

let initPassport = () => {
  FacebookPassport.init();
  GooglePassport.init();
  LocalPassport.init();
};

export default initPassport;
