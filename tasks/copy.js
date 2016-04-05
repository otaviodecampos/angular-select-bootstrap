var gulp = require('gulp')
justfiles = require('./function/justfiles');

module.exports = function build() {

    var input = this.input(this.srcDir, [
        '**/*',
        '!module/**/*',
        '!assets/css/**/*',
        '!**/*.tpl.html'
    ]);

    return gulp.src(input)
        .pipe(justfiles())
        .pipe(gulp.dest(this.buildDir));
}