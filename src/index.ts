namespace GasLogger {

  class GasLogger {

    loggers: BaseAppender[]

    constructor() {
      this.loggers = [];
    }

    add_logger(logger: BaseAppender) {
      this.loggers.push(logger);
    }

    write_log(message: string, level = 'info') {
      const date_now = new Date();
      const date_message = Utilities.formatDate(date_now, 'Asia/Tokyo', "yyyy-MM-dd'T'HH:mm:ss'Z'")
      const final_message = date_message + ',' + level + ',' + message + "\n"

      for(let logger of this.loggers) {
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

  class BaseAppender {
    write_log(message: string): void {
      // ベースクラスのためなにもしない
    }
  }

  class FileAppender extends BaseAppender {

    logger_file_name: string
    file: GoogleAppsScript.Document.Text

    constructor(save_path: string, file_name: string) {
      super();
      const date_now = new Date();
      this.logger_file_name = file_name + Utilities.formatDate(date_now, 'Asia/Tokyo', 'yyyyMM') + ".txt";
      FolderUtils.get_or_create_dir(save_path);
      const file = FileUtils.get_or_create_file(save_path + "/" + this.logger_file_name, DocumentApp) as GoogleAppsScript.Document.Document;
      this.file = file.getBody().editAsText();
    }

    write_log(message: string) {
      this.file.appendText(message);
    }
  }

  class ConsoleAppender extends BaseAppender {
    write_log(message: string) {
      console.log(message);
    }
  }

  const loggers: any = {
    FileAppender,
    ConsoleAppender
  }

  export function create_appender(class_name: string, ...args: any[]): BaseAppender{
     if (loggers[class_name] === undefined || loggers[class_name] === null) {
      throw new Error(`Class type of \'${class_name}\' is not in the store`);
    }
    return new loggers[class_name](...args);
  }

  export function get_logger(): GasLogger{
    return new GasLogger();
  }
}
