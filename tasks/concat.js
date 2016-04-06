var gulp = require('gulp');
var ngjson = require('gulp-ng-json');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');
var es = require('event-stream');
var order = require("gulp-order");
var ngAnnotate = require('gulp-ng-annotate');

module.exports = function () {

    var that = this;
    var tplSrc = this.input(this.concatDir, ['**/*.tpl.html']);
    var jsSrc = this.input(this.concatDir, ['**/*.json', '**/*.js']);
    var vendorSrc = this.bowerComponents || [];

    var vendor = gulp.src(vendorSrc);

    var tpl = gulp.src(tplSrc)
        .pipe(templateCache({
            module: this.buildName,
            transformUrl: function (url) {
                return that.buildName + '/' + url.match(/[\w-.]+.tpl.html$/g)[0];
            }
        }));

    var js = gulp.src(jsSrc)
        .pipe(ngjson.module())
        .pipe(ngjson.constant())
        .pipe(ngjson.state());

    return es.merge(js, tpl, vendor)
        .pipe(order([
            "**/clickoutside.directive.js",
            "**/*.module.json",
            "**/*.module.js",
            "**/*.constant.json",
            "**/*.provider.js",
            "**/*.config.js",
            "**/*.state.json",
            "**/*.state.js",
            "**/*.js",
            "**/*.tpl.html"
        ]))
        .pipe(ngAnnotate({
            add: true,
            single_quotes: true
        }))
        .pipe(concat(this.buildName + '.js'))
        .pipe(gulp.dest(this.concatOutputDir));
}