const Sanitization = require('sanitization');
const mongoose = require('mongoose');

const models = new Map();

Sanitization.addKeeper((model, object, mode, createNew) => {
	if (object instanceof Array) return object.some(element => mongoose.Types.ObjectId.isValid(element));
	return mongoose.Types.ObjectId.isValid(object);
});

function inMongooseGeneratedVariables(key) {
	return ['_id', 'createdAt', 'updatedAt'].includes(key);
}

function constructSanitizationFromModelArray(schema, extension) {
	return [constructSanitizationFromModel(schema[0], extension)];
}

function constructSanitizationFromModelName(name) {
	const model = mongoose.model(name);
	if (model)
		return constructSanitizationFromModel(model);
}

function emptyObject(obj) {
	return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function retrieveRefPath(currentModel, object, currentPath) {
	let refPath = currentModel.refPath.split('.');
	let path = [...currentPath];
	const lastIndex = path.lastIndexOf(refPath[0]);

	for (let i = 0; i < lastIndex; i++) {
		let currentKey = path.shift();
		object = object[currentKey];
	}
	while (refPath.length > 0) {
		if (object instanceof Array) {
			const index = path.shift();
			if (typeof index !== 'number' && !index) throw new TypeError('The provided path is not a number');
			object = object[index];
		}
		else if (path[0] === refPath[0]) {
			object = object[path[0]];
			path.shift();
			refPath.shift();
		}
		else { // two branches diverged, keeping only refPath
			path = [];
			let key = refPath.shift();
			object = object[key];
		}

		if (!object) throw new Error('Error in path!');
	}

	if (typeof object === 'string')
		return constructSanitizationFromModelName(object);
	else return object;
}

function _retrieveModelFromKey(schema, key) {
	let isArray = false;
	let value = {};

	let currentModel = schema.tree[key];
	if (currentModel instanceof Array) {
		currentModel = currentModel[0];
		isArray = true;
	}

	if (currentModel instanceof mongoose.VirtualType) {
		currentModel = currentModel.options;
	}

	if (currentModel.virtual && currentModel.virtual.api) {
		value = currentModel.virtual.api;
		if (currentModel.ref) {
			value.content = constructSanitizationFromModelName(currentModel.ref);
		}

		if (currentModel.refPath) {
			value.content = (_, __, ___, ____, _____, object, currentPath) => retrieveRefPath(currentModel, object, currentPath);
		}
	}
	else if (inMongooseGeneratedVariables(key)) {
		value = {
			read: true
		};
	}
	else if (key === 'id') {
		value = {
			read: (validators) => validators.value instanceof Array
		};
	}
	else if (currentModel instanceof mongoose.Schema) {
		value = {
			read: true,
			write: true,
			content: constructSanitizationFromModel(currentModel)
		};
	}
	if (!emptyObject(value) && isArray) value = [value];
	return value;

}

function _applyExtension(model, extension) {
	if (!extension) return model;

	if (model instanceof Function || model.$handler)
		throw new Error('No applicable to functions');

	if (model instanceof Array) {
		return [{...model[0], ...extension}];
	}
	return {...model, ...extension};
}

/**
 * transform a Mongoose model to a sanitization model
 * @param sanitizationModel - the mongoose model
 * @param [extension] - an extension, to be applied to and only to discriminator, any other case must be done from the result of this function
 * @return {*} - the sanitization model
 */
function constructSanitizationFromModel(sanitizationModel, extension) {
	const schema = sanitizationModel.schema || sanitizationModel;
	let modelName = sanitizationModel.modelName;
	const model = {};

	if (modelName) {
		const saved = models.get(modelName);
		if (saved)
			return saved;
	}

	if (sanitizationModel.discriminators) {
		const discriminatorModel = {
			$handler: (model, object) => {
				const modelName = object[sanitizationModel.schema.options.discriminatorKey];
				if (modelName)
					return _applyExtension(_computeModel(modelName), extension);
			},
			$default: () => _applyExtension(model, extension) // we do not want to cache extension
		};
		if (modelName)
			models.set(modelName, discriminatorModel);
	}
	else if (modelName)
		models.set(modelName, model);

	for (let key in schema.tree) {
		const value = _retrieveModelFromKey(schema, key);
		if (!emptyObject(value)) model[key] = value;
	}

	return sanitizationModel.discriminators ? models.get(modelName) : model;
}

function _computeMidexModel(model, extension) {
	if (model.name && model.name === 'model' && model.schema) return constructSanitizationFromModel(model, extension);
	model = {...model, ...extension};
	const ret = {};
	for (let key in model) {
		const currentModel = model[key];
		ret[key] = currentModel;
		if (currentModel.content)
			ret[key].content = _computeMidexModel(currentModel.content);

	}
	return ret;
}

/**
 * create a model from a mongoose model
 * @param {String|mongoose.Model|Object} model - either a model name, or a model
 * @param extension - an extension, to be applied only to discriminators
 * @return {*} - a sanitization model
 */
function _computeModel(model, extension) {

	if (model instanceof Array) {
		model = model[0];
		if (typeof model === 'string') model = mongoose.model(model);
		return constructSanitizationFromModelArray([model], extension);
	}

	if (typeof model === 'string') model = mongoose.model(model);
	if (model instanceof mongoose.Model)
		return constructSanitizationFromModel(model, extension);
	else return _computeMidexModel(model, extension);
}

/**
 * create a model from a mongoose model, and apply to it an extension
 * @param {String|mongoose.Model|[String]|[mongoose.Model]|Object} model - either a model name, or a model
 * @param extension - an extension model
 * @return {*} - a sanitization model
 */
function setExtendedModel(model, extension) {
	const baseModel = _computeModel(model, extension);
	return Sanitization.setModel(_applyExtension(baseModel, extension));
}

/**
 * create a model from a mongoose model
 * @param {String|mongoose.Model|[String]|[mongoose.Model]|Object} model - either a model name, or a model
 * @return {*} - a sanitization model
 */
function createModel(model) {
	return _computeModel(model);
}

/**
 * create a model from a mongoose model
 * @param {String|mongoose.Model|[String]|[mongoose.Model]|Object} model - either a model name, or a model
 * @return {*} - a sanitization model
 */
function setModel(model) {
	return Sanitization.setModel(_computeModel(model));
}

/**
 * set a model from a mongoose model to apply to input only
 * @param {String|mongoose.Model|[String]|[mongoose.Model]|Object} model - either a model name, or a model
 * @return {*} - a sanitization model
 */
function setInputModel(model) {
	return Sanitization.setInputModel(_computeModel(model));
}

/**
 * set a model from a mongoose model to apply to output only
 * @param {String|mongoose.Model|[String]|[mongoose.Model]|Object} model - either a model name, or a model
 * @return {*} - a sanitization model
 */
function setOutputModel(model) {
	return Sanitization.setOutputModel(_computeModel(model));
}

module.exports = {
	setModel,
	setExtendedModel,
	createModel,
	setInputModel,
	setOutputModel
};


