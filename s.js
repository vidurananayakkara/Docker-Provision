var Docker = require('dockerode');
var sh = require('shelljs'); // To issue shell commands
var docker = new Docker({
    socketPath: '/var/run/docker.sock'
});


// Clear all containers
var clearAllContainers = function () {
    sh.exec('docker rm `docker ps --no-trunc -aq`', {
        silent: true
    }).output;
}

// Run commands
docker.createContainer({
    Image: 'ncthis/ceresi',
    Cmd: ['/bin/ls', '/stuff'],
    "Volumes": {
        "/stuff": {}
    }
}, function (err, container) {

    // Attach container
    container.attach({
        stream: true,
        stdout: true,
        stderr: true,
        tty: true
    }, function (err, stream) {
        stream.pipe(process.stdout);

        // Start container
        container.start({
            "Binds": ["/home/vagrant:/stuff"]
        }, function (err, data) {
            // Something to do
            console.log("Container is now started...");

            // Run docker container
            docker.run('jolly_almeida', ['bash', '-c', 'uname -a'], [process.stdout, process.stderr], {
                Tty: false
            }, function (err, data, container) {
                console.log(err);
                console.log(data.StatusCode);
            });

            console.log("Container stopped");
        });
    });
});