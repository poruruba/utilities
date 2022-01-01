const MAX_UPLOAD_IMAGE_SIZE = 1024;

var startX;
var startY;
var endX;
var endY;
var drawingCanvas;
var imageCanvas;
var drawingCtx;
var drawed = false;

export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">OCR</h2>

  <div class="row float-end">
    <div class="col-auto">
      <input type="text" class="form-control" v-model="base_url" placeholder="base_url">
    </div>
    <div class="col-auto">
      <label class="title">secret</label>
    </div>
    <div class="col-auto">
      <input type="password" class="form-control" v-model="share_secret">
    </div>
  </div>
  <br>
  <br>
  <div class="row">
    <div class="col-3">
      <textarea placeholder="ここに画像かテキストをペースト(Ctrl-V)してください。" clsss="form-control" style="text-align: center; resize: none;" rows="5" 
        v-on:paste="do_paste" v-on:drop.prevent="do_file_pase" v-on:dragover.prevent readonly>
      </textarea>
    </div>
    <div class="col-9">
      <button class="btn btn-secondary btn-sm float-end" v-on:click="trim_space">スペース除去</button>
      <button class="btn btn-secondary btn-sm float-end" v-on:click="trim_cr">改行除去</button>
      <textarea placeholder="ここにペーストした文字列が表示されます。" class="form-control" v-model="result_text" rows="3"></textarea><br>
    </div>
  </div>
  <div class="row">
    <button class="btn btn-secondary btn-sm col-auto" v-on:click="all_region">全選択</button>
    <button class="btn btn-secondary btn-sm col-auto" v-on:click="clear_region">範囲クリア</button>
    <button v-bind:disabled="!share_secret" class="btn btn-secondary btn-sm col-auto" v-on:click="do_share">共有</button>
    <button v-bind:disabled="!share_secret" class="btn btn-secondary btn-sm col-auto" v-on:click="get_share">取得</button>
    <span class="col-auto">
      <select class="form-select" v-model="ocr_lang">
        <option value="jpn">jpn</option>
        <option value="eng">eng</option>
      </select>
    </span>
  </div>
  <div class="row">
    <div style="position: relative">
      <canvas id="image_canvas" style="position: absolute; left: 0; top: 0; z-index: 0; border: 1px solid;"></canvas>
      <canvas id="region_canvas" style="position: absolute; left: 0; top: 0; z-index: 1; border: 1px solid;" v-on:drop.prevent="do_file_pase" v-on:dragover.prevent
        v-on:mousemove="onMouseMove" v-on:mouseup="onMouseUp" v-on:mouseover="onMouseOut" v-on:mousedown="onMouseDown"></canvas>
    </div>
  </div>
</div>`,
  data: function () {
    return {
      result_text: "",
      share_secret: "",
      canvasWidth: 0,
      canvasHeight: 0,
      base_url: "",
      ocr_lang: "jpn",  
    }
  },
  methods: {
    /* OCR・共有 */
    do_scan: function(){
      this.progress_open();
      Tesseract.recognize(
          drawingCanvas,
          this.ocr_lang
      )
      .then( result =>{
          console.log(result);
          this.result_text = result.data.text;
          drawingCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
          drawingCtx.strokeRect(startX, startY, endX - startX, endY - startY);
      })
      .catch(error =>{
          console.error(error);
      })
      .finally(() =>{
          this.progress_close();
      });
    },
    do_file_pase: function(e){
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
        }else
        if( file.type.startsWith('text/')){
            var reader = new FileReader();
            reader.onload = (e) => {
                this.result_text = e.target.result;
            };
            reader.readAsText(file);
        }else{
            alert('サポートしていません。');
        }
    },
    do_paste: async function(e){
        console.log(e);
        if (e.clipboardData.types.length == 0)
            return;

        var item = e.clipboardData.items[0];
        console.log(item.type);
        if( item.type.startsWith('text/')){
            e.clipboardData.items[0].getAsString(str =>{
                console.log(str);
                this.result_text = str;
            });
            return;
        }else
        if( item.type.startsWith('image/')){
            var imageFile = e.clipboardData.items[0].getAsFile();
            var reader = new FileReader();
            reader.onload = (e) => {
                var data_url = e.target.result;
                this.set_dataurl(data_url);
            };
            reader.readAsDataURL(imageFile);
        }else{
            alert('サポートしていません。');
        }
    },
    onMouseMove: function(e){
  //            console.log('onMouseMove');
        if( !this.mousePressed )
            return;
        drawingCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        endX = e.layerX;
        endY = e.layerY;
        drawingCtx.strokeRect(startX, startY, endX - startX, endY - startY);
    },
    onMouseUp: function(e){
  //            console.log('onMouseUp');
        if( !this.mousePressed )
            return;
        this.mousePressed = false;
        drawingCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        endX = e.layerX;
        endY = e.layerY;
        if( startX == endX || startY == endY )
            return;
        drawingCtx.strokeRect(startX, startY, endX - startX, endY - startY);
        this.region_selected();
    },
    onMouseDown: function(e){
  //            console.log('onMouseDown');
        if( !drawed )
            return;
        this.mousePressed = true;
        drawingCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        startX = e.layerX;
        startY = e.layerY;
    },
    onMouseOut: function(ev){
  //            console.log('onMouseOut');
        if( !this.mousePressed )
            return;
        this.mousePressed = false;
        drawingCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    },
    all_region: function(){
        if( !drawed )
            return;
        startX = 0;
        startY = 0;
        endX = this.canvasWidth - 1;
        endY = this.canvasHeight - 1;
        this.region_selected();
    },
    clear_region: function(){
        startX = startY = endX = endY = 0;
        drawingCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    },
    region_selected: function(){
        console.log(startX, startY, endX, endY, this.canvasWidth, this.canvasHeight);

        var width  = Math.abs(startX - endX);
        var height = Math.abs(startY - endY);
        drawingCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        drawingCtx.drawImage(imageCanvas, Math.min(startX, endX), Math.min(startY, endY), width, height, Math.min(startX, endX), Math.min(startY, endY), width, height);

        this.do_scan();
    },
    do_share: async function(){
        if( !this.share_secret ){
            alert('secretを入力してください。');
            return;
        }
        try{
            this.progress_open();
            var element = document.createElement('canvas');
            var ctx = element.getContext('2d');
            var scale = this.auto_scale(this.canvasWidth, this.canvasHeight, MAX_UPLOAD_IMAGE_SIZE);
            ctx.width = Math.floor(this.canvasWidth / scale);
            ctx.height = Math.floor(this.canvasHeight / scale);
            ctx.drawImage(imageCanvas, 0, 0, this.canvasWidth, this.canvasHeight, 0, 0, ctx.width, ctx.height);
            var data_url = element.toDataURL('image/jpeg');
            var params = {
                secret: this.share_secret,
                data_url: data_url,
                result_text: this.result_text,
            };
            console.log("data_url=" + data_url.length);
            await do_post(this.base_url + "/share-set", params);
            Cookies.set('share_base_url', this.base_url, { expires: 365 });
            Cookies.set('share_secret', this.share_secret, { expires: 365 });
            alert('共有しました。');
        }catch(error){
            alert(error);
        }finally{
            this.progress_close();
        }
    },
    get_share: async function(){
        if( !this.share_secret ){
            alert('secretを入力してください。');
            return;
        }
        try{
            this.progress_open();
            var params = {
                secret: this.share_secret,
            };
            var json = await do_post(this.base_url + "/share-get", params);
            if( json.status != 'ok' ){
                alert(json.message);
                return;
            }
            this.set_dataurl(json.result.data_url);
            this.result_text = json.result.result_text;
            Cookies.set('share_base_url', this.base_url, { expires: 365 });
            Cookies.set('share_secret', this.share_secret, { expires: 365 });
        }catch(error){
            alert(error);
        }finally{
            this.progress_close();
        }
    },
    set_dataurl: function(data_url){
        var image = new Image();
        image.onload = () =>{
            this.canvasWidth = image.width;
            this.canvasHeight = image.height;
            imageCanvas.width = this.canvasWidth;
            imageCanvas.height = this.canvasHeight;
            var ctx = imageCanvas.getContext('2d');
            ctx.drawImage(image, 0, 0, this.canvasWidth, this.canvasHeight);
            drawingCanvas.width = this.canvasWidth;
            drawingCanvas.height = this.canvasHeight;
            drawingCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            drawed = true;
        };
        image.src = data_url;
    },
    trim_space: function(){
        this.result_text = this.result_text.replace(/ /g, "");
    },
    trim_cr: function(){
        this.result_text = this.result_text.replace(/\n/g, "");
    },
    auto_scale: function(width, height, limit){
        var scale = 1;
        while(Math.floor(width / scale) > limit || Math.floor(height / scale) > limit){
            scale++;
        }
        return scale;
    },
  },
  mounted: function(){
    this.share_secret = Cookies.get('share_secret');
    this.base_url = Cookies.get('share_base_url');

    imageCanvas = document.querySelector("#image_canvas");
    drawingCanvas = document.querySelector("#region_canvas");
    drawingCtx = drawingCanvas.getContext("2d");
    drawingCtx.lineWidth = 3;
  }
};
