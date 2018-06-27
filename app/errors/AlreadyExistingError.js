module.exports = class AlreadyExistingError extends Error {
	constructor(notification) {

		// Calling parent constructor of base Error class.
		super(`Notification [${notification.title}] with id [${notification._id}] does not have a payload. 
		Manually delete this notification may solve the problem`);

		// Saving class name in the property of our custom error as a shortcut.
		this.name = this.constructor.name;

		// Capturing stack trace, excluding constructor call from it.
		Error.captureStackTrace(this, this.constructor);

		// You can use any additional properties you want.
		// I'm going to use preferred HTTP status for this error types.
		// `500` is the default value if not specified.
		// this.status = 403;

	}
};