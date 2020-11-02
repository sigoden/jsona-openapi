const { parseOpenApi } = require("../pkg");
const fs = require("fs");
const path = require("path");
const assert = require("assert");

const target = fs.readFileSync(path.resolve(__dirname, "spec/all_cases.jsona"), "utf8");
const expect = require("./spec/all_cases.json");

assert.deepStrictEqual(parseOpenApi(target), expect);