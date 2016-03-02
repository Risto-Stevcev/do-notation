Do = function(generatorFunction) {
  const generator = generatorFunction()

  return function next(error, v) {
    const res = generator.next(v)

    if (res.done)
      return
    else
      return res.value.chain((v) => next(null, v) || res.value.of(v))
  }()
}

module.exports = { Do: Do }
