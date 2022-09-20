import { config } from '#core/config';
import { createLogger, format, transports } from 'winston';


// =============================================================================


/* The top level global logger; this gets instantiated lazily as needed, and
 * contains the overall log handle. We don't actually log with this, and instead
 * we create child loggers for the various subsystems so that we can separate
 * their logs out as needed. */
let globalLogger = undefined;

/* The list of child loggers; once created they are never removed; We key the
 * dictionary on the subsystem name with the values being the required child
 * logger. */
const loggers = {}


// =============================================================================


/* Creates and returns a logging object that can be used to send output to the
 * console; this uses the configuration system to determine what the output
 * log level should be. */
function createAppLogger() {
  // Get the core log object
  const logger = createLogger({
    level: config.get('logging.level'),
    format: format.errors({ stack: true })
  });

  // Add in a console log transport; for the moment we're using Heroku and
  // papertrail, so we don't need any transports that send output to files or
  // the database, though they could be added.
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.timestamp({format: config.get('logging.timestamp')}),
      format.printf(({level, message, subsystem, timestamp, stack}) => {
        return `${timestamp} [${level}] ${subsystem}: ${stack || message}`;
      })
    )
  }));

  return logger;
}


// =============================================================================


/* Obtain the logger handle for the logger that is for logs from the provided
 * subsystem. This will lazily instantiate either the parent logger or the
 * required child logger for the subsystem as needed. */
export function logger(subsystem) {
  if (globalLogger === undefined) {
    globalLogger = createAppLogger();
  }

  if (subsystem in loggers === false) {
    loggers[subsystem] = globalLogger.child( { subsystem });
  }

  return loggers[subsystem];
}


// =============================================================================
