/// <reference types="google-apps-script" />
export declare class GasLogger {
    appenders: BaseAppender[];
    constructor();
    add_appender(appender: BaseAppender): void;
    write_log(message: string, level?: string): void;
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    fatal(message: string): void;
}
export declare class BaseAppender {
    write_log(message: string): void;
}
/**
 * ファイル出力するappender
 */
export declare class FileAppender extends BaseAppender {
    logger_file_name: string;
    file: GoogleAppsScript.Document.Text;
    /**
     * コンストラクタです
     * @param save_path 保存パス
     * @param file_name ファイル名
     */
    constructor(save_path: string, file_name: string);
    write_log(message: string): void;
}
/**
 * console出力するロガー
 */
export declare class ConsoleAppender extends BaseAppender {
    write_log(message: string): void;
}
/**
 * 文字列で指定されたappenderを取得します。
 * @param {string} class_name
 * @param {any[]} args
 * @returns {BaseAppender}
 */
export declare function create_appender(class_name: string, ...args: any[]): BaseAppender;
/**
 * ロガーを取得します
 * @returns {GasLogger}
 */
export declare function get_logger(): GasLogger;
//# sourceMappingURL=index.d.ts.map