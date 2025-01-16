const socket = io('/')
const videoGrid = document.getElementById("video-grid")
const db = {}

socket.on('user-disconnected', (userId) => {
    if (db[userId]){
        db[userId].close();
    }
})

const peer = new Peer(undefined, {
    host: '/',
    port: '3001'
})

peer.on('open', id => {
    const hostVideo = document.createElement('video');
    hostVideo.muted = true;
    navigator.mediaDevices.getUserMedia({
     video: true,
        audio: true
    }).then(stream => {
        addVideoStream(hostVideo, stream);
        socket.emit('join-room', ROOM_ID, id)
        peer.on('call', call => {
            call.answer(stream)
            const userVideo = document.createElement('video');
            call.on('stream', userStream => {
                addVideoStream(userVideo, userStream)
            })
        })
        socket.on('user-connected', userId => {
            connectToNewUser(userId, stream)
        })
    })
})



const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const userVideo = document.createElement('video');
    call.on('stream', userStream => {
        addVideoStream(userVideo, userStream)
    })
    call.on('close', () => {
        // console.log(userId, "---")
        userVideo.remove()
    })
    db[userId] = call;
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}
