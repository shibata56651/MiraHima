const {src, dest, series, watch} = require('gulp');
/*
 * const ejs = require('gulp-ejs');
 * const rename = require('gulp-rename');
 */
const browserSync = require('browser-sync');
const connectSSI = require('connect-ssi');
const sass = require('gulp-sass')(require('sass'));

// function ejsCompile(done) {
//     src(['_dev/ejs/**/*.ejs', '!' + '_dev/ejs/inc/*.ejs']).
//         pipe(ejs()).
//         pipe(rename({extname: '.html'})).
//         pipe(dest('docs/'));
//     done();
// }

function sassCompile(done) {
    src('_dev/sass/**/*.scss').
    // コンパイル実行
        pipe(sass({
            outputStyle: 'expanded',
        })).
    // ファイル格納
        pipe(dest('docs/common/css/')).
        pipe(browserSync.stream());

    browserSync.reload();
    done();
}


// ファイルの監視
function watchTask(done) {
    // watch(['_dev/ejs/**/*.ejs'], ejsCompile);
    watch(['_dev/sass/**/*.scss'], sassCompile);
    done();
}

// ブラウザシンク
function browserSyncTask(done) {
    browserSync({
        server: {
            baseDir: './docs/', // ルートとなるディレクトリを指定
        },
        startPath: '/index.html',
    middleware: [
      connectSSI({
        baseDir: './docs',
        ext: '.html'
      })
    ]
    });
    done();
}

exports.default = series(watchTask, browserSyncTask, sassCompile);
