const NotConnectedError = require('./NotConnectedError');
const WrongCredentialError = require('./WrongCredentialError');
const WrongDataError = require('./WrongDataError');
const WrongTokenError = require('./WrongTokenError');
const MissingInputError = require('./MissingInputError');
const AlreadyExistingError = require('./AlreadyExistingError');
const InconsistentStateError = require('./InconsistentStateError');
const NotOwnedError = require('./NotOwnedError');
const internal = require('./internal');
module.exports = {
	WrongCredentialError,
	WrongTokenError,
	NotConnectedError,
	MissingInputError,
	AlreadyExistingError,
	WrongDataError,
	InconsistentStateError,
	NotOwnedError,
	internal
};
