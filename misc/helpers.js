function createCsp(o) {
  return Object.keys(o)
    .map(p => p + ' ' + o[p].join(' '))
    .join('; ');
}

exports.createCsp = createCsp;
