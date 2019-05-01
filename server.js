const express = require('express')
const app = express()
const options = {
	etag: false,
	lastModified: true,
}

var port = process.env.PORT || 3000
app.use(express.static('./docs', options)) //Configure references to .css and .js files

// Send the homepage when the root is requested
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/docs/view.html');
});

app.listen(port, () => console.log("lifted app; listening on port " + port));