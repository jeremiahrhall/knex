import {isNull, isArray, isString, isNumber} from 'lodash/lang'

const COMPLETED = {}
const DONE      = {done: true,  value: undefined}
const SPACE     = {done: false, value: ' '}

export default class LazyQuery {

  constructor(coll, hooks, root) {
    this.root    = root
    this.idx     = 0
    this.pending = []
    this.current = coll
    this.hooks   = hooks
    this.space   = false
  }

  next() {
    var nextVal
    var current = this.current

    if (current === COMPLETED) return DONE

    if (this.space) {
      this.space = false
      return SPACE
    }

    if (typeof current === 'function') {
      nextVal = current(this.root)
    }

    // If the current item is an array, we use that
    // that as the current iterator.
    else if (isArray(current)) {
      if (this.idx > current.length) {
        return this.__releasePending()
      }
      nextVal = current[this.idx++]
    }

    // If the item is iterable, we get the next value.
    else if (current && typeof current.next === 'function') {
      nextVal = current.next()
      if (nextVal.done === true) {
        return this.__releasePending()
      }
    } 

    else if (current && current.compile) {
      this.current = current.compile()
      return this.next()
    }

    // If the items isn't a function, array, or iterable, it's an error.
    else {
      throw new Error(`Invalid value ${current}`)
    }

    return this.__handleNext(nextVal)
  }

  __handleNext(nextVal) {
    if (nextVal === undefined) {
      return this.next()
    }
    if (isString(nextVal) || isNumber(nextVal) || isNull(nextVal)) {
      return {value: nextVal, done: false}
    }
    if (typeof nextVal.compile === 'function') {
      if (nextVal.type && this.hooks[nextVal.type]) {
        return this.__handleNext(this.hooks[nextVal.type](() => {
          return nextVal.compile()
        }, this.root, this))
      }
      return this.__handleNext(nextVal.compile())
    }
    this.pending.push([this.current, this.idx])
    this.idx     = 0
    this.current = nextVal
    return this.next()
  }

  __releasePending() {
    if (this.pending.length > 0) {
      [this.current, this.idx] = this.pending.pop()
      return this.next()
    }
    return DONE
  }

  [Symbol.iterator]() {
    return this
  }

}