let socket = io();

let localVideo = document.getElementById("localVideo");
let remoteVideo = document.getElementById("remoteVideo");

let localStream;
let remoteStream;
let rtcPeerConnection;

const iceServers = {
  iceServers: [
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

const streamConstraints = {
  video: {
    width: { min: 640, max: 640 },
    height: { min: 480, max: 480 },
  },
  audio: true,
};

let isCaller = false;
let caller = null;
let receiver = null;

// UI Transitions
function showSection(sectionId) {
  const sections = ["home", "create", "join", "call"];
  sections.forEach((id) => {
    const section = document.getElementById(id);
    section.style.display = id === sectionId ? "block" : "none";
  });
}

// Initialize on document ready
$(document).ready(() => {
  showSection("home");

  $("#startBtn").click(() => {
    socket.emit("create", (res) => {
      console.log("Call created by", res);
      $("#caller_code").val(res);
      caller = res;
      showSection("create");
      UIkit.tooltip("#caller_code").show();

      navigator.mediaDevices
        .getUserMedia(streamConstraints)
        .then((stream) => {
          addLocalStream(stream);
          isCaller = true;
        })
        .catch(handleMediaError);
    });
  });

  $("#joinBtn").click(() => {
    showSection("join");
  });

  $("#startCallBtn").click(() => {
    showSection("call");
  });

  $("#joinCallBtn").click(() => {
    const code = $("#join_code").val();
    if (!code) {
      alert("Please enter a valid code.");
      return;
    }
    showSection("call");

    navigator.mediaDevices
      .getUserMedia(streamConstraints)
      .then((stream) => {
        addLocalStream(stream);
        socket.emit("join", code);
      })
      .catch(handleMediaError);
  });
});

// Socket Events
socket.on("ready", (code) => {
  console.log("Receiver ready at", code);
  receiver = code;

  createPeerConnection();
  rtcPeerConnection
    .createOffer({ offerToReceiveAudio: 1, offerToReceiveVideo: 1 })
    .then((desc) => setLocalAndOffer(desc))
    .catch(console.error);
});

socket.on("candidate", (event) => {
  const candidate = new RTCIceCandidate({
    sdpMLineIndex: event.label,
    candidate: event.candidate,
  });
  rtcPeerConnection.addIceCandidate(candidate);
});

socket.on("offer", (param) => {
  caller = param.caller;
  createPeerConnection();
  rtcPeerConnection.setRemoteDescription(
    new RTCSessionDescription(param.event)
  );
  rtcPeerConnection
    .createAnswer()
    .then((desc) => setLocalAndAnswer(desc))
    .catch(console.error);
});

socket.on("answer", (event) => {
  rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
  console.log("Answer received");
});

// Helper Functions
function handleMediaError(err) {
  console.error("Media error:", err);
  alert(
    "Could not access your camera or microphone. Please check your permissions and try again."
  );
}

function addLocalStream(stream) {
  localStream = stream;
  localVideo.srcObject = stream;
}

function createPeerConnection() {
  rtcPeerConnection = new RTCPeerConnection(iceServers);
  rtcPeerConnection.onicecandidate = onIceCandidate;
  rtcPeerConnection.ontrack = onAddStream;
  localStream
    .getTracks()
    .forEach((track) => rtcPeerConnection.addTrack(track, localStream));
}

function onIceCandidate(event) {
  if (event.candidate) {
    const id = isCaller ? receiver : caller;
    socket.emit("candidate", {
      type: "candidate",
      label: event.candidate.sdpMLineIndex,
      id: event.candidate.sdpMid,
      candidate: event.candidate.candidate,
      sendTo: id,
    });
  }
}

function onAddStream(event) {
  remoteStream = event.streams[0];
  remoteVideo.srcObject = remoteStream;
}

function setLocalAndOffer(sessionDescription) {
  rtcPeerConnection.setLocalDescription(sessionDescription);
  socket.emit("offer", {
    type: "offer",
    sdp: sessionDescription,
    receiver: receiver,
  });
}

function setLocalAndAnswer(sessionDescription) {
  rtcPeerConnection.setLocalDescription(sessionDescription);
  socket.emit("answer", {
    type: "answer",
    sdp: sessionDescription,
    caller: caller,
  });
}
