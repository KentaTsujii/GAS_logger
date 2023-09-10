import {get_or_create_dir, get_or_create_file} from 'drivefileutils';

export class GasLogger {

  appenders: BaseAppender[];

  constructor() {
    this.appenders = [];
  }

  add_appender(appender: BaseAppender) {
    this.appenders.push(appender);
  }

  write_log(message: string, level = 'info') {
    const date_now = new Date();
    const date_message = Utilities.formatDate(date_now, 'Asia/Tokyo', "yyyy-MM-dd'T'HH:mm:ss'Z'");
    const final_message = date_message + ',' + level + ',' + message + "\n";

    for(let logger of this.appenders) {
      logger.write_log(final_message);
    }
  }

  debug(message: string): void {
    this.write_log(message, 'debug');
  }

  info(message: string): void {
    this.write_log(message, 'info');
  }

  warn(message: string): void {
    this.write_log(message, 'warn');
  }

  error(message: string): void {
    this.write_log(message, 'error');
  }

  fatal(message: string): void {
    this.write_log(message, 'fatal');
  }
}

export class BaseAppender {
  write_log(message: string): void {
    // ベースクラスのためなにもしない
  }
}

/**
 * ファイル出力するappender
 */
export class FileAppender extends BaseAppender {

  logger_file_name: string
  file: GoogleAppsScript.Document.Text

  /**
   * コンストラクタです
   * @param save_path 保存パス
   * @param file_name ファイル名
   */
  constructor(save_path: string, file_name: string) {
    super();
    const date_now = new Date();
    this.logger_file_name = file_name + Utilities.formatDate(date_now, 'Asia/Tokyo', 'yyyyMM') + ".txt";
    get_or_create_dir(save_path);
    const file = get_or_create_file(save_path + "/" + this.logger_file_name, DocumentApp) as GoogleAppsScript.Document.Document;
    this.file = file.getBody().editAsText();
  }

  write_log(message: string) {
    this.file.appendText(message);
  }
}

/**
 * console出力するロガー
 */
export class ConsoleAppender extends BaseAppender {
  write_log(message: string) {
    console.log(message);
  }
}

const loggers: any = {
  FileAppender,
  ConsoleAppender
}

/**
 * 文字列で指定されたappenderを取得します。
 * @param {string} class_name 
 * @param {any[]} args 
 * @returns {BaseAppender}
 */
export function create_appender(class_name: string, ...args: any[]): BaseAppender{
    if (loggers[class_name] === undefined || loggers[class_name] === null) {
    throw new Error(`Class type of \'${class_name}\' is not in the store`);
  }
  return new loggers[class_name](...args);
}

/**
 * ロガーを取得します
 * @returns {GasLogger}
 */
export function get_logger(): GasLogger{
  return new GasLogger();
}
