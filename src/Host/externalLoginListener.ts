const { WebSocketServer } = require('ws');

let beganServer = false;

export const startExternalLoginServer = () => {

	if (beganServer) {
		return;
	}

	beganServer = true;
	
	console.log("Beginning websocket connection...");

	const wss = new WebSocketServer({ host: "127.0.0.1", port: 13325 });

	wss.on('connection', function connection(ws: any, req: any) {
		if (req.headers.origin !== "https://tweetdeck.twitter.com") {
			console.log("Connection from invalid origin");
			console.log(req);
			ws.close();
			return;
		}
		ws.on('message', function message(data: Buffer) {
			if (String(data) === "HELLO") {
				ws.send("READY");
			}
			console.log('received: %s', data);
		});
	});
}