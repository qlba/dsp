const express = require('express');

express()
	.use(express.static('static'))
	.use(express.static('dist'))
	.listen(3000);
