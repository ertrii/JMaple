const gulp = require('gulp'),
        sass = require('gulp-sass'),
        autoprefixer = require('gulp-autoprefixer');

let style = 'modern';
let min = true;
gulp.task('sass', () => 
    gulp.src(`./scss/${style}.scss`)
        .pipe(sass({
                outputStyle: (!min) ? 'expanded' : 'compressed',//compact, compressed/ expanded
                sourceComments: false
        }))
        .pipe(autoprefixer({
                versions: ['last 2 browsers']
        }))
        .pipe(gulp.dest((!min) ? './dist/css/' : './dist/css/min/'))
);

gulp.task('default', () => {
        gulp.watch(`./scss/${style}.scss`, ['sass']);
})