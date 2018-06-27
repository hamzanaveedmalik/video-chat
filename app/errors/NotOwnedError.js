module.exports = class NotOwnedError extends Error {
	constructor(element) {

		// Calling parent constructor of base Error class.
		super('Not owned element: '+ element);

		// Saving class name in the property of our custom error as a shortcut.
		this.name = this.constructor.name;

		// Capturing stack trace, excluding constructor call from it.
		Error.captureStackTrace(this, this.constructor);

		// You can use any additional properties you want.
		// I'm going to use preferred HTTP status for this error types.
		// `500` is the default value if not specified.
		this.status = 404;

	}
};