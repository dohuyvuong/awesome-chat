import ejs from "ejs";
import fs from "fs";
import path from "path";

let renderTemplate = (templateFile, data) => {
  let template = fs.readFileSync(
    path.join(__dirname, "..", "template", templateFile),
    { encoding: "utf8" }
  );

  return ejs.render(template, data);
};

export default renderTemplate;
