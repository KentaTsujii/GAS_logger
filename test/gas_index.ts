import {create_appender, get_logger} from '../src/index';

function custom_logger_test(){
  let logger = get_logger();
  logger.add_appender(create_appender("FileAppender", "logging_test", "test"));
  logger.add_appender(create_appender("ConsoleAppender", "logging_test", "test"));

  logger.write_log("new log");
  logger.write_log("new_log2");
}
