# grunt-pubdnt

> A tool for publishing to docker

> 一个简单的插件，可以把本地的代码更新到服务器docker容器内

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-pubdnt --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-pubdnt');
```

## The "pubdnt" task

### Usage Examples

#### Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  pubdnt: {
    default_options: {
      options: {
          target_server: ["host_ip"],
          target_port:"host_port",
          username:"your_name",
          password:"your_password",
          docker_name:"docker_name"
      }
    },
  }
});
```

## Release History
_(Nothing yet)_
