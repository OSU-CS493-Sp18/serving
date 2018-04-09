function area(r) {
  return 3.1415 * r * r;
}

module.exports = {
  area: area,

  circumference: function (r) {
    return 3.1415 * 2 * r;
  }
};
