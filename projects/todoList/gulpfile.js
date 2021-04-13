"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
sass.compiler = require("node-sass");

function compileSass() {
  return gulp
    .src("./scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(gulp.dest("./css"));
}
gulp.task("watch", () => {
  gulp.watch("./scss/**/*.scss", compileSass);
});
