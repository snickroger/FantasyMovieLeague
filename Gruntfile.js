// 
module.exports = function (grunt) {
  grunt.initConfig({
    ts: {
      default: {
        tsconfig: './tsconfig.json'
      }
    },
    eslint: {
      target: ["src/**/*.{ts,tsx}"]
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
  grunt.loadNpmTasks("grunt-eslint");
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.registerTask("default", ["ts", "eslint", "copy"]);
};