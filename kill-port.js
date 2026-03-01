const { exec } = require('child_process');
const http = require('http');

console.log("Attempting to close port 3000...");

exec("get-process node | stop-process -force", { shell: "powershell.exe" }, (error, stdout, stderr) => {
    if (error) {
        console.log("Powershell stop-process failed or no node processes found.");
    } else {
        console.log("Killed node processes via powershell");
    }
});
