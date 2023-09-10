"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../src/index");
function custom_logger_test() {
    var logger = (0, index_1.get_logger)();
    logger.add_appender((0, index_1.create_appender)("FileAppender", "logging_test", "test"));
    logger.add_appender((0, index_1.create_appender)("ConsoleAppender", "logging_test", "test"));
    logger.write_log("new log");
    logger.write_log("new_log2");
}
//# sourceMappingURL=gas_index.js.map