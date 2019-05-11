// 
module.exports = function (grunt) {
  grunt.initConfig({
    ts: {
      default: {
        tsconfig: './tsconfig.json'
      }
    },
    tslint: {
      options: {
        configuration: './tslint.json',
        project: './tsconfig.json',
        force: true
      },
      files: {
        src: [
          "src/**/*.{ts,tsx}"
        ]
      }
    },
    copy: {
      default: {
        files: [
          { expand: true, cwd: 'src/views', src: ['**'], dest: 'dist/views' },
          { expand: true, cwd: 'src/public', src: ['**'], dest: 'dist/public' },
        ]
      }
    }
  });
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks("grunt-tslint");
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.registerTask("default", ["ts", "tslint", "copy"]);
};