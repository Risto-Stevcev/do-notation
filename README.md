# Do Notation

[![Build Status](https://travis-ci.org/Risto-Stevcev/do-notation.svg)](https://travis-ci.org/Risto-Stevcev/do-notation)

Do notation for Fantasy Land monad types.

[![Fantasy Land](https://github.com/fantasyland/fantasy-land/raw/master/logo.png)](https://github.com/fantasyland/fantasy-land/)


## Examples

It uses `yield` to "unbox" the Monad (the `<-` in Haskell), which can then be transformed and fed to the next Monad in the `Do` block. The `Do` function returns the last Monad in the `Do` block:

```js
const Do = require('do-notation')

let maybeString = Do(function*() {
  let foo = yield S.Maybe.of('foo')
  console.log(foo)
  // 'foo'

  let bar = yield S.Maybe.of('bar' + foo)
  console.log(bar)
  // 'barfoo'

  let baz = yield S.Maybe.of('baz' + bar)
  console.log(baz)
  // 'bazbarfoo'

}).toString()

console.log(maybeString)
// 'Just("bazbarfoo")'
```


## Implementation

The entire implementation is very succinct and simple:

```js
Do = function(generatorFunction) {
  const generator = generatorFunction()

  return function next(error, v) {
    const res = generator.next(v)

    if (res.done)
      return res.value
    else
      return res.value.chain((v) => next(null, v) || res.value.of(v))
  }()
}

module.exports = { Do: Do }
```
