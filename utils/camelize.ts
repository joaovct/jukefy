import _ from "lodash"

export function camelize(obj: Object){
    return _.transform(obj, (acc: any, value, key, target) => {
        const camelKey = _.isArray(target) ? key : _.camelCase(key)
        acc[camelKey] = _.isObject(value) ? camelize(value) : value
    })
}