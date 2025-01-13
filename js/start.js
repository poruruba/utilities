'use strict';

//const vConsole = new VConsole();
//window.datgui = new dat.GUI();

const FAVORITE_MAX = 5;
const TAB_LIST = [
	{ id: 'qrcode', name: 'QRコード' },
	{ id: 'encode', name: 'エンコード' },
	{ id: 'string', name: '文字列' },
	{ id: 'uuid', name: 'UUID' },
	{ id: 'passwd', name: 'パスワード' },
	{ id: 'image', name: '画像ファイル' },
	{ id: 'color', name: 'カラー' },
	{ id: 'crypto', name: '暗号化' },
	{ id: 'binary', name: 'バイナリファイル' },
	{ id: 'array', name: 'バイト配列' },
        { id: 'bits', name: 'ビット演算' },
	{ id: 'cardinal', name: '基数' },
	{ id: 'date', name: '日時' },
	{ id: 'arrange', name: '整形' },
        { id: 'gengou', name: '元号' },
        { id: 'blecent', name: 'BLECentral' },
        { id: 'websocket', name: 'WebSocket' },
        { id: 'html5', name: 'HTML5' },
        { id: 'x509', name: 'X.509' },
        { id: 'asn1', name: 'ASN.1' },
        { id: 'jwt', name: 'JWT' },
        { id: 'graph', name: 'グラフ' },
	{ id: 'ocrshare', name: 'OCR' },
	{ id: 'dataurl', name: 'DataURL' },
	{ id: 'yaml', name: 'YAML' },
	{ id: 'regex', name: 'Regex' },
	{ id: 'oidc', name: 'OIDC' },
	{ id: 'serial', name: 'シリアル' },
	{ id: 'map', name: 'マップ' },
	{ id: 'geocode', name: 'Geocoding' },
	{ id: 'help', name: 'ヘルプ' },
];

var vue_options = {
    el: "#top",
    mixins: [mixins_bootstrap],
    data: {
		tab_list: TAB_LIST,
        favorite_link: [],
    },
    computed: {
    },
    methods: {
    	/* お気に入りタブ */
        get_tab_name: function(id){
    		for( var i = 0 ; i < this.tab_list.length ; i++ )
    			if( this.tab_list[i].id == id )
    				return this.tab_list[i].name;
    		return 'Unknown';
        },
        favorite_add: function(link){
    		var index = this.favorite_link.indexOf(link);
			if( index >= 0 )
				this.favorite_link.splice(index, 1);
			else if( this.favorite_link.length >= FAVORITE_MAX )
				this.favorite_link.pop();
			
            this.favorite_link.unshift(link);
            localStorage.setItem('favorite_link', JSON.stringify(this.favorite_link));
        },
        oidc_do_token: function(message){
            console.log(message);
            this.$refs.oidc.oidc_do_token(message);
        },
    },
    created: function(){
    },
    mounted: function(){
        proc_load();

        history.replaceState(null, null, location.pathname);

		var link = localStorage.getItem('favorite_link');
		if( !link )
            this.favorite_add(this.tab_list[0].id)
		else
			this.favorite_link = JSON.parse(link);
		
//        this.tab_select('#' + this.favorite_link[0]);
        this.tab_select('#' + this.tab_list[0].id);
	this.favorite_add(this.tab_list[0].id);

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').then(async (registration) => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }).catch((err) => {
                console.log('ServiceWorker registration failed: ', err);
            });
        }
	    
        loader_loaded();
    }
};
vue_add_data(vue_options, { progress_title: '' }); // for progress-dialog
vue_add_global_components(components_bootstrap);
vue_add_global_components(components_utils);

/* add additional components */
import comp_arrange from './comp/comp_arrange.js';
import comp_blecent from './comp/comp_blecent.js';
import comp_uuid from './comp/comp_uuid.js';
import comp_image from './comp/comp_image.js';
import comp_qrcode from './comp/comp_qrcode.js';
import comp_string from './comp/comp_string.js';
import comp_crypto from './comp/comp_crypto.js';
import comp_encode from './comp/comp_encode.js';
import comp_password from './comp/comp_password.js';
import comp_color from './comp/comp_color.js';
import comp_binary from './comp/comp_binary.js';
import comp_array from './comp/comp_array.js';
import comp_date from './comp/comp_date.js';
import comp_cardinal from './comp/comp_cardinal.js';
import comp_gengou from './comp/comp_gengou.js';
import comp_websocket from './comp/comp_websocket.js';
import comp_html5 from './comp/comp_html5.js';
import comp_x509 from './comp/comp_x509.js';
import comp_asn1 from './comp/comp_asn1.js';
import comp_jwt from './comp/comp_jwt.js';
import comp_ocrshare from './comp/comp_ocrshare.js';
import comp_dataurl from './comp/comp_dataurl.js';
import comp_yaml from './comp/comp_yaml.js';
import comp_regex from './comp/comp_regex.js';
import comp_oidc from './comp/comp_oidc.js';
import comp_serial from './comp/comp_serial.js';
import comp_map from './comp/comp_map.js';
import comp_geocode from './comp/comp_geocode.js';
import comp_bits from './comp/comp_bits.js';
import comp_graph from './comp/comp_graph.js';
vue_add_component(vue_options, "comp_arrange", comp_arrange);
vue_add_component(vue_options, "comp_blecent", comp_blecent);
vue_add_component(vue_options, "comp_uuid", comp_uuid);
vue_add_component(vue_options, "comp_image", comp_image);
vue_add_component(vue_options, "comp_qrcode", comp_qrcode);
vue_add_component(vue_options, "comp_string", comp_string);
vue_add_component(vue_options, "comp_crypto", comp_crypto);
vue_add_component(vue_options, "comp_encode", comp_encode);
vue_add_component(vue_options, "comp_password", comp_password);
vue_add_component(vue_options, "comp_color", comp_color);
vue_add_component(vue_options, "comp_binary", comp_binary);
vue_add_component(vue_options, "comp_array", comp_array);
vue_add_component(vue_options, "comp_date", comp_date);
vue_add_component(vue_options, "comp_cardinal", comp_cardinal);
vue_add_component(vue_options, "comp_gengou", comp_gengou);
vue_add_component(vue_options, "comp_websocket", comp_websocket);
vue_add_component(vue_options, "comp_html5", comp_html5);
vue_add_component(vue_options, "comp_x509", comp_x509);
vue_add_component(vue_options, "comp_asn1", comp_asn1);
vue_add_component(vue_options, "comp_jwt", comp_jwt);
vue_add_component(vue_options, "comp_ocrshare", comp_ocrshare);
vue_add_component(vue_options, "comp_dataurl", comp_dataurl);
vue_add_component(vue_options, "comp_yaml", comp_yaml);
vue_add_component(vue_options, "comp_regex", comp_regex);
vue_add_component(vue_options, "comp_oidc", comp_oidc);
vue_add_component(vue_options, "comp_serial", comp_serial);
vue_add_component(vue_options, "comp_map", comp_map);
vue_add_component(vue_options, "comp_geocode", comp_geocode);
vue_add_component(vue_options, "comp_bits", comp_bits);
vue_add_component(vue_options, "comp_graph", comp_graph);

window.vue = new Vue( vue_options );
