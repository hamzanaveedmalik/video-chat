const winston = require('winston');
const util = require('util');

module.exports = function (env) {
	const logger = new (winston.Logger)({
		transports: [
			// colorize the output to the console
			new (winston.transports.Console)({
				colorize: true,
				prettyPrint: function (thing) {
					return util.format('%j', thing);
				},

			}),
		],
	});

	let level = 'silly';
	switch (env.toLowerCase()) {
		case 'debug':
			level = 'silly';
			break;
		case 'development':
			level = 'verbose';
			break;
		case 'production':
			level = 'info';
			break;
	}

	logger.level = level;
	logger.stream = {
		write: function (message, encoding) {
			logger.info(message);
		},
	};

	console.explicitLog = console.log;
	console.explicitErr = console.error;
	console.logger = logger;

	console.error = logger.error;
	console.warn = logger.warn;
	console.info = logger.info;
	console.log = logger.verbose;
	console.verbose = logger.verbose;
	console.debug = logger.debug;
	console.silly = logger.silly;

	return logger;

};
