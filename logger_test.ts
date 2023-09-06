function custom_logger_test(){
  const logger = GasLogger.get_logger();
  logger.add_logger(GasLogger.create_appender("FileLogger", "logging_test", "test"))
  logger.add_logger(GasLogger.create_appender("ConsoleLogger", "logging_test", "test"))

  logger.write_log("new log");
  logger.write_log("new_log2");
}