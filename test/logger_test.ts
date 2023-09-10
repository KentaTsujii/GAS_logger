function custom_logger_test(){
  const logger = GasLogger.get_logger();
  logger.add_logger(GasLogger.create_appender("FileAppender", "logging_test", "test"))
  logger.add_logger(GasLogger.create_appender("ConsoleAppender", "logging_test", "test"))

  logger.write_log("new log");
  logger.write_log("new_log2");
}