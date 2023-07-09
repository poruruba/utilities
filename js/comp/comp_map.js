let map;
let target_marker;
let target_pline;
let target_circle;

export default {
  mixins: [mixins_bootstrap],
  template: `
<div>
  <h2 class="modal-header">マップ</h2>
  <button v-if="!started" class="btn btn-primary" v-on:click="start_map">描画開始</button>
  <div v-if="started">
    <div class="row">
        <label class="col-auto col-form-label title">外円距離</label>
        <span class="col-auto">
          <span class="input-group">
            <input type="number" class="form-control" v-model.number="outer_distance" v-on:change="distance_change" step="1000">
            <span class="input-group-text">m</span>
          </span>
        </span>
    </div>
    <label class="col-auto title">合算距離</label> {{(total_distance / 1000).toFixed(2)}} km <label class="col-auto title">直線距離</label> {{(direct_distance / 1000).toFixed(2)}} km<br>
    <label class="col-auto title">スタート地点</label> <span v-if="start_latlng.lat">
      {{start_latlng.lat}},{{start_latlng.lng}} <button class="btn btn-secondary oi oi-paperclip" v-on:click="call_clip_copy(start_latlng)"></button> <button class="btn btn-secondary oi oi-map" v-on:click="call_googlemap(start_latlng)"></button>
    </span><br>
    <label class="col-auto title">ゴール地点</label> <span v-if="end_latlng.lat">
      {{end_latlng.lat}},{{end_latlng.lng}} <button class="btn btn-secondary oi oi-paperclip" v-on:click="call_clip_copy(end_latlng)"></button> <button class="btn btn-secondary oi oi-map" v-on:click="call_googlemap(end_latlng)"></button>
    </span><br>
    <br>
    <button class="btn btn-primary" v-on:click="pline_clear">リセット</button>
    <button class="btn btn-secondary btn-sm" v-on:click="call_goto_current">現在地</button>
  </div>
  <br>

  <div id="mapcontainer" style="height:60vh"></div>
</div>

</div>`,
  data: function () {
    return {
      default_lat: 35.40,
      default_lng: 136.0,
      started: false,
      total_distance: 0.0,
      direct_distance: 0.0,
      inner_distance: 1000,
      outer_distance: 10000,
      start_latlng: {},
      end_latlng: {},
    }
  },
  methods: {
    /* Map */
    call_goto_current: function(){
      navigator.geolocation.getCurrentPosition((position) =>{
        map.setView([ position.coords.latitude, position.coords.longitude ]);
      }, (error) =>{
        console.error(error);
        alert(error);
      });
    },
    call_clip_copy: function(latlng){
      var msg = latlng.lat + ',' + latlng.lng;
      this.clip_copy(msg);
      this.toast_show("クリップボードにコピーしました。");
    },
    call_googlemap: function(latlng){
      var url = "http://maps.google.com/maps?q=" + latlng.lat + ',' + latlng.lng;
      window.open(url);
    },
    distance_change: function(){
      if( !this.started )
        return;
      var list = target_pline.getLatLngs();
      if( list.length >= 1 )
        target_circle.setRadius(this.outer_distance);
    },
    start_map: async function(){
      map = L.map('mapcontainer', {
        zoomControl: true,
      }).on('click', (e) =>{
//        console.log(e);
        target_pline.addLatLng(e.latlng);
        var list = target_pline.getLatLngs();
        if( list.length == 1 ){
          this.start_latlng = e.latlng;
          target_marker.setRadius(10);
          target_marker.setLatLng([e.latlng.lat, e.latlng.lng]);
          target_circle.setLatLng([e.latlng.lat, e.latlng.lng]);
          target_circle.setRadius(this.outer_distance);
          localStorage.setItem("default_latlng", JSON.stringify({ lat: e.latlng.lat, lng: e.latlng.lng}));
        }else{
          if( list.length >= 2){
            this.end_latlng = e.latlng;
            this.direct_distance = this.start_latlng.distanceTo(this.end_latlng);
            this.total_distance = list.reduce((total, item, index) =>{
              if( index < 1 )
                return total;
              else
                return total += list[index - 1].distanceTo(item);
            }, 0.0);
          }
        }
      });
      map.setView([this.default_lat, this.default_lng], 10, true);
  
      L.control.scale({
          imperial: false
      }).addTo(map);
  
      L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
          attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank' rel='noopener noreferrer'>地理院タイル</a>"
      }).addTo(map);

      target_marker = L.circleMarker([this.default_lat, this.default_lng], { radius: 0 }).addTo(map);
      target_circle = L.circle([this.default_lat, this.default_lng], { radius: 0, color: "#FF5555", fill: false, weight: 3} ).addTo(map);
      target_pline = L.polyline([], { color: 'blue', weight: 3 }).addTo(map);

      this.started = true;
    },
    pline_clear: function(){
      target_marker.setRadius(0);
      target_circle.setRadius(0);
      target_pline.setLatLngs([]);
      this.total_distance = 0.0;
      this.distance_change = 0.0;
      this.start_latlng = {};
      this.end_latlng = {};
    },
  },
  mounted: async function(){
    var latlng = localStorage.getItem('default_latlng');
    if( latlng ){
      latlng = JSON.parse(latlng);
        this.default_lat = latlng.lat;
        this.default_lng = latlng.lng;
    }
  }
};
