'use strict'
const LazyEither = require('lazy-either').LazyEither
    , expect     = require('chai').expect

const S  = require('sanctuary')
    , Do = require('../index')


describe('Do Maybe', function() {
  it('should unbox all of the maybe values and return toString', function() {
    let maybeString = Do(function*() {
      let foo = yield S.Maybe.of('foo')
      expect(foo).to.equal('foo')

      let bar = yield S.Maybe.of('bar' + foo)
      expect(bar).to.equal('barfoo')

      let baz = yield S.Maybe.of('baz' + bar)
      expect(baz).to.equal('bazbarfoo')
    }).toString()

    expect(maybeString).to.equal('Just("bazbarfoo")')
  })

  it('should return the return value if given instead of the last monad value', function() {
    let maybeString = Do(function*() {
      let foo = yield S.Maybe.of('foo')
      expect(foo).to.equal('foo')

      let bar = yield S.Maybe.of('bar' + foo)
      expect(bar).to.equal('barfoo')

      let baz = yield S.Maybe.of('baz' + bar)
      expect(baz).to.equal('bazbarfoo')

      return S.Just('norf')
    }).toString()

    expect(maybeString).to.equal('Just("norf")')
  })

  it('should short circuit execution and return Nothing() toString', function() {
    let maybeString = Do(function*() {
      let foo = yield S.Maybe.of('foo')
      expect(foo).to.equal('foo')

      yield S.Nothing()  // short circuits rest of the execution

      expect(true).to.be.false  // never executed
      yield S.Maybe.of('baz')   // never executed
    }).toString()

    expect(maybeString).to.equal('Nothing()')
  })
})



describe('Do LazyEither', function() {
  it('should be able to handle deferred execution', function(done) {
    let lateCall = name =>  LazyEither(resolve => {
      setTimeout(() => {
        return resolve(S.Right(`Hello, ${name}.`))
      }, 1000)
    })

    let startTime = Date.now()
    Do(function*() {
      let name = yield LazyEither.of('Risto')
      expect(name).to.equal('Risto')

      let greet = yield lateCall(name)
      expect(greet).to.equal('Hello, Risto.')

      let friendly = yield LazyEither.of(`${greet} How are you?`) 
      expect(friendly).to.equal('Hello, Risto. How are you?')
    }).value(result => {
      let endTime = Date.now()
      expect(result).to.deep.equal(S.Right('Hello, Risto. How are you?'))
      expect(endTime - startTime).to.be.closeTo(1000, 100)
      done()
    })
  })
})
