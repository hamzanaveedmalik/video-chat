const keeper = [];

let environment = {
	req: null
}

function isIterable(obj) {
	if (!obj) {
		return false;
	}
	return typeof obj[Symbol.iterator] === 'function';
}

function _validateField(model, key, value, createNew, context) {
	const validatorObject = {
		model,
		createNew,
		key,
		value,
		context,
		environment
	};

	if (model instanceof Array)
		return model.some(e => e(validatorObject));
	else if (model instanceof Function)
		return !!model(validatorObject);
	else return model === true;
}

function checkKeeper(model, object, mode, createNew) {
	return !!keeper.find(f => f(model, object, mode, createNew));
}

function cleanSubObject(model, object, mode, createNew, baseModel, baseObject, path) {
	let isArray = false;
	let content;
	if (checkKeeper(model, object, mode, createNew)) {
		return object;
	}
	if (isIterable(model) && model[0].content) {
		isArray = true;
		content = model[0].content;
	}
	if (model.content) {
		content = model.content;
	}

	if (content) {
		if (isArray)
			content = [content];
		return cleanObject(content, object, mode, createNew, baseModel, baseObject, path);
	}
	return object;
}

function _computeCleanedObject(model, object, key, mode, createNew, baseModel, baseObject, path) {
	const keyModel = model[key];
	const value = object[key];

	if (value == null) return null;

	let currentPath = [...path, key];

	if (keyModel instanceof Array) {
		if (!isIterable(value))
			throw new Error('Model is array, but Value is not');

		const modeValidator = keyModel[0][mode];
		if (modeValidator && _validateField(modeValidator, key, value, createNew)) {
			return Array.from(cleanSubObject(keyModel, value, mode, createNew, baseModel, baseObject, currentPath));
		}
	}
	else if (keyModel === true)
		return cleanSubObject(keyModel, value, mode, createNew, baseModel, baseObject, currentPath);
	else if (mode in keyModel) {
		if (_validateField(keyModel[mode], key, value, createNew))
			return cleanSubObject(keyModel, value, mode, createNew, baseModel, baseObject, currentPath);
	}

}

function cleanObject(model, object, mode, createNew = false, baseModel, baseObject, path = []) {
	if (!model) return undefined;

	if (!baseModel) {
		baseModel = model;
		baseObject = object;
	}

	if (model instanceof Function || model.$handler) {
		const handler = model.$handler || model;
		const deflt = model.$default;
		model = handler(model, object, mode, createNew, baseModel, baseObject, path) || deflt;
		return cleanObject(model, object, mode, createNew, baseModel, baseObject, path);
	}

	if (object instanceof Array) {
		if (!(model instanceof Array)) throw new TypeError('Expected ' + typeof model + ', but received array' + object);
		model = model[0];
		return object.map((element, idx) => cleanObject(model, element, mode, createNew, baseModel, baseObject, [...path, idx]));
	}

	const cleanedObject = {};
	// loop over model keys
	for (let key in model) {
		const res = _computeCleanedObject(model, object, key, mode, createNew, baseModel, baseObject, path);
		if (res != null) cleanedObject[key] = res; // keeping false and 0
	}

	return cleanedObject;
}

function sanitizeApiInput(model, body, createNew) {
	return cleanObject(model, body, 'write', createNew);
}

function sanitizeApiOutput(model, body, createNew) {
	return cleanObject(model, body, 'read', createNew);
}

const handleInput = (req, model) => {
	switch (req.method) {
		case 'PUT':
			req.body = sanitizeApiInput(model, req.body, false);
			break;
		case 'DELETE':
			req.body = sanitizeApiInput(model, req.body, false);
			break;
		case 'POST':
			req.body = sanitizeApiInput(model, req.body, true);
			break;
	}
};

function setModel(model) {
	return (req, res, next) => {
		environment = {req};
		handleInput(req, model);
		res.locals.dataModel = model;
		next();
	};
}

function setInputModel(model) {
	return (req, res, next) => {
		environment = {req};
		handleInput(req, model);
		next();
	};
}

function setOutputModel(model) {
	return (req, res, next) => {
		environment = {req};
		res.locals.dataModel = model;
		next();
	};
}

function addKeeper(func) {
	keeper.push(func);
}

const validators = {
	update: (validator) => !validator.createNew,
	create: (validator) => validator.createNew,
	read: (validator) => true,
	nonEmpty: (validator) => {
		return !(validator.value === null || validator.value.length === 0);
	}
};

module.exports = {
	sanitizeApiOutput,
	sanitizeApiInput,
	setModel,
	setInputModel,
	setOutputModel,
	validators,
	addKeeper
};
