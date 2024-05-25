var g_recorder = null;
var g_stream = null;

export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">HTML5</h2>
  <collapse-panel id="html5_audio" title="Audio" collapse="true">
    <span slot="content">
      <div class="card-body">
        <comp_file id="html5_audio_file" accept="audio/*" v-bind:callback="audio_read"></comp_file>
        <label class="title">type</label> {{audio_type}}<br>
        <audio id="html5_audio_player" controls></audio>
      </div>
    </span>
  </collapse-panel>

  <collapse-panel id="html5_video" title="Video" collapse="true">
    <span slot="content">
      <div class="card-body">
        <comp_file id="html5_video_file" accept="video/*" v-bind:callback="video_read"></comp_file>
        <label class="title">type</label> {{video_type}}<br>
        <video id="html5_video_player" class="img-fluid" controls></video>
      </div>
    </span>
  </collapse-panel>

  <collapse-panel id="html5_image" title="Image" collapse="true">
    <span slot="content">
      <div class="card-body">
        <comp_file id="html5_image_file" accept="image/*" v-bind:callback="image_read"></comp_file>
        <label class="title">type</label> {{image_type}}<br>
        <img id="html5_image" class="img-thumbnail" v-bind:src="image_src">
      </div>
    </span>
  </collapse-panel>

  <collapse-panel id="html5_geolocation" title="GeoLocation" collapse="true">
    <span slot="content">
      <div class="card-body">
        <button class="btn btn-secondary" v-on:click="location_get">取得</button><br>
        <label class="title">latitude</label> {{location.latitude}}<br>
        <label class="title">longitude</label> {{location.longitude}}<br>
        <label class="title">accuracy</label> {{location.accuracy}}<br>
        <label class="title">altitude</label> {{location.altitude}}<br>
        <label class="title">altitudeAccuracy</label> {{location.altitudeAccuracy}}<br>
        <label class="title">heading</label> {{location.heading}}<br>
        <label class="title">speed</label> {{location.speed}}<br>
      </div>
    </span>
  </collapse-panel>

  <collapse-panel id="html5_motion" title="Motion" collapse="true">
    <span slot="content">
      <div class="card-body">
        <div v-if="motion_supported">
          <button type="button" class="btn btn-secondary" v-on:click="motion_start"><span v-if="!motion_running">開始</span><span v-else>停止</span></button><br>
          <label class="title">x</label> {{tofixed(accelerationIncludingGravity.x)}} (m/s^2)<br>
          <label class="title">y</label> {{tofixed(accelerationIncludingGravity.y)}} (m/s^2)<br>
          <label class="title">z</label> {{tofixed(accelerationIncludingGravity.z)}} (m/s^2)<br>
        </div>
        <div v-else>
          not supported
        </div>
      </div>
    </span>
  </collapse-panel>

  <collapse-panel id="html5_orientation" title="Orientation" collapse="true">
    <span slot="content">
      <div class="card-body">
        <div v-if="orientation_supported">
          <button type="button" class="btn btn-secondary" v-on:click="orientation_start"><span v-if="!orientation_running">開始</span><span v-else>停止</span></button><br>
          <label class="title">alpha</label> {{tofixed(orientation.alpha)}} °<br>
          <label class="title">beta</label> {{tofixed(orientation.beta)}} °<br>
          <label class="title">gamma</label> {{tofixed(orientation.gamma)}} °<br>
        </div>
        <div v-else>
          not supported
        </div>
      </div>
    </span>
  </collapse-panel>

  <collapse-panel id="html5_battery" title="Battery" collapse="true">
    <span slot="content">
      <div class="card-body">
        <button class="btn btn-secondary" v-on:click="battery_refresh">更新</button><br>
        <label class="title">level</label> {{battery.level * 100}} %<br>
        <label class="title">charging</label> {{battery.charging}}<br>
        <label class="title">chargingTime</label> {{battery.chargingTime}} 秒<br>
        <label class="title">dischargingTime</label> {{battery.dischargingTime}} 秒<br>
      </div>
    </span>
  </collapse-panel>

  <collapse-panel id="html5_webusb" title="WebUSB" collapse="true">
    <span slot="content">
      <div class="card-body">
        <button class="btn btn-secondary" v-on:click="usb_request">WebUSB</button><br>
        <label class="title">manufacturerName</label> {{usbdevice.manufacturerName}}<br>
        <label class="title">productName</label> {{usbdevice.productName}}<br>
        <label class="title">productId</label> {{usbdevice.productId}}<br>
        <label class="title">vendorId</label> {{usbdevice.vendorId}}<br>
      </div>
    </span>
  </collapse-panel>

  <collapse-panel id="html5_webbluetooth" title="WebBluetooth" collapse="true">
    <span slot="content">
      <div class="card-body">
        <button class="btn btn-secondary" v-on:click="ble_request">WebBluetooth</button><br>
        <label class="title">id</label> {{bledevice.id}}<br>
        <label class="title">name</label> {{bledevice.name}}<br>
      </div>
    </span>
  </collapse-panel>

  <collapse-panel id="html5_vibration" title="Vibration" collapse="true">
    <span slot="content">
      <div class="card-body">
        <div class="row">
          <span class="col-auto">
            <button class="btn btn-secondary" v-on:click="vibration_start">バイブレーション</button>
          </span>
          <span class="col-auto">
            <input type="number" class="form-control" v-model="vibration_duration">
          </span>
          msec
        </div>
      </div>
    </span>
  </collapse-panel>

  <collapse-panel id="html5_screenlock" title="Screen Lock" collapse="true">
    <span slot="content">
      <div class="card-body">
        <div class="row">
          <span class="col-auto">
            <button v-if="!is_screen_locked" class="btn btn-secondary" v-on:click="screen_lock(true)">ロック</button>
            <button v-else class="btn btn-secondary" v-on:click="screen_lock(false)">アンロック</button>
            <label class="title">lock status</label> {{is_screen_locked}}
          </span>
        </div>
      </div>
    </span>
  </collapse-panel>

  <collapse-panel id="html5_synthesis" title="SpeechSynthesis" collapse="true">
    <span slot="content">
      <div class="card-body">
        <button class="btn btn-secondary" v-on:click="speech_start">音声発話</button><br><br>
        <input type="text" class="form-control" v-model="speech_text"><br>
        <label class="title">volume</label> {{speech_volume}} <input type="range" class="form-range" v-model="speech_volume" min="0" max="100">
        <label class="title">pitch</label> {{(speech_pitch / 100).toFixed(2)}} <input type="range" class="form-range" v-model="speech_pitch" min="0" max="200">
        <label class="title">rate</label> {{(speech_rate / 100).toFixed(2)}} <input type="range" class="form-range" v-model="speech_rate" min="1" max="1000">
        <button class="btn btn-secondary btn-sm" v-on:click="speech_reset">リセット</button>
      </div>
    </span>
  </collapse-panel>

  <collapse-panel id="html5_recognition" title="SpeechRecognition" collapse="true">
    <span slot="content">
      <div class="card-body">
        <button class="btn btn-secondary" v-on:click="speech_recognition">音声認識</button> {{speech_status}}<br><br>
        <input type="text" class="form-control" v-model="speech_recognized" readonly>
      </div>
    </span>
  </collapse-panel>

  <collapse-panel id="html5_usermedia" title="UserMedia" collapse="true">
    <span slot="content">
      <div class="card-body">
        <button class="btn btn-secondary" v-on:click="do_usermedia_list">リスト取得</button><br>
        <table class="table table-striped">
          <thead>
            <tr><th>#</th><th>kind</th><th>label</th></tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in usermedia_list">
              <td>{{(index + 1)}}</td><td>{{item.kind}}</td><td>{{item.label}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </span>
  </collapse-panel>

  <collapse-panel id="html5_record" title="VideoRecord" collapse="true">
    <span slot="content">
      <div class="card-body">
        <button class="btn btn-secondary btn-sm" v-on:click="record_prepare" v-if="!record_previewing">準備</button>
        <button class="btn btn-secondary" v-on:click="record_start" v-if="record_previewing && !record_recording">録画開始</button>
        <button class="btn btn-secondary" v-on:click="record_stop" v-if="record_previewing && record_recording">録画停止</button>
        <button class="btn btn-secondary btn-sm" v-on:click="record_dispose" v-if="record_previewing">終了</button>
        {{record_status}}
        <br><br>
        <div class="row">
          <span class="col-auto" v-if="!record_previewing">
            <label class="title">解像度</label>
            <select class="form-select" v-model.number="record_resolution">
              <option value="0">default</option>
              <option v-for="(item, index) in record_resolution_list" v-bind:value="item">{{item}}</option>
            </select>
          </span>
          <span class="col-auto" v-if="!record_previewing">
            <label class="title">カメラ/画面</label>
            <select class="form-select" v-model="record_facing">
              <option value="display">display</option>
              <option value="user">user</option>
              <option value="environment">environment</option>
            </select>
          </span>
          <label for="record_audio_checkbox" class="col-auto" v-if="!record_previewing">
            <input type="checkbox" class="form-check-input" v-model="record_audio" id="record_audio_checkbox" />Audio
          </label>
        </div>
        <br>
        <video class="img-fluid" id="record_preview" v-show="record_previewing" autoplay playsinline></video>
      </div>
    </span>
  </collapse-panel>

</div>`,
  data: function () {
    return {
      audio_type: "",
      video_type: "",
      image_type: "",
      image_src: null,
      location: {},
      battery: {},
      motion_supported: true,
      orientation_supported: true,
      motion_running: false,
      accelerationIncludingGravity: {},
      orientation_running: false,
      orientation: {},
      usbdevice: {},
      bledevice: {},
      vibration_duration: 1000,
      speech_pitch: 100,
      speech_volume: 100,
      speech_rate: 100,
      speech_text: "こんにちは",
      speech_recognized: '',
      speech_status: '',
      record_preview: null,
      record_chunks: [],
      record_resolution_list: [ 240, 480, 960, 1920 ],
      record_resolution: 0,
      record_stream: null,
      record_recording: false,
      record_previewing: false,
      record_facing: "environment",
      record_audio: true,
      usermedia_list: [],
      screen_wl: null,
      is_screen_locked: false,
    }
  },
  computed: {
    record_status: function(){
      if (this.record_recording && this.record_previewing )
        return "録画中";
      else
        return "";
    }
  },
  methods: {
    tofixed: function (f, digits = 2) {
      if (f === undefined || f == null)
        return "";
      else
        return f.toFixed(digits);
    },
    issuppoted: function(f) {
      if( f === undefined || f == null )
        return false;
      else
        return true;
    },

    /* HTML5 */
    screen_lock: async function(enable){
      if ( !('wakeLock' in navigator) ){
        alert('サポートしていません');
        return;
      }
      if( enable ){
        this.screen_wl = await navigator.wakeLock.request('screen');
        this.is_screen_locked = true;
      }else{
        if( this.screen_wl ){
          this.screen_wl.release();
          this.screen_wl = null;
        }
        this.is_screen_locked = false;
      }
    },
    audio_read: function (files) {
      if (files.length <= 0){
        this.audio_type = "";
        return;
      }
      var file = files[0];
      this.audio_type = file.type;
      var reader = new FileReader();
      reader.onload = () => {
        var audio = document.querySelector("#html5_audio_player");
        audio.src = reader.result;
        audio.play();
      };
      reader.readAsDataURL(file);
    },
    video_read: function (files) {
      if (files.length <= 0){
        this.video_type = "";
        return;
      }
      var file = files[0];
      this.video_type = file.type;
      var reader = new FileReader();
      reader.onload = () => {
        var video = document.querySelector("#html5_video_player");
        video.src = reader.result;
        video.play();
      };
      reader.readAsDataURL(file);
    },
    image_read: function (files) {
      if (files.length <= 0) {
        this.image_type = "";
        this.image_src = null;
        return;
      }
      var file = files[0];
      this.image_type = file.type;
      var reader = new FileReader();
      reader.onload = () => {
        this.image_src = reader.result;
      };
      reader.readAsDataURL(file);
    },
    location_get: function(){
      navigator.geolocation.getCurrentPosition((position) =>{
        this.location = position.coords;
      }, (error) =>{
        console.error(error);
        alert(error);
      });
    },
    motion_start: function () {
      if (!this.motion_running) {
        this.motion_running = true;
        window.addEventListener("devicemotion", this.motion_handler);
      } else {
        window.removeEventListener("devicemotion", this.motion_handler);
        this.motion_running = false;
      }
    },
    motion_handler: function(event){
      if (event.accelerationIncludingGravity.x === null ){
        window.removeEventListener("devicemotion", this.motion_handler);
        this.motion_running = false;
        this.motion_supported = false;
        return;
      }
      this.accelerationIncludingGravity = event.accelerationIncludingGravity;
      this.motion_supported = true;
      console.log(event.accelerationIncludingGravity);
    },
    orientation_start: function () {
      if (!this.orientation_running) {
        this.orientation_running = true;
        window.addEventListener("deviceorientation", this.orientation_handler);
      } else {
        window.removeEventListener("deviceorientation", this.orientation_handler);
        this.orientation_running = false;
      }
    },
    orientation_handler: function (event) {
      if (event.alpha === null) {
        window.removeEventListener("deviceorientation", this.orientation_handler);
        this.orientation_running = false;
        this.orientation_supported = false;
        return;
      }
      this.orientation = event;
      this.orientation_supported = true;
      console.log(event);
    },
    usb_request: async function () {
      try{
        var device = await navigator.usb.requestDevice({ filters: [] });
        this.usbdevice = device;
      }catch(error){
        alert(error);
      }
    },
    ble_request: async function () {
      try{
        var device = await navigator.bluetooth.requestDevice({ acceptAllDevices: [] });
        this.bledevice = device;
      } catch (error) {
        alert(error);
      }
    },
    vibration_start: function(){
      if(!('vibrate' in navigator) ){
        alert('サポートしていません。');
        return;
      }
      navigator.vibrate(this.vibration_duration);
    },
    speech_reset: function(){
      this.speech_volume = 100;
      this.speech_rate = 100;
      this.speech_pitch = 100;
    },
    speech_start: async function(){
      await new Promise((resolve, reject) => {
        var utter = new window.SpeechSynthesisUtterance();
        utter.volume = this.speech_volume / 100;
        utter.rate = this.speech_rate / 100;
        utter.pitch = this.speech_pitch / 100;
        utter.text = this.speech_text;
        utter.lang = "ja-JP";

        var ok = false;
        var ng = false;
        utter.onend = function () {
          console.log('Event(Utter) : onend');
          if (!ok && !ng) {
            ok = true;
            resolve();
          }
        };
        utter.onstart = function () {
          console.log('Event(Utter) : onstart');
        };
        utter.onerror = function (error) {
          console.log('Event(Utter) : onerror');
          if (!ok && !ng) {
            ng = true;
            reject(error);
          }
        };

        window.speechSynthesis.cancel();
        return window.speechSynthesis.speak(utter);
      })
      .catch(error => {
        console.log(error);
      });
    },
    speech_recognition: async function(){
      this.speech_status = '音声認識中';
      this.speech_recognized = await new Promise((resolve, reject) => {
        var recognition = new webkitSpeechRecognition();
        recognition.lang = "ja-JP";
        recognition.continuous = false;

        var match = false;
        var error = false;
        recognition.onresult = function (e) {
          console.log('Event(Recog) : onresult');
          if (!match && !error) {
            match = true;

            var text = '';
            for (var i = 0; i < e.results.length; ++i) {
              text += e.results[i][0].transcript;
            }

            resolve(text);
          }
        };
        recognition.onend = function () {
          console.log('Event(Recog) : onend');
          if (!match && !error) {
            match = true;
            reject(error);
          }
          recognition.stop();
        };
        recognition.onnomatch = function () {
          console.log('Event(Recog) : onnomatch');
          if (!match && !error) {
            error = true;
            reject('nomatch');
          }
        };
        recognition.onerror = function (e) {
          console.log('Event(Recog) : onerror : ' + JSON.stringify(e));
          if (!match && !error) {
            error = true;
            this.speech_status = '';
            reject('onerror');
          }
        };

        recognition.start();
      })
      .catch(error => {
        console.log(error);
      });
      this.speech_status = '';
    },
    do_usermedia_list: function(){
      navigator.mediaDevices.enumerateDevices()
      .then(devices =>{
        console.log(devices);
        this.usermedia_list = devices;
      });
    },
    record_prepare: function(){
      this.record_dispose();

      this.record_previewing = true;
      var param_video = {};
      if( this.record_resolution > 0 )
        param_video.width = this.record_resolution;

      if( this.record_facing == "display"){
        navigator.mediaDevices.getDisplayMedia({ video: param_video, audio: this.record_audio })
        .then((stream) => {
            g_stream = stream;
            this.record_preview.srcObject = stream;
          })
          .catch(error =>{
            this.record_previewing = false;
            alert(error);
          });
      }else{
        param_video.facingMode = this.record_facing;
        navigator.mediaDevices.getUserMedia({ video: param_video, audio: this.record_audio })
        .then((stream) => {
            g_stream = stream;
            this.record_preview.srcObject = stream;
          })
          .catch(error =>{
            this.record_previewing = false;
            alert(error);
          });
        }
    },
    record_dispose: function(){
      if( g_recorder ){
        this.record_recording = false;
        g_recorder.stop();
        g_recorder = null;
      }
      this.record_preview.pause();
      this.record_preview.srcObject = null;
      g_stream = null;
      this.record_previewing = false;
    },
    record_start: function(){
      if (g_recorder) {
        g_recorder.stop();
        g_recorder = null;
      }

      this.record_recording = true;
      this.record_chunks = [];
      g_recorder = new MediaRecorder(g_stream);
      g_recorder.ondataavailable = this.record_onavailable;
      g_recorder.onstop = this.record_onstop;
      g_recorder.start();
    },
    record_stop: function(){
      console.log('stop');
      g_recorder.stop();
    },
    record_onavailable: function (e) {
      console.log('ondataavailable');
      this.record_chunks.push(e.data);
    },
    record_onstop: function () {
      if( !this.record_recording )
        return;

      console.log('onstop');
      var blob = new Blob(this.record_chunks, { type: g_recorder.mimeType });
      this.chunks = [];
      var mimeType = g_recorder.mimeType;
      g_recorder = null;
      this.record_recording = false;

      var url = window.URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.target = '_blank';
      if (mimeType.startsWith('video/x-matroska') )
        a.download = "record.webm";
      else
        a.download = "record.bin";
      a.click();
    },
    battery_refresh: function(){
      if( !( 'getBattery' in navigator ) ){
        alert('サポートしていません。');
        return;
      }
      navigator.getBattery()
        .then(battery => {
          this.battery = battery;
        });
    }
  },
  mounted: function () {
    this.record_preview = document.querySelector('#record_preview');
  }
};
