const decoder = new TextDecoder("utf-8");

export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">シリアル</h2>
  <button class="btn btn-secondary" v-on:click="connect(!connected)"><span v-if="!connected">Connect</span><span v-else>Disconnect</span></button> <label class="title">connected:</label> {{connected}}
  <input type="checkbox" class="float-end" v-model="auto_scroll" id="auto_scroll"><label for="auto_scroll">auto-scroll</label>
  <button class="btn btn-secondary btn-sm float-end" v-on:click="text_clear">clear</button>
  <textarea class="form-control" style="height: 70vh" id="el" readonly>{{console_text}}</textarea>
</div>`,
  data: function () {
    return {
        console_text: "",
        connected: false,
        auto_scroll: true,
    }
  },
  methods: {
    /* シリアル */
        connect: async function(enable){
            try{
                await this.disconnect();
            }catch(error){}
            if( !enable )
                return;

            try{
                var port = await navigator.serial.requestPort();
                await port.open({ baudRate: 115200 });
                this.port = port;
                this.connected = true;
                this.console_text += "[[connected]]\n";
                this.receiveLoop();
            }catch(error){
                console.log(error);
                alert(error);
            }
        },

        disconnect: async function(){
            if( this.port ){
                if( this.reader )
                    await this.reader.cancel();
                await this.port.close();
                this.port = null;
            }
            this.connected = false;
        },

        data_process: function(value){
            this.console_text += decoder.decode(value);
            if( this.auto_scroll ){
              const el = document.getElementById('el');
              el.scrollTo(0, el.scrollHeight);
            }
        },

        receiveLoop: async function(){
            if( !this.port || !this.port.readable )
                throw 'port status invalid';

            this.reader = this.port.readable.getReader();
            return new Promise(async (resolve, reject) =>{
                do{
                    try{
                        var { value, done } = await this.reader.read();
                        if( done ){
                            this.console_text += '[[read done detected]]\n';
                            this.connected = false;
//                            this.disconnect();
                            return reject("read done detected");
                        }
                        this.data_process(value);
                    }catch(error){
                        console.log(error);
                    }
                }while(true);
            })
            .catch(error =>{
                console.log(error);
            });
        },
        text_clear: function(){
            this.console_text = "";
        }
  }
};
