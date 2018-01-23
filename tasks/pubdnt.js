/*
 * grunt-pubdnt
 * https://github.com/maplesec/grunt-pubdnt
 *
 * Copyright (c) 2017 郗文枫
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('pubdnt', 'a tool for dnt publishment', function () {
        var options = this.options({});
        var target_server = options.target_server;
        var target_port = options.target_port;
        var username = options.username;
        var password = options.password;
        var docker_name = options.docker_name;

        var exec = require('child_process').exec;
        var client_scp = require('scp2');
        var Client = require('ssh2').Client;
        //异步操作
        var done = this.async();
        exec('rm -f dist.tar.gz', {cwd: "dist/"})
        console.log("compressing dist.tar.gz...")
        var cmdStr = "tar -zcvf dist.tar.gz *";
        exec(cmdStr, {cwd: "dist/"}, function (err, stdout, stderr) {
            if (err) {
                console.log('error:' + stderr + err);
                done(false);
            } else {
                target_server.forEach(function(v){
                    link_all_server(v)
                })
            }
        });

        function link_all_server(my_target_server){
            console.log("transfering to remote " + my_target_server + " server...")
            client_scp.scp('dist/dist.tar.gz', {
                host: my_target_server,
                username: username,
                password: password,
                path: '/root/'
            }, function (err, stdout) {
                if (err) {
                    console.log('error:' + stderr);
                    done(false);
                } else {
                    var docker_id = "$(docker ps -a | grep " + docker_name + " | grep Up | awk '{print $1}')";
                    console.log('ssh2 connecting...');
                    var conn = new Client();
                    conn.on('ready', function () {
                        console.log("unpressing files...");
                        conn.exec("docker cp dist.tar.gz $(docker ps -a | grep " + docker_name + " | grep Up | awk '{print $1}'):/code;  docker exec -i $(docker ps -a | grep " + docker_name + " | grep Up | awk '{print $1}') tar zxf /code/dist.tar.gz -C /code;", function (err, stream) {
                            if (err) {
                                done(false);
                            }
                            stream.on('close', function (code, signal) {
                                console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                                // done(true)
                                conn.end();
                            }).on('data', function (data) {
                                console.log('STDOUT2: ' + data);
                            }).stderr.on('data', function (data) {
                                console.log('STDERR: ' + data);
                                done(false);
                            });
                        });
                    }).connect({
                        host: my_target_server,
                        port: target_port,
                        username: username,
                        password: password
                    });
                }
            });
        }
    });
};
