
/*==========  SOUND MANAGER  ==========*/
let SoundManager = function () {

	let SOUND_DAILING 	= "../sounds/dialing.mp3";
	let SOUND_CONNECTED = "../sounds/connected.wav";
	let SOUND_DISCONNECT= "../sounds/disconnected.wav";
	let SOUND_NEWMESSAGE= "../sounds/new_message.wav";

	let callingSound	= new Audio(SOUND_DAILING);
	let connectedSound	= new Audio(SOUND_CONNECTED);
	let disconnectedS	= new Audio(SOUND_DISCONNECT);
	let newMsgSound 	= new Audio(SOUND_NEWMESSAGE);

	callingSound.loop 	= true;
	connectedSound.loop = false;
	disconnectedS.loop	= false;
	newMsgSound.loop	= false;

	return {
		playDailingSound: function () {
			callingSound.play();
		},

		playConnectedSound: function () {
      callingSound.pause();
      callingSound.currentTime = 0;
			connectedSound.play();
		},

		playDisconnectedSound: function () {
			callingSound.pause();
      callingSound.currentTime = 0;
			disconnectedS.play();
		},

		playNewMessageSound: function () {
			newMsgSound.play();
		}
	};

};

let soundManager 	= new SoundManager();
