const {app} = require('./src/router');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('server is listening', PORT));
