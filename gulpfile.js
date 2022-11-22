import gulp from 'gulp';
import browserSync from 'browser-sync';
import csso from 'gulp-csso';
import htmlmin from 'gulp-htmlmin';
import gulpSass from 'gulp-sass';
import sass from 'sass';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import {deleteAsync} from 'del';
import webp from 'gulp-webp';
// import webpConverter from 'webp-converter';
// import glob from 'glob';


const outputPath = "./dist";
const sync = browserSync.create();

function html() {
    return gulp.src('app/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(outputPath));
}

function scss() {
    return gulp.src('app/**/*.scss')
        .pipe(gulpSass(sass)())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions']
        }))
        .pipe(csso())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(outputPath));
}

function img() {
    return gulp.src('app/img/*.*')
        .pipe(webp())
        .pipe(gulp.dest(outputPath+"/img"));
}

//При конвертации gif в webp обработка файлов завершается после загрузки страницы, и на странице они не отображаются до завершения функции, надо дождаться завершения и перезагрузить страницу, поэтому пришлось убрать функцию для конвертации, и файлы gif переносятся в dist в функции img без конвертации
//
// function gif() {
//     return glob("app/img/*.gif", {}, (er, files) => {
//         files.forEach(d => 
//             webpConverter.gwebp(d, outputPath+"/img/"+d.substring(d.lastIndexOf('/') + 1).split('.')[0]+".webp","-q 80")
//             )
//     });
// }

function clear() {
    return deleteAsync(outputPath);
}

function watch() {
    sync.init({
        server: outputPath
    });

    gulp.watch('app/**/*.html', html).on('change', sync.reload);
    gulp.watch('app/**/*.scss', scss).on('change', sync.reload);
}

const build = gulp.series(clear, gulp.parallel(html, scss, img));
const serve = gulp.series(build, watch);

export {
    build,
    serve
}

export default build;