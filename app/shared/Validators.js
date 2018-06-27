const validators = {
	update: (validator) => !validator.createNew,
	create: (validator) => validator.createNew,
	read: (validator) => () => {
    console.log(validator);
    return true;
  },
	nonEmpty: (validator) => {
		return !(validator.value === null || validator.value.length === 0);
	}
};

module.exports = validators;
