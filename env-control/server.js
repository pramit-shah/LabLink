// env-control/server.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { exec } = require('child_process');
require('dotenv').config();

app.use(bodyParser.json());

app.post('/command', (req, res) => {
    const { user, pass, command } = req.body;

    if (user !== process.env.USERNAME || pass !== process.env.PASSWORD)
        return res.status(403).json({ error: 'Unauthorized' });

    const [cmdBase] = command.split(' ');
    if (!process.env.ALLOWED_COMMANDS.includes(cmdBase))
        return res.status(400).json({ error: 'Command not allowed' });

    exec(command, (error, stdout, stderr) => {
        if (error) return res.status(500).json({ error: stderr });
        return res.json({ result: stdout });
    });
});

app.listen(3030, () => console.log('Env control API running on port 3030'));