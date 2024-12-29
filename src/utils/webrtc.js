import Peer from 'simple-peer';

// Create a Peer connection
export const createPeerConnection = (isInitiator, localStream, signalingChannel) => {
  const peer = new Peer({
    initiator: isInitiator,
    trickle: false,
    stream: localStream, // Local media stream (audio/microphone)
  });

  // Handle remote stream
  peer.on('stream', (stream) => {
    signalingChannel.emit('remoteStream', stream);
  });

  // Handle ICE candidates
  peer.on('signal', (data) => {
    signalingChannel.emit('signal', data);
  });

  return peer;
};
