const winston = require('winston')
const winstonChildLogger = require('winston-child-logger')
const winstonSentryTransport = require('winston-sentry-transport')

require('winston-loggly-bulk')

const config = require('./config')

const logger = winstonChildLogger(new winston.Logger())

logger.levelLength = 7
logger.padLevels = true

logger.filters.push((_, message, meta) => {
  if (!message && meta instanceof Error) {
    return meta.stack || meta.message
  }
  return message
})

if (config.logger.console) {
  logger.add(winston.transports.Console, config.logger.console)
}

if (config.logger.sentry) {
  logger.add(winstonSentryTransport, config.logger.sentry)
}

if (config.logger.loggly && config.logger.loggly.inputToken) {
  logger.add(winston.transports.Loggly, config.logger.loggly)
}

module.exports = logger
