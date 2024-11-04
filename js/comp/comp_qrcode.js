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

  <collapse-panel id="qrcode_scan_panel" title="QRコードスキャン(カメラ)" collapse="true">
      <span slot="content">
          <div class="card-body">
              <label class="title">scaned data</label>
              <div class="input-group">
                  <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(qrcode_scaned_data)"></button>
                  <input type="text" class="form-control" v-model="qrcode_scaned_data" readonly>
              </div><br>
              <button class="btn btn-primary" v-on:click="qrcode_scan">{{qrcode_btn}}</button><br>
              <div>
                  <img class="img-fluid" v-show="!qrcode_running && qrcode_scaned_data==''" id="qrcode_start" src="./img/qrcode_start.png">
                  <video class="img-fluid" v-show="qrcode_running" id="qrcode_camera" autoplay playsinline></video>
                  <canvas class="img-fluid" v-show="!qrcode_running && qrcode_scaned_data!=''" id="qrcode_canvas"></canvas>
              </div>
          </div>
          <div class="card-footer">
              <button class="btn btn-secondary" data-bs-toggle="collapse" href="#qrcode_scan_panel">閉じる</button>
          </div>
      </span>
  </collapse-panel>

    <collapse-panel id="qrcode_file_panel" title="QRコードスキャン(画像)" collapse="true">
      <span slot="content">
          <div class="card-body">
              <label class="title">scaned data2</label>
              <div class="input-group">
                  <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(qrcode_scaned_data2)"></button>
                  <input type="text" class="form-control" v-model="qrcode_scaned_data2" readonly>
              </div><br>
              <comp_file id="image_file" v-bind:callback="image_open_files" ref="image_file"></comp_file><br>
              <div class="row">
                <div class="col-4">
                  <textarea placeholder="ここに画像をペースト(Ctrl-V)してください。" class="form-control" style="text-align: center; resize: none;" rows="5" 
                    v-on:paste="do_paste" v-on:drop.prevent="do_file_paste" v-on:dragover.prevent readonly>
                  </textarea>
                  <br>
                </div>
                <div class="col-8">
                  <img class="img-fluid" v-show="qrcode_scaned_data2==''" id="qrcode_start2" src="./img/qrcode_start.png">
                  <canvas class="img-fluid" v-show="qrcode_scaned_data2!=''" id="qrcode_canvas2"></canvas>
                </div>
              </div>
          </div>
          <div class="card-footer">
              <button class="btn btn-secondary" data-bs-toggle="collapse" href="#qrcode_file_panel">閉じる</button>
          </div>
      </span>
  </collapse-panel>

</div>`,
  data: function () {
    return {
      qrcode_input: '',
      qrcode_btn: 'QRスキャン開始',
      qrcode_video: null,
      qrcode_context: null,
      qrcode_scaned_data: '',
      qrcode_scaned_data2: '',

      qrcode_running: false,
      qrcode_timer: null,
    }
  },
  methods: {
    /* QRコード */
    image_open_files: function (files) {
      if( files.length == 0 ){
        return;
      }
      var file = files[0];
      if (!file.type.startsWith('image/')) {
        alert('画像ファイルではありません。');
        return;
      }

      var reader = new FileReader();
      reader.onload = (e) => {
          var data_url = e.target.result;
          this.set_dataurl(data_url);
      };
      reader.readAsDataURL(file);
    },
    do_file_paste: function(e){
        console.log(e);
        if( e.dataTransfer.files.length == 0 )
            return;

        var file = e.dataTransfer.files[0];
        console.log(file.type);

        if(file.type.startsWith('image/')){
            var reader = new FileReader();
            reader.onload = (e) => {
                var data_url = e.target.result;
                this.set_dataurl(data_url);
            };
            reader.readAsDataURL(file);
        }else{
            alert('サポートしていません。');
        }
    },
    do_paste: async function(e){
        console.log(e);
        if (e.clipboardData.types.length == 0)
            return;

        for( let item of e.clipboardData.items){
          if( item.type.startsWith('image/')){
              var imageFile = item.getAsFile();
              var reader = new FileReader();
              reader.onload = (e) => {
                  var data_url = e.target.result;
                  this.set_dataurl(data_url);
              };
              reader.readAsDataURL(imageFile);
              return;
          }
        }
        alert('サポートしていません。');
    },
    set_dataurl: function(data_url){
      this.qrcode_scaned_data2 = "";
      var image = document.querySelector('#qrcode_start2');
      image.onload = () =>{
        var qrcode_canvas = document.querySelector('#qrcode_canvas2');
        qrcode_canvas.width = image.naturalWidth;
        qrcode_canvas.height = image.naturalHeight;
        var ctx = qrcode_canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, image.naturalWidth, image.naturalHeight);

        const code = jsQR(imageData.data, image.naturalWidth, image.naturalHeight);
        if (code && code.data != "") {
          this.qrcode_scaned_data2 = code.data;
          console.log(code);
  
          ctx.strokeStyle = "blue";
          ctx.lineWidth = 3;
  
          var pos = code.location;
          ctx.beginPath();
          ctx.moveTo(pos.topLeftCorner.x, pos.topLeftCorner.y);
          ctx.lineTo(pos.topRightCorner.x, pos.topRightCorner.y);
          ctx.lineTo(pos.bottomRightCorner.x, pos.bottomRightCorner.y);
          ctx.lineTo(pos.bottomLeftCorner.x, pos.bottomLeftCorner.y);
          ctx.lineTo(pos.topLeftCorner.x, pos.topLeftCorner.y);
          ctx.stroke();
        } else {
          this.toast_show("QRコードは見つけられませんでした。")
        }
      };
      image.onerror = (e) =>{
        console.error(e);
        alert(e);
      };
      image.src = data_url;
    },

    qrcode_create: function () {
      var element = document.querySelector('#qrcode_area');
      element.innerHTML = '';
      new QRCode(element, this.qrcode_input);
    },
    qrcode_scan: function () {
      this.qrcode_video = document.querySelector('#qrcode_camera');

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
        var qrcode_canvas = document.querySelector('#qrcode_canvas');
        qrcode_canvas.width = this.qrcode_video.videoWidth;
        qrcode_canvas.height = this.qrcode_video.videoHeight;
        this.qrcode_context = qrcode_canvas.getContext('2d');
      }
      this.qrcode_context.drawImage(this.qrcode_video, 0, 0, qrcode_canvas.width, qrcode_canvas.height);
      const imageData = this.qrcode_context.getImageData(0, 0, qrcode_canvas.width, qrcode_canvas.height);

      const code = jsQR(imageData.data, qrcode_canvas.width, qrcode_canvas.height);
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
  },
  mounted: function(){
  }
};
