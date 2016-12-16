import * as gulp from 'gulp';
import * as changedInPlace from 'gulp-changed-in-place';
import * as changed from 'gulp-changed';
import * as merge from 'merge-stream';
import * as project from '../aurelia.json';

export default function dist() {
  const taskScripts = gulp.src(`${project.platform.output}/**/*`, { passthrough: true })
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(gulp.dest(`${project.paths.dist}/scripts`));

  const taskRootFiles = gulp.src(['./index.html', './favicon.ico'])
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(gulp.dest(project.paths.dist));

  return merge(taskScripts, taskRootFiles);
}