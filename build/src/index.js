"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_logger = exports.create_appender = exports.ConsoleAppender = exports.FileAppender = exports.BaseAppender = exports.GasLogger = void 0;
var drivefileutils_1 = require("drivefileutils");
var GasLogger = /** @class */ (function () {
    function GasLogger() {
        this.appenders = [];
    }
    GasLogger.prototype.add_appender = function (appender) {
        this.appenders.push(appender);
    };
    GasLogger.prototype.write_log = function (message, level) {
        if (level === void 0) { level = 'info'; }
        var date_now = new Date();
        var date_message = Utilities.formatDate(date_now, 'Asia/Tokyo', "yyyy-MM-dd'T'HH:mm:ss'Z'");
        var final_message = date_message + ',' + level + ',' + message + "\n";
        for (var _i = 0, _a = this.appenders; _i < _a.length; _i++) {
            var logger = _a[_i];
            logger.write_log(final_message);
        }
    };
    GasLogger.prototype.debug = function (message) {
        this.write_log(message, 'debug');
    };
    GasLogger.prototype.info = function (message) {
        this.write_log(message, 'info');
    };
    GasLogger.prototype.warn = function (message) {
        this.write_log(message, 'warn');
    };
    GasLogger.prototype.error = function (message) {
        this.write_log(message, 'error');
    };
    GasLogger.prototype.fatal = function (message) {
        this.write_log(message, 'fatal');
    };
    return GasLogger;
}());
exports.GasLogger = GasLogger;
var BaseAppender = /** @class */ (function () {
    function BaseAppender() {
    }
    BaseAppender.prototype.write_log = function (message) {
        // ベースクラスのためなにもしない
    };
    return BaseAppender;
}());
exports.BaseAppender = BaseAppender;
/**
 * ファイル出力するappender
 */
var FileAppender = /** @class */ (function (_super) {
    __extends(FileAppender, _super);
    /**
     * コンストラクタです
     * @param save_path 保存パス
     * @param file_name ファイル名
     */
    function FileAppender(save_path, file_name) {
        var _this = _super.call(this) || this;
        var date_now = new Date();
        _this.logger_file_name = file_name + Utilities.formatDate(date_now, 'Asia/Tokyo', 'yyyyMM') + ".txt";
        (0, drivefileutils_1.get_or_create_dir)(save_path);
        var file = (0, drivefileutils_1.get_or_create_file)(save_path + "/" + _this.logger_file_name, DocumentApp);
        _this.file = file.getBody().editAsText();
        return _this;
    }
    FileAppender.prototype.write_log = function (message) {
        this.file.appendText(message);
    };
    return FileAppender;
}(BaseAppender));
exports.FileAppender = FileAppender;
/**
 * console出力するロガー
 */
var ConsoleAppender = /** @class */ (function (_super) {
    __extends(ConsoleAppender, _super);
    function ConsoleAppender() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ConsoleAppender.prototype.write_log = function (message) {
        console.log(message);
    };
    return ConsoleAppender;
}(BaseAppender));
exports.ConsoleAppender = ConsoleAppender;
var loggers = {
    FileAppender: FileAppender,
    ConsoleAppender: ConsoleAppender
};
/**
 * 文字列で指定されたappenderを取得します。
 * @param {string} class_name
 * @param {any[]} args
 * @returns {BaseAppender}
 */
function create_appender(class_name) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (loggers[class_name] === undefined || loggers[class_name] === null) {
        throw new Error("Class type of '".concat(class_name, "' is not in the store"));
    }
    return new ((_a = loggers[class_name]).bind.apply(_a, __spreadArray([void 0], args, false)))();
}
exports.create_appender = create_appender;
/**
 * ロガーを取得します
 * @returns {GasLogger}
 */
function get_logger() {
    return new GasLogger();
}
exports.get_logger = get_logger;
//# sourceMappingURL=index.js.map