const chat = require('../scripts/chat');

global.router.post('/chat/send_message', async (req, res) => {
    res.send(await chat.sendMessage(true));
});

module.exports = router;
