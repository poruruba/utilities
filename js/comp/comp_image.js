const IMAGE_ICON_LIST = {
  android: [192, 144, 96, 72, 48, 36],
  iphone: [180, 167, 152, 120, 87, 80, 76, 60, 58, 40, 29, 20],
  windows: [48, 32, 16],
  alexa: [512, 108],
};

export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">画像ファイル</h2>
  <comp_file id="image_file" v-bind:callback="image_open_files" ref="image_file"></comp_file>
  <label class="title">mime-type</label> {{image_type}}&nbsp;&nbsp;<label class="title">size</label> {{image_size.width}}x{{image_size.height}}<br>
  <br>
  <div class="row">
      <label class="col-auto title">icon size</label>
      <span class="col-auto">
          <select class="form-select" v-model="image_icon">
              <option v-for="(item, name) in image_icon_list" v-bind:value="name">{{name}}</option>
          </select>
      </span>
      <span class="col-auto">{{image_icon_list[image_icon]}}</span>
  </div>
  <div class="row">
      <label class="col-auto title">rotate</label>
      <span class="col-auto">
          <select class="form-select" v-model.number="image_rotate" v-on:change="image_scale_change">
              <option value="0">0°</option>
              <option value="90">90°</option>
              <option value="180">180°</option>
              <option value="270">270°</option>
          </select>
      </span>
  </div>
  <div class="container">
      <div class="row">
          <label class="col-auto title">scale</label>
          <span class="col-auto">
              <select class="form-select" v-model="image_scale" v-on:change="image_scale_change">
                  <option value="cover">cover</option>
                  <option value="contain">contain</option>
                  <option value="crop">crop</option>
              </select>
          </span>
      </div>
      <br>
      <button class="btn btn-primary" v-on:click="image_save()">ファイルに保存</button><br>
      <br>
      <div class="row">
          <div class="col-6 text-center"><label class="title">オリジナル</label></div>
          <div class="col-1"></div>
          <div class="col-5 text-center"><label class="title">scale変換後</label></div>
      </div>
      <div class="row">
          <span class="col-6">
              <img v-if="!image_src" class="center-block" src="img/image_drop.png" v-on:drop="image_drop" v-on:dragover.prevent>
              <img v-if="image_src" class="img-fluid img-thumbnail" v-bind:src="image_src" v-on:drop="image_drop" v-on:dragover.prevent>
          </span>
          <div class="col-1"></div>
          <canvas v-if="image_src" class="col-5 img-fluid img-thumbnail" id="image_icon"></canvas>
      </div>
  </div>
</div>`,
  data: function () {
    return {
      image_rotate: 0,
      image_icon: 'android',
      image_icon_list: IMAGE_ICON_LIST,
      image_image: null,
      image_image_scaled: null,
      image_size: {},
      image_scale: 'crop',
      image_src: null,
      image_type: '',
    }
  },
  methods: {
    /* 画像ファイル */
    image_drop: function (e) {
      this.$refs.image_file.file_drop(e);
    },
    image_open_files: function (files) {
      if( files.length == 0 ){
        this.image_type = '';
        this.image_src = null;
        return;
      }
      var file = files[0];
      if (!file.type.startsWith('image/')) {
        alert('画像ファイルではありません。');
        return;
      }

      var reader = new FileReader();
      reader.onload = (theFile) => {
        this.image_type = file.type;
        this.image_src = reader.result;
        this.image_image = new Image();
        this.image_image.onload = () => {
          this.image_size = { width: this.image_image.width, height: this.image_image.height };
          this.image_scale_change();
        };
        this.image_image.src = this.image_src;
      };
      reader.readAsDataURL(file);
    },
    image_scale_change: function () {
      if (!this.image_src)
        return;

      var image = this.image_image;
      var size, sx, sy, sw, sh, dx, dy, dw, dh;

      if (this.image_scale == 'cover') {
        size = (image.width > image.height) ? image.width : image.height;
        sx = sy = 0;
        sw = image.width;
        sh = image.height;
        dx = dy = 0;
        dw = dh = size;
      } else
        if (this.image_scale == 'contain') {
          size = (image.width > image.height) ? image.width : image.height;
          var x = Math.floor((size - image.width) / 2);
          var y = Math.floor((size - image.height) / 2);
          sx = 0;
          sy = 0;
          sw = image.width;
          sh = image.height;
          dx = x;
          dy = y;
          dw = image.width;
          dh = image.height;
        } else
          if (this.image_scale == 'crop') {
            size = (image.width < image.height) ? image.width : image.height;
            var x = Math.floor((image.width - size) / 2);
            var y = Math.floor((image.height - size) / 2);
            sx = x;
            sy = y;
            sw = sh = size;
            dx = dy = 0;
            dw = dh = size;
          }

      var canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      var context = canvas.getContext('2d');

      var trans = Math.floor(size / 2);
      context.translate(trans, trans);
      context.rotate(this.image_rotate * Math.PI / 180);
      context.translate(-trans, -trans);

      context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);

      this.image_image_scaled = canvas;

      var canvas2 = document.querySelector('#image_icon');
      canvas2.width = canvas.width;
      canvas2.height = canvas.height;
      var context2 = canvas2.getContext('2d');
      context2.drawImage(canvas, 0, 0);
    },
    image_save: async function () {
      if (!this.image_src)
        return;

      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      var zip = new JSZip();
      var list = this.image_icon_list[this.image_icon];
      for (var i = 0; i < list.length; i++) {
        canvas.width = list[i];
        canvas.height = list[i];
        context.drawImage(this.image_image_scaled, 0, 0, this.image_image_scaled.width, this.image_image_scaled.height, 0, 0, canvas.width, canvas.height);

        var data_url = canvas.toDataURL('image/png');
        var byteStr = atob(data_url.split(",")[1]);
        var content = new Uint8Array(byteStr.length);
        for (var j = 0; j < byteStr.length; j++)
          content[j] = byteStr.charCodeAt(j);
        var blob = new Blob([content], {
          type: this.image_type,
        });

        var fname = list[i] + "x" + list[i] + '.png';
        zip.file(fname, blob);
      }

      var zip_blob = await zip.generateAsync({ type: "blob" })
      var url = window.URL.createObjectURL(zip_blob);

      var a = document.createElement("a");
      a.href = url;
      a.target = '_blank';
      a.download = "icon_list.zip";
      a.click();
      window.URL.revokeObjectURL(url);
    },
  }
};
