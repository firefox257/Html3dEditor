var port = 8080;
var http = require('http');
var fs = require('fs');

var allowHead = {
	"Access-Control-Allow-Orgin": "*",
	"Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, PATCH, DELETE",
	"Access-Control-Max-Age": 2592000, //30 days
	"Access-Control-Allow-Headers":"Orgin, X-Requested-With, Content-Type, Accept, Athorization"
};

function ls(req, res, dir)
{
	//todo: get from html3dedit
	
	
}

function readfile(req, res, path)
{
	//checkout
	
}

var _mimetype = {
	".txt": "text/plain",
	".html": "text/html",
	".htm": "text/html",
	".js": "text/javascript",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".png": "image/png",
	".mp3": "audio/mpeg",
	".mp4": "video/mp4",
	".svg": "image/svg+xml",
	".gltf": "model/gltf+json",
	".bin": "application/octet-stream",
	".css": "text/css",
	".hdr": "application/octet-stream"
	
};

function mimetype(url)
{
	var i = url.lastIndexOf(".");
	var tag = url.substring(i, url.length);
	//console.log("tag: " + tag);
	return _mimetype[tag];
}

function writeError(req, res, code, msg)
{
	var head = {
		"Content-Type": mimetype(".txt")
	};
	res.writeHead(code, head);
	res.write(msg);
	res.end();
}
http.createServer(function(req, res)
{
	
	
	
	if(req.method === "OPTIONS")
	{
		res.writeHead(204, allowHead);
		res.end();
		return;
	}
	
	var url = decodeURI(req.url.toString());
	//console.log(url);
	
	
	if(url.startsWith("/@sys"))
	{
		//todo get from file html3deditor
	}
	
	
	if(url.endsWith("/"))url+="index.html";
	url=url.substring(1, url.length);
	
	fs.stat(url, function(err, stat)
	{
		if(err)
		{
			writeError(req, res, 404, "Not Found!");
		}
		else
		{
			var range = req.headers.range;
			var fileSize = stat.size;
			var mtype = mimetype(url);
			//console.log(url);
			//console.log(`mime type: ${mtype}`);
			
			if(range)
			{
				var parts = range.replace(/bytes=/, "").split("-");
				var start = parseInt(parts[0], 10);
				var end = parts[1] ? parseInt(parts[1], 10): fileSize -1;
				var chunksize = (end-start) + 1;
				var file = fs.createReadStream(url, {start, end});
				var head = {
					"Content-Range": `bytes ${start}-${end}/${fileSize}`,
					"Accept-Ranges": "bytes",
					"Content-Length": chunksize,
					"Content-Type": mtype
				};
				res.writeHead(206, head);
				file.pipe(res);
			}
			else
			{
				var head = {
					"Content-Length": fileSize,
					"Content-Type": mtype
				};
				res.writeHead(200, head);
				fs.createReadStream(url).pipe(res);
			}
		}
		
		
	});
	
	
}).listen(port);
