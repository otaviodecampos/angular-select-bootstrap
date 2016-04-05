var gulp = require('gulp');
var es = require('event-stream');
var justfiles = require('./function/justfiles');

module.exports = function build() {

    var srcs = [];

    this.vendorCopyDir.forEach(function(dir) {
        var input = [].concat(dir);
        srcs.push(gulp.src(input, { base: process.cwd() }));
    });

    return es.merge(srcs)
        .pipe(justfiles())
        .pipe(gulp.dest(this.vendorOutputCopyDir));
}