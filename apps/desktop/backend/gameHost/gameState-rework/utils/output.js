module.exports = function output(err,data) {
  return {
    success: !err,
    error: err
  }
}
