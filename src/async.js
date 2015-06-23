function AsyncResolvers(onFailedOne, onResolvedAll) {
	this.onResolvedAll = onResolvedAll;
	this.onFailedOne = onFailedOne;
	this.resolvers = {};
	this.resolversCount = 0;
	this.passed = [];
	this.failed = [];
	this.firing = false;
};

AsyncResolvers.prototype = {

	/**
	 * Add resolver
	 *
	 * @param {Rule} rule
	 * @param {integer} index
	 */
	add: function(rule, index) {
		this.resolvers[index] = rule;
		this.resolversCount++;
	},

	/**
	 * Resolve given rule
	 *
	 * @param  {Rule}
	 * @param  {integer} index
	 * @return {void}
	 */
	resolve: function(index) {
		var rule = this.resolvers[index];
		if (rule.passes === true) {
			this.passed.push(rule);
		}
		else if (rule.passes === false) {
			this.failed.push(rule);
			this.onFailedOne(rule);
		}

		this.fire();
	},

	/**
	 * Determine if all have been resolved
	 *
	 * @return {boolean}
	 */
	isAllResolved: function() {
		return (this.passed.length + this.failed.length) == this.resolversCount;
	},

	/**
	 * Attempt to fire final all resolved callback if completed
	 *
	 * @return {void}
	 */
	fire: function() {

		if (!this.firing) {
			return;
		}

		if (this.isAllResolved()) {
			this.onResolvedAll(this.failed.length === 0);
		}

	},

	/**
	 * Enable firing
	 *
	 * @param {void}
	 */
	enableFiring: function() {
		this.firing = true;
	}

};

module.exports = AsyncResolvers;