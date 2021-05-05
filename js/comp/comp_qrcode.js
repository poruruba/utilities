const QRCODE_CANCEL_TIMER = 20000;

export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">QRコード</h2>
  <collapse-panel id="qrcode_create_panel" title="QRコード生成">
      <span slot="content">
          <div class="card-body">
              <label class="title">入力</label>
              <input type="text" class="form-control" v-model="qrcode_input">
              <button class="btn btn-primary" v-on:click="qrcode_create()">生成</button><br>
              <br>
              <div id="qrcode_area"></div>
          </div>
          <div class="card-footer">
              <button class="btn btn-secondary" data-bs-toggle="collapse" href="#qrcode_create_panel">閉じる</button>
          </div>
      </span>
  </collapse-panel>

  <collapse-panel id="qrcode_scan_panel" title="QRコードスキャン" collapse="true">
      <span slot="content">
          <div class="card-body">
              <label class="title">scaned data</label>
              <div class="input-group">
                  <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(qrcode_scaned_data)"></button>
                  <input type="text" class="form-control" v-model="qrcode_scaned_data" readonly>
              </div><br>
              <button class="btn btn-primary" v-on:click="qrcode_scan()">{{qrcode_btn}}</button><br>
              <div>
                  <img class="img-fluid" v-show="!qrcode_running && qrcode_scaned_data==''" id="qrcode_start" src="./img/qrcode_start.png"><br>
                  <video class="img-fluid" v-show="qrcode_running" id="qrcode_camera" autoplay></video>
                  <canvas class="img-fluid" v-show="!qrcode_running && qrcode_scaned_data!=''" id="qrcode_canvas"></canvas>
              </div>
          </div>
          <div class="card-footer">
              <button class="btn btn-secondary" data-bs-toggle="collapse" href="#qrcode_scan_panel">閉じる</button>
          </div>
      </span>
  </collapse-panel>
</div>`,
  data: function () {
    return {
      qrcode_input: '',
      qrcode_btn: 'QRスキャン開始',
      qrcode_video: null,
      qrcode_canvas: null,
      qrcode_context: null,
      qrcode_scaned_data: '',
      qrcode_running: false,
      qrcode_timer: null,
    }
  },
  methods: {
    /* QRコード */
    qrcode_create: function () {
      var element = document.querySelector('#qrcode_area');
      element.innerHTML = '';
      new QRCode(element, this.qrcode_input);
    },
    qrcode_scan: function () {
      this.qrcode_video = document.querySelector('#qrcode_camera');
      this.qrcode_canvas = document.querySelector('#qrcode_canvas');

      if (this.qrcode_running) {
        this.qrcode_forcestop();
        return;
      }

      this.qrcode_running = true;
      this.qrcode_btn = 'QRスキャン停止';

      this.qrcode_timer = setTimeout(() => {
        this.qrcode_forcestop();
      }, QRCODE_CANCEL_TIMER);

      return navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
        .then(stream => {
          this.qrcode_scaned_data = "";
          this.qrcode_video.srcObject = stream;
          this.qrcode_draw();
        })
        .catch(error => {
          alert(error);
        });
    },
    qrcode_draw: function () {
      //            console.log(this.qrcode_video.videoWidth, this.qrcode_video.videoHeight);
      if (this.qrcode_context == null) {
        if (this.qrcode_video.videoWidth == 0 || this.qrcode_video.videoHeight == 0) {
          if (this.qrcode_running)
            requestAnimationFrame(this.qrcode_draw);
          return;
        }
        this.qrcode_canvas.width = this.qrcode_video.videoWidth;
        this.qrcode_canvas.height = this.qrcode_video.videoHeight;
        this.qrcode_context = this.qrcode_canvas.getContext('2d');
      }
      this.qrcode_context.drawImage(this.qrcode_video, 0, 0, this.qrcode_canvas.width, this.qrcode_canvas.height);
      const imageData = this.qrcode_context.getImageData(0, 0, this.qrcode_canvas.width, this.qrcode_canvas.height);

      const code = jsQR(imageData.data, this.qrcode_canvas.width, this.qrcode_canvas.height);
      if (code && code.data != "") {
        this.qrcode_scaned_data = code.data;
        console.log(code);

        this.qrcode_forcestop();

        this.qrcode_context.strokeStyle = "blue";
        this.qrcode_context.lineWidth = 3;

        var pos = code.location;
        this.qrcode_context.beginPath();
        this.qrcode_context.moveTo(pos.topLeftCorner.x, pos.topLeftCorner.y);
        this.qrcode_context.lineTo(pos.topRightCorner.x, pos.topRightCorner.y);
        this.qrcode_context.lineTo(pos.bottomRightCorner.x, pos.bottomRightCorner.y);
        this.qrcode_context.lineTo(pos.bottomLeftCorner.x, pos.bottomLeftCorner.y);
        this.qrcode_context.lineTo(pos.topLeftCorner.x, pos.topLeftCorner.y);
        this.qrcode_context.stroke();
      } else {
        if (this.qrcode_running)
          requestAnimationFrame(this.qrcode_draw);
      }
    },
    qrcode_forcestop: function () {
      if (!this.qrcode_running)
        return;

      this.qrcode_running = false;

      if (this.qrcode_timer != null) {
        clearTimeout(this.qrcode_timer);
        this.qrcode_timer = null;
      }

      this.qrcode_video.pause();
      this.qrcode_video.srcObject = null;
      this.qrcode_btn = 'QRスキャン開始';
    },
  }
};