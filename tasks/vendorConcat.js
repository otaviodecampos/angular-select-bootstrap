var gulp = require('gulp')
    , concat = require('gulp-concat');

module.exports = function () {

    return gulp.src(this.vendorConcatDir)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(this.concatOutputDir));

}