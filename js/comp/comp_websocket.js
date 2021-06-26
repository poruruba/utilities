const log_separator = "\n----------\n";

export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">WebSocket</h2>
  <label class="title">url</label>
  <input type="text" class="form-control" v-model="ws_url" placeholder="wss://192.168.1.1:443/ws">
  <div class="row">
    <label class="col-auto title">protocols</label>
    <span class="col-auto">
      <input type="text" class="form-control" v-model="ws_protocols">
    </span>
  </div>
  <button class="btn btn-secondary" v-on:click="ws_open" v-if="!ws_socket">Open</button>
  <button class="btn btn-secondary" v-on:click="ws_close" v-else>Close</button>
  <br>
  status: {{ws_status_message}}
  <br><br>
  <div class="row">
    <label class="col-auto title">message</label>
    <span class="col-auto">
      <select class="form-select" v-model="ws_send_type">
        <option value="text">text</option>
        <option value="binary">binary</option>
      </select>
    </span>
  </div>
  <input type="text" class="form-control" v-model="ws_send_message">
  <button class="btn btn-secondary" v-on:click="ws_send" v-bind:disabled="!ws_socket">送信</button>
  <br><br>
  <textarea class="form-control col" id="ws_textarea" rows="10">{{ws_console_message}}</textarea>
  <button class="btn btn-secondary" v-on:click="console_clear">クリア</button>
</div>`,
  data: function () {
    return {
      ws_socket: null,
      ws_url: "",
      ws_protocols: "",
      ws_console_message: "",
      ws_send_type: "text",
      ws_send_message: "",
      ws_status_message: "closed",
    }
  },
  methods: {
    /* WebSocket */
    ws_open: function(){
      this.ws_close();
      
      try{
        this.ws_socket = new WebSocket(this.ws_url);
        this.ws_socket.binaryType = "arraybuffer";
        this.ws_socket.onopen = (event) => {
//          console.log("websocket opened", event);
          this.console_log(this.make_console_state_message(event));
          var date_string = new Date().toLocaleString('ja-JP', { "hour12": false, "year": "numeric", "month": "2-digit", "day": "2-digit", "hour": "2-digit", "minute": "2-digit", "second": "2-digit" });
          this.ws_status_message = "opened from " + date_string;
        };
        this.ws_socket.onclose = (event) =>{
//          console.log("websocket closed", event);
          this.console_log(this.make_console_close_message(event));
          this.ws_socket = null;
          this.ws_status_message = "closed";
        };
        this.ws_socket.onerror = (event) =>{
//          console.log("websocket error", event);
          this.console_log(this.make_console_state_message(event));
        };
        this.ws_socket.onmessage = (event) => {
//          console.log("websocket message", event);
          if (typeof (event.data) == "string" || event.data instanceof String ){
            this.console_log(this.make_console_input_message(event));
          }else{
            this.console_log(this.make_console_input_message(event));
          }
        };
      }catch(error){
        alert(error);
      }
    },
    ws_close: function(){
      if (this.ws_socket)
        this.ws_socket.close();
    },
    ws_send: function(){
      if( this.ws_send_type == "text" ){
        this.ws_socket.send(this.ws_send_message);
        this.console_log(this.make_console_output_message("text", this.ws_send_message));
      }else{
        var data = this.hex2ba(this.ws_send_message);
        var array = new Uint8Array(data);
        this.ws_socket.send(array);
        this.console_log(this.make_console_output_message("binary", array));
      }
    },
    console_clear: function () {
      this.ws_console_message = "";
    },
    make_console_output_message: function (type, data) {
      var date_string = new Date().toLocaleString('ja-JP', { "hour12": false, "year": "numeric", "month": "2-digit", "day": "2-digit", "hour": "2-digit", "minute": "2-digit", "second": "2-digit" });
      var message;
      if (typeof (data) == "string" || data instanceof String) {
        message = data;
      } else {
//        message = new Uint8Array(data).toString();
        message = this.ba2hex(data);
      }
      return "[SEND] message " + type + " " + date_string + "\n" + message;
    },
    make_console_state_message: function (event) {
      var date_string = new Date().toLocaleString('ja-JP', { "hour12": false, "year": "numeric", "month": "2-digit", "day": "2-digit", "hour": "2-digit", "minute": "2-digit", "second": "2-digit" });
      return "[STATE] " + event.type + " " + date_string;
    },
    make_console_close_message: function (event) {
      var date_string = new Date().toLocaleString('ja-JP', { "hour12": false, "year": "numeric", "month": "2-digit", "day": "2-digit", "hour": "2-digit", "minute": "2-digit", "second": "2-digit" });
      return "[STATE] " + event.type + " code=" + event.code + " " + date_string;
    },
    make_console_input_message: function(event){
      var date_string = new Date().toLocaleString('ja-JP', { "hour12": false, "year": "numeric", "month": "2-digit", "day": "2-digit", "hour": "2-digit", "minute": "2-digit", "second": "2-digit" });
      var message;
      var type;
      if (typeof (event.data) == "string" || event.data instanceof String) {
        message = event.data;
        type = "text";
      } else {
//        message = new Uint8Array(event.data).toString();
        message = this.ba2hex(event.data);
        type = "binary";
      }
      
      return "[RECV] " + event.type + " " + type + " " + date_string + "\n" + message;
    },
    console_log: function(message){
      this.ws_console_message = message + log_separator + this.ws_console_message;
    }
  },
  mounted: function(){
    var elem_in = document.querySelector("#ws_textarea");
    elem_in.style.height = 10;
  }
};
