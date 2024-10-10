

//use chrome extension - to send minimal messages to chatgpt -- mostly for archival etc
//dont get bnned

// To set up a cron job to execute this file using bun every 5 minutes, you can add the following line to your crontab:


function cron () {
bun.exec('crontab', ['-l'], (err, stdout, stderr) => {
    if (err) {
        console.error('Error listing crontab:', stderr);
        return;
    }
    const cronJob = '*/5 * * * * /usr/local/bin/bun /path/to/js/hardware_/hardware-company-helper.js';
    if (!stdout.includes(cronJob)) {
        const newCron = `${stdout}\n${cronJob}\n`;
        bun.exec('crontab', ['-'], (err, stdin) => {
            if (err) {
                console.error('Error updating crontab:', stderr);
            } else {
                stdin.write(newCron);
                stdin.end();
                console.log('Cron job added successfully.');
            }
        });
    } else {
        console.log('Cron job already exists.');
    }
});
}
