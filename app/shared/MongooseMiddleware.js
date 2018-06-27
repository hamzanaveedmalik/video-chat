const Rest = require('./Rest');
const TypeObjectId = require('mongoose').Types.ObjectId;

let mongooseReference;

function runQuery(req, options, query) {
	return new Promise(function(resolve, reject) {
		return query.model.count(query._conditions, function(err, total) {
			let message;
			if (err) {
				return reject(err);
			}

			query.where(options.where);

			if (options.newerThan) {
				let limit = {
					[options.comparisonField]: {$gt: options.newerThan}
				};
				if (options.keepNoTimestamps)
					limit = {$or: [limit, {[options.comparisonField]: {$exists: false}}]};
				query.where(limit);
			}

			if (options.olderThan) {
				let older = {
					[options.comparisonField]: {$lte: options.olderThan}
				};
				if (options.keepNoTimestamps)
					older = {$or: [older, {[options.comparisonField]: {$exists: false}}]};
				query.where(older);
			}
			else {
				query.skip(options.start);
				req.res.append('Warning', 'DEPRECATED WARNING: start is deprecated, please use newerThan instead');
			}

			return query
				.limit(options.count)
				.sort({[options.sortBy]: options.sortOrder})
				.exec(function(err, results) {

					if (err) {
						return reject(err);
					}
					else if (req.method === 'PUT' && !results) {
						return reject(new Error('Entry not found'));
					}
					results.___message = message;
					return resolve(results);
				});
		});
	});
}

module.exports.init = (mongoose) => {
	//store reference to mongoose
	mongooseReference = mongoose;

	mongooseReference.Query.prototype.customExec = function(req, callback, options) {
		//validate fields
		if (req.query.sortOrder !== 'asc' && req.query.sortOrder !== 'desc') {
			delete req.query.sortOrder;
		}

		//maximum number of docs to return
		const maxDocs = 1000;
		const defaults = {
			start: (req.query.start) ? parseInt(req.query.start) : 0,
			newerThan: (req.query.newerThan) ? new Date(req.query.newerThan) : null,
			olderThan: (req.query.olderThan) ? new Date(req.query.olderThan) : null,
			comparisonField: (req.query.sortBy) || (req.query.comparisonField) || 'updatedAt',
			keepNoTimestamps: (req.query.keepNoTimestamps),
			count: (req.query.limit) ? parseInt(req.query.limit) : maxDocs,
			sortBy: (req.query.sortBy) ? req.query.sortBy : '_id',
			sortOrder: (req.query.sortOrder) ? req.query.sortOrder : 'asc'
		};
		for (const key in defaults)
			delete req.query[key];
		const query = this;

		//merge default values with custom options for this call
		options = {...defaults, options};

		//building the pagination
		options.start = (options && options.start && parseInt(options.start, 10) ? parseInt(options.start, 10) : defaults.start);
		if (options.olderThan)
			delete options.start;

		options.count = (options && options.count && parseInt(options.count, 10) ? parseInt(options.count, 10) : defaults.count);
		//limit the maximum number to maxDocs
		if (maxDocs > 0 && (options.count > maxDocs || options.count === 0)) {
			options.count = maxDocs;
		}

		options.where = getWhereFromRequest(req, query);

		if (options.sortBy !== '_id') {
			options.comparisonField = options.sortBy;
		}
		if (query.options.sort) {
			options.comparisonField = Object.keys(query.options.sort)[0];
			console.log(options.where.sort);
		}

		// if no callback is supplied, return a Promise
		if (typeof callback === 'undefined') {
			return runQuery(req, options, query);
		}

		// execute and utilize the callback
		return runQuery(req, options, query)
			.then(function(result) {
				return callback(null, result);

			})
			.catch(function(err) {
				return callback(err);
			});

	};
};

/**
 * retrieves from the request WHERE information. Field not in path and disallow by the APIValidators are excluded
 * @param req the request
 * @param query the mongoose Query
 * @returns {g*}
 */
let getWhereFromRequest = function(req, query) {

	const paths = Object.keys(query.schema.paths);
	/*

	 function isFieldFilterable(key) {
	 if (paths.includes(key)) {
	 const modelField = query.schema.paths[key].options;
	 return Rest.validateField(modelField, key, 'skipEmtpy', 'read');
	 }
	 return false;
	 }
	 */

	// select fields
	return Object.keys(req.query)
	             .reduce((obj, key) => {
		             obj[key] = req.query[key];
		             return obj;
	             }, {});
};

function getObjectId(object, cast = false) {
	let objectId = object;
	if (!TypeObjectId.isValid(object)) {
		if (object._id && TypeObjectId.isValid(object._id))
			objectId = object._id;
		else
			return undefined;
	}
	if (cast)
		objectId = new TypeObjectId(objectId);
	return objectId;
}

TypeObjectId.getObjectId = getObjectId;
