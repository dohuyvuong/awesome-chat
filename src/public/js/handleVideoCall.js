function handleVideoCall(conversationId) {
  $(`#video-chat-${conversationId}`).off("click").on("click", function () {
    // Step 1: Check user online
    socket.emit("video-call-check-online", {
      conversationId,
    });
  });

  $(".video-chat-group").off("click").on("click", function () {
    alertify.notify("Chưa hỗ trợ gọi nhóm!", "error", 5);
  });
}

function startStreaming(targetIdSelector, stream) {
  let videoElement = document.getElementById(targetIdSelector);
  videoElement.srcObject = stream;
  videoElement.onloadeddata = function () {
    videoElement.play();
  };
}

function showAndHandleCloseStreamModal(call, stream) {
  $("#streamModal").modal({backdrop: "static", keyboard: false});
  $("#streamModal").on("hidden.bs.modal", function () {
    soundManager.playDisconnectedSound();

    call.close();
    stream.getTracks().forEach(track => track.stop());
  });
}

$(document).ready(function () {
  // Step 2: Notify offline
  socket.on("response-video-call-offline", function () {
    alertify.notify("Người dùng không trực tuyến!", "error", 5);
  });

  let myPeerId = "";
  const peer = new Peer({
    config: {
      "iceServers": [
        { "url": "stun:stun.l.google.com:19302" },
        { "url": "stun:stun1.l.google.com:19302" },
        { "url": "stun:stun2.l.google.com:19302" },
        { "url": "stun:stun3.l.google.com:19302" },
        { "url": "stun:stun4.l.google.com:19302" },
      ],
    },
  });

  peer.on("open", function (peerId) {
    myPeerId = peerId;
  });

  peer.on("call", function(call) {
    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);

    getUserMedia({video: true, audio: true}, function(stream) {
      call.answer(stream); // Answer the call with an A/V stream.

      //Show and handle close stream modal
      showAndHandleCloseStreamModal(call, stream);

      // Show local stream
      startStreaming("local-stream", stream);

      call.on("stream", function(remoteStream) {
        // Show remote stream
        startStreaming("remote-stream", remoteStream);
      });
    }, function(err) {
      if (err.toString() === "NotFoundError: Requested device not found") {
        Swal.fire({
          type: "error",
          title: "Thiết bị của bạn không hỗ trợ cuộc gọi video!",
          backdrop: "rgba(85, 85, 85, 0.5)",
          width: "52rem",
          allowOutsideClick: false,
          confirmButtonColor: "#2ECC71",
          confirmButtonText: "Xác nhận",
        });
      } else if (err.toString() === "NotAllowedError: Permission denied") {
        Swal.fire({
          type: "error",
          title: "Bạn đang tắt quyền sử dụng thiết bị nghe gọi!",
          backdrop: "rgba(85, 85, 85, 0.5)",
          width: "52rem",
          allowOutsideClick: false,
          confirmButtonColor: "#2ECC71",
          confirmButtonText: "Xác nhận",
        });
      } else {
        Swal.fire({
          type: "error",
          title: "Có lỗi xảy ra, xin vui lòng thử lại!",
          backdrop: "rgba(85, 85, 85, 0.5)",
          width: "52rem",
          allowOutsideClick: false,
          confirmButtonColor: "#2ECC71",
          confirmButtonText: "Đồng ý",
        });
      }
    });
  });

  let timerInterval;

  // Step 3: Server response request call to caller
  socket.on("video-call-server-response-request-call-to-caller", function ({ conversation, caller, receiver }) {
    soundManager.playDailingSound();

    Swal.fire({
      title: `Đang gọi cho <span style="color: #2ECC71; margin: 0px 5px;">${receiver.username}</span> <i class="fa fa-volume-control-phone calling"></i>`,
      html: `
        Thời gian: <strong style="color: #D43F3A; margin: 0px 3px;">30</strong> giây.<br/><br/>
        <button id="btn-cancel-call" class="btn btn-danger">Huỷ cuộc gọi</button>
      `,
      backdrop: "rgba(85, 85, 85, 0.5)",
      width: "52rem",
      allowOutsideClick: false,
      timer: 30000,
      onBeforeOpen: () => {
        $("#btn-cancel-call").off("click").on("click", function () {
          Swal.close();
          clearInterval(timerInterval);
          soundManager.playDisconnectedSound();

          // Step 4: Caller cancel video call
          socket.emit("video-call-caller-cancel-request-call-to-server", {
            conversation,
            caller,
            receiver,
          });
        });

        Swal.showLoading();
        timerInterval = setInterval(() => {
          if (Swal.getContent() && Swal.getContent().querySelector("strong")) {
            Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
          }
        }, 1000);
      },
      onOpen: () => {
        // Step 8: Server reject call to caller
        socket.on("video-call-server-reject-call-to-caller", function ({ conversation, caller, receiver }) {
          Swal.close();
          clearInterval(timerInterval);
          soundManager.playDisconnectedSound();

          Swal.fire({
            type: "info",
            title: `<span style="color: #2ECC71; margin: 0px 5px;">${receiver.username}</span> đã từ chối cuộc gọi.`,
            backdrop: "rgba(85, 85, 85, 0.5)",
            width: "52rem",
            allowOutsideClick: false,
            confirmButtonColor: "#2ECC71",
            confirmButtonText: "Xác nhận",
          });
        });
      },
      onClose: () => {
        clearInterval(timerInterval);
        soundManager.playDisconnectedSound();
      }
    }).then((result) => {
      return false;
    });
  });

  // Step 6: Server request call to receiver
  socket.on("video-call-server-request-call-to-receiver", function ({ callerSocketId, conversation, caller, receiver }) {
    soundManager.playDailingSound();

    Swal.fire({
      title: `<i class="fa fa-volume-control-phone calling"></i> <span style="color: #2ECC71; margin: 0px 5px;">${caller.username}</span> đang gọi cho bạn.`,
      html: `
        Thời gian: <strong style="color: #D43F3A; margin: 0px 3px;">30</strong> giây.<br/><br/>
        <button id="btn-reject-call" class="btn btn-danger">Từ chối</button>
        <button id="btn-accept-call" class="btn btn-success">Đồng ý</button>
      `,
      backdrop: "rgba(85, 85, 85, 0.5)",
      width: "52rem",
      allowOutsideClick: false,
      timer: 30000,
      onBeforeOpen: () => {
        $("#btn-reject-call").off("click").on("click", function () {
          Swal.close();
          clearInterval(timerInterval);
          soundManager.playDisconnectedSound();

          // Step 7
          socket.emit("video-call-receiver-reject-request-call-to-server", {
            callerSocketId,
            conversation,
            caller,
            receiver,
          });
        });

        $("#btn-accept-call").off("click").on("click", function () {
          Swal.close();
          clearInterval(timerInterval);
          soundManager.playConnectedSound();

          // Step 10
          socket.emit("video-call-receiver-accept-request-call-to-server", {
            callerSocketId,
            conversation,
            caller,
            receiver,
            receiverPeerId: myPeerId,
          });
        });

        Swal.showLoading();
        timerInterval = setInterval(() => {
          if (Swal.getContent() && Swal.getContent().querySelector("strong")) {
            Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
          }
        }, 1000);
      },
      onOpen: () => {
        // Step 5: Server cancel request call to receiver
        socket.on("video-call-server-cancel-request-call-to-receiver", function () {
          Swal.close();
          clearInterval(timerInterval);
          soundManager.playDisconnectedSound();
        });

        // Step 9: Server reject call to receiver
        socket.on("video-call-server-reject-call-to-receiver", function () {
          Swal.close();
          clearInterval(timerInterval);
          soundManager.playDisconnectedSound();
        });
      },
      onClose: () => {
        clearInterval(timerInterval);
        soundManager.playDisconnectedSound();
      }
    }).then((result) => {
      return false;
    });
  });

  // Step 11: Server accept call to caller
  socket.on("video-call-server-accept-call-to-caller", function ({ conversation, caller, receiver, receiverPeerId }) {
    Swal.close();
    clearInterval(timerInterval);
    soundManager.playConnectedSound();

    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
    getUserMedia({video: true, audio: true}, function(stream) {
      let call = peer.call(receiverPeerId, stream);

      //Show and handle close stream modal
      showAndHandleCloseStreamModal(call, stream);

      // Show local stream
      startStreaming("local-stream", stream);

      call.on("stream", function(remoteStream) {
        // Show remote stream
        startStreaming("remote-stream", remoteStream);
      });
    }, function(err) {
      if (err.toString() === "NotFoundError: Requested device not found") {
        Swal.fire({
          type: "error",
          title: "Thiết bị của bạn không hỗ trợ cuộc gọi video!",
          backdrop: "rgba(85, 85, 85, 0.5)",
          width: "52rem",
          allowOutsideClick: false,
          confirmButtonColor: "#2ECC71",
          confirmButtonText: "Xác nhận",
        });
      } else if (err.toString() === "NotAllowedError: Permission denied") {
        Swal.fire({
          type: "error",
          title: "Bạn đang tắt quyền sử dụng thiết bị nghe gọi!",
          backdrop: "rgba(85, 85, 85, 0.5)",
          width: "52rem",
          allowOutsideClick: false,
          confirmButtonColor: "#2ECC71",
          confirmButtonText: "Xác nhận",
        });
      } else {
        Swal.fire({
          type: "error",
          title: "Có lỗi xảy ra, xin vui lòng thử lại!",
          backdrop: "rgba(85, 85, 85, 0.5)",
          width: "52rem",
          allowOutsideClick: false,
          confirmButtonColor: "#2ECC71",
          confirmButtonText: "Đồng ý",
        });
      }
    });
  });

  // Step 12: Server accept call to receiver
  socket.on("video-call-server-accept-call-to-receiver", function () {
    Swal.close();
    clearInterval(timerInterval);
    soundManager.playConnectedSound();
  });
});
