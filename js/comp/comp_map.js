let map;
let center_marker;
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
    <label class="col-auto title">中心地点</label> {{center_latlng.lat?.toFixed(7)}},{{center_latlng.lng?.toFixed(7)}} <button class="btn btn-secondary oi oi-paperclip" v-on:click="call_clip_copy(center_latlng)"></button> <button class="btn btn-secondary oi oi-map" v-on:click="call_googlemap(center_latlng)"></button><br>
    <label class="col-auto title">スタート地点</label> {{start_latlng.lat?.toFixed(7)}},{{start_latlng.lng?.toFixed(7)}} <button class="btn btn-secondary oi oi-paperclip" v-on:click="call_clip_copy(start_latlng)"></button> <button class="btn btn-secondary oi oi-map" v-on:click="call_googlemap(start_latlng)"></button><br>
    <label class="col-auto title">ゴール地点</label> {{end_latlng.lat?.toFixed(7)}},{{end_latlng.lng?.toFixed(7)}} <button class="btn btn-secondary oi oi-paperclip" v-on:click="call_clip_copy(end_latlng)"></button> <button class="btn btn-secondary oi oi-map" v-on:click="call_googlemap(end_latlng)"></button><br>
    <br>
    <button class="btn btn-primary" v-on:click="pline_clear">リセット</button>
    <button class="btn btn-primary" v-on:click="pline_previous">ひとつ前に戻る</button>
    <button class="btn btn-secondary btn-sm" v-on:click="call_goto_current">現在地に移動</button>
    <button class="btn btn-secondary btn-sm" v-on:click="call_set_center">中心地点をセット</button>
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
      outer_distance: 10000,
      start_latlng: {},
      end_latlng: {},
      center_latlng: {},
    }
  },
  methods: {
    /* Map */
    call_set_center: function(){
      var latlng = map.getCenter();
      this.add_point(latlng.lat, latlng.lng);
    },
    call_goto_current: function(){
      navigator.geolocation.getCurrentPosition((position) =>{
        map.setView([ position.coords.latitude, position.coords.longitude ]);
      }, (error) =>{
        console.error(error);
        alert(error);
      });
    },
    call_clip_copy: function(latlng){
      var msg = latlng.lat.toFixed(7) + ',' + latlng.lng.toFixed(7);
      this.clip_copy(msg);
      this.toast_show("クリップボードにコピーしました。");
    },
    call_googlemap: function(latlng){
      var url = "http://maps.google.com/maps?q=" + latlng.lat.toFixed(7) + ',' + latlng.lng.toFixed(7);
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
          this.add_point(e.latlng.lat, e.latlng.lng);
      }).on('move', (e) =>{
//        console.log(e);
        if( center_marker ){
          this.center_latlng = map.getCenter();
          center_marker.setLatLng(this.center_latlng);
        }
      });
      map.setView([this.default_lat, this.default_lng], 10, true);
  
      L.control.scale({
          imperial: false
      }).addTo(map);
  
      L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
          attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank' rel='noopener noreferrer'>地理院タイル</a>"
      }).addTo(map);

      center_marker = L.marker([this.default_lat, this.default_lng]).addTo(map);
      target_marker = L.circleMarker([this.default_lat, this.default_lng], { radius: 0 }).addTo(map);
      target_circle = L.circle([this.default_lat, this.default_lng], { radius: 0, color: "#FF5555", fill: false, weight: 3} ).addTo(map);
      target_pline = L.polyline([], { color: 'blue', weight: 3 }).addTo(map);

      this.started = true;
    },
    pline_previous: function(){
      var list = target_pline.getLatLngs();
      if( list.length <= 0 ){
        return;
      }else if(list.length == 1){
        this.pline_clear();
      }else if(list.length == 2){
        var latlng = list[0];
        this.pline_clear();
        this.add_point(latlng.lat, latlng.lng);
      }else{
        list.pop();
        var latlng = list.pop();
        target_pline.setLatLngs(list);
        this.add_point(latlng.lat, latlng.lng);
      }
    },
    pline_clear: function(){
      target_marker.setRadius(0);
      target_circle.setRadius(0);
      target_pline.setLatLngs([]);
      this.total_distance = 0.0;
      this.direct_distance = 0.0;
      this.start_latlng = {};
      this.end_latlng = {};
    },
    add_point: function(lat, lng){
      var latlng = L.latLng(lat, lng);
      target_pline.addLatLng(latlng);
      var list = target_pline.getLatLngs();
      if( list.length == 1 ){
        this.start_latlng = latlng;
        target_marker.setRadius(10);
        target_marker.setLatLng(latlng);
        target_circle.setLatLng(latlng);
        target_circle.setRadius(this.outer_distance);
        localStorage.setItem("default_latlng", JSON.stringify({ lat: latlng.lat, lng: latlng.lng}));
      }else
      if( list.length >= 2){
        this.end_latlng = latlng;
        this.direct_distance = this.start_latlng.distanceTo(this.end_latlng);
        this.total_distance = list.reduce((total, item, index) =>{
          if( index < 1 )
            return total;
          else
            return total += list[index - 1].distanceTo(item);
        }, 0.0);
      }
    }
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
