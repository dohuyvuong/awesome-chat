function handleVideoCall(conversationId) {
  $(`#video-chat-${conversationId}`).off("click").on("click", function () {
    // Step 1: Check user online
    socket.emit("video-call-check-online", {
      conversationId,
    });
  });
}

$(document).ready(function () {
  // Step 2: Notify offline
  socket.on("response-video-call-offline", function () {
    alertify.notify("Người dùng không trực tuyến!", "error", 5);
  });

  let myPeerId = "";
  const peer = new Peer();
  peer.on("open", function (peerId) {
    myPeerId = peerId;
  });

  // Step 3: Server request receiver peer id
  socket.on("video-call-server-request-receiver-peer-id", function ({ conversation, caller, receiver }) {
    // Step 4: Receiver provide receiver peer id to server
    socket.emit("video-call-receiver-provide-receiver-peer-id-to-server", {
      conversation,
      caller,
      receiver,
      receiverPeerId: myPeerId,
    });
  });

  // Step 5: Server provide receiver peer id to caller
  socket.on("video-call-server-provide-receiver-peer-id-to-caller", function ({ conversation, caller, receiver, receiverPeerId }) {
    // Step 6: Caller request call to server
    socket.emit("video-call-caller-request-call-to-server", {
      conversation,
      caller,
      receiver,
      receiverPeerId,
    });

    let timerInterval;

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

          // Step 7: Caller cancel video call
          socket.emit("video-call-caller-cancel-request-call-to-server", {
            conversation,
            caller,
            receiver,
            receiverPeerId,
          });
        });

        Swal.showLoading();
        timerInterval = setInterval(() => {
          Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
        }, 1000);
      },
      onOpen: () => {
        // Step 12: Server reject call to caller
        socket.on("video-call-server-reject-call-to-caller", function ({ conversation, caller, receiver, receiverPeerId }) {
          Swal.close();
          clearInterval(timerInterval);

          Swal.fire({
            type: "info",
            title: `<span style="color: #2ECC71; margin: 0px 5px;">${receiver.username} đã từ chối cuộc gọi.</span>`,
            backdrop: "rgba(85, 85, 85, 0.5)",
            width: "52rem",
            allowOutsideClick: false,
            confirmButtonColor: "#2ECC71",
            confirmButtonText: "Xác nhận",
          });
        });

        // Step 13: Server accept call to caller
        socket.on("video-call-server-accept-call-to-caller", function ({ conversation, caller, receiver, receiverPeerId }) {
          Swal.close();
          clearInterval(timerInterval);

          console.log("call success....");
        });
      },
      onClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      return false;
    });
  });

  // Step 8: Server request call to receiver
  socket.on("video-call-server-request-call-to-receiver", function ({ conversation, caller, receiver, receiverPeerId }) {
    let timerInterval;

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

          // Step 10
          socket.emit("video-call-receiver-reject-request-call-to-server", {
            conversation,
            caller,
            receiver,
            receiverPeerId,
          });
        });

        $("#btn-accept-call").off("click").on("click", function () {
          Swal.close();
          clearInterval(timerInterval);

          // Step 11
          socket.emit("video-call-receiver-accept-request-call-to-server", {
            conversation,
            caller,
            receiver,
            receiverPeerId,
          });
        });

        Swal.showLoading();
        timerInterval = setInterval(() => {
          Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
        }, 1000);
      },
      onOpen: () => {
        // Step 9: Server cancel request call to receiver
        socket.on("video-call-server-cancel-request-call-to-receiver", function ({ conversation, caller, receiver, receiverPeerId }) {
          Swal.close();
          clearInterval(timerInterval);
        });

        // Step 14: Server accept call to receiver
        socket.on("video-call-server-accept-call-to-receiver", function ({ conversation, caller, receiver, receiverPeerId }) {
          Swal.close();
          clearInterval(timerInterval);

          console.log("receive success");
        });
      },
      onClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      return false;
    });
  });
});
