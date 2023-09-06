class CustomLogger {

  loggers: BaseLogger[]

  constructor() {
    this.loggers = [];
  }

  add_logger(logger: BaseLogger) {
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

class BaseLogger {
  write_log(message: string): void {
    // ベースクラスのためなにもしない
  }
}

class FileLogger extends BaseLogger {

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

class ConsoleLogger extends BaseLogger {
  write_log(message: string) {
    console.log(message);
  }
}

function custom_logger_test(){
  const logger = new CustomLogger();
  logger.add_logger(new FileLogger("logging_test", "test"));
  logger.add_logger(new ConsoleLogger());

  logger.write_log("new log");
  logger.write_log("new_log2");
}