export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">Geocoding</h2>
  <h3>Decode</h3>
  <label class="title">pluscode</label>
  <input type="text" class="form-control" v-model="input_pluscode" placeholder="8Q7XFJ3V+25 or FJ3V+25 横浜市、神奈川県">
  <button class="btn btn-primary" v-on:click="do_pluscode_decode">Decode</button><br>
  <label class="title">type</label> {{input_type}}<br>
  <label class="title">lat,lng</label>
  <div class="input-group">
    <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(output_latlng)"></button>
    <input type="text" class="form-control" v-model="output_latlng" readonly>
    <a class="btn btn-secondary" v-bind:href="'https://www.google.com/maps?q=' + output_latlng" target="_blank">GoogleMap</a>
  </div>
  <br>

  <h3>Encode</h3>
  <label class="title">lat,lng</label>
  <input type="text" class="form-control" v-model="input_latlng" placeholder="35.4525625,139.64293750000002">
  <button class="btn btn-primary" v-on:click="do_pluscode_encode">Encode</button><br>

  <label class="title">pluscode</label>
  <div class="input-group">
    <button class="btn btn-secondary oi oi-paperclip" v-on:click="clip_copy(output_pluscode)"></button>
    <input type="text" class="form-control" v-model="output_pluscode" readonly>
    <a class="btn btn-secondary btn-sm" v-bind:href="'https://www.google.com/maps?q=' + encodeURIComponent(output_pluscode)" target="_blank">GoogleMap</a>
  </div>

  <br>
  <hr>
  <p>※国土地理院のAPI(https://msearch.gsi.go.jp/address-search/AddressSearch)を利用しています。</p>
</div>`,
  data: function () {
    return {
      input_pluscode: '',
      input_latlng: "",
      output_latlng: "",
      input_type: "",
      output_pluscode: "",
    }
  },
  methods: {
    /* Geocoding */
    do_pluscode_decode: async function(){
      try{
        if( !this.input_pluscode )
          return;

        const index = this.input_pluscode.trim().indexOf(' ');
        let fullCode;
        if( index < 0 ){
          this.input_type = "Full";
          fullCode = this.input_pluscode;
        }else{
          this.input_type = "Short";
          const codeFragment = this.input_pluscode.slice(0, index);
          const locality = this.input_pluscode.slice(index + 1).trim();
          
          console.log(codeFragment, locality);
          const url = "https://msearch.gsi.go.jp/address-search/AddressSearch";
          const result = await do_get(url, {
              q: locality
          });
          console.log(result);
      
          const latlng = { lat: result[0].geometry.coordinates[1], lng: result[0].geometry.coordinates[0] };
          console.log(latlng);
      
          fullCode = OpenLocationCode.recoverNearest(codeFragment, latlng.lat, latlng.lng);
          console.log(fullCode);
        }
        const codeArea = OpenLocationCode.decode(fullCode);
        console.log(codeArea);
        this.output_latlng = String(codeArea.latitudeCenter) + "," + String(codeArea.longitudeCenter);
      }catch(error){
        console.error(error);
        alert(error);
      }
    },
    do_pluscode_encode: function(){
      try{
        if( !this.input_latlng )
          return;

        const t = this.input_latlng.split(',');
        const pluscode = OpenLocationCode.encode(parseFloat(t[0]), parseFloat(t[1]));
        console.log(pluscode);
        this.output_pluscode = pluscode;
      }catch(error){
        console.error(error);
        alert(error);
      }
    },
  }
};
