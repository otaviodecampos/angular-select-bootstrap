var gulp = require('gulp')
    , less = require('gulp-less')
    , concat = require('gulp-concat');

module.exports = function () {

    return gulp.src(this.input(this.cssDir, [this.buildName + '.less']))
        .pipe(less())
        .pipe(concat(this.buildName + '.css'))
        .pipe(gulp.dest(this.cssOutputDir));

}