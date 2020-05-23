const determine = {
	Is(type = "object", sample,{}={}) {
		if (typeof type !== 'string') {
			sample = type
		}
		switch (type) {
			case 'int':
				return typeof sample === 'number' && sample % 1 === 0;
			case 'stringint':
				return parseInt(sample) == sample
			case 'object':
				return (sample && typeof sample === 'object' && !Array.isArray(sample));
			case 'array':
				return Array.isArray(sample)
			case 'empty':
                if (sample === null) return true;
				if (sample === undefined) return true;
				if (Array.isArray(sample)) return sample.length === 0 ? true : false;
                if (typeof sample === 'object'){
                    for (var key in sample) {
                        if (Object.prototype.hasOwnProperty.call(sample, key)) return false
                    }
                }
				return true
			default:
				return false;
		}
    },
    IsInt: (obj) => this.Is('int', obj),
	IsEmpty: (obj) => this.Is('empty', obj),
	IsObject: (obj) => this.Is('object', obj),
	IsArray: (obj) => this.Is('array', obj),
}

module.exports.Is = determine.Is
module.exports.IsInt = determine.IsInt
module.exports.IsEmpty = determine.IsEmpty
module.exports.IsObject = determine.IsObject
module.exports.IsArray = determine.IsArray