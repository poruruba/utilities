'use strict';

//var vConsole = new VConsole();

new ClipboardJS('.clip_btn');

var encoder = new TextEncoder('utf-8');
var decoder = new TextDecoder('utf-8');

const QRCODE_CANCEL_TIMER = 20000;
const IMAGE_ICON_LIST = {
	android: [192, 144, 96, 72, 48, 36],
	iphone: [180, 167, 152, 120, 87, 80, 76, 60, 58, 40, 29, 20],
	windows: [48, 32, 16],
	alexa: [512, 108],
};
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
	{ id: 'date', name: '日時' },
	{ id: 'cardinal', name: '基数' },
	{ id: 'clip', name: 'クリップ' },
	{ id: 'arrange', name: '整形' },
    { id: 'gengou', name: '元号' },
    { id: 'blecent', name: 'BLECentral' },
	{ id: 'scraping', name: 'スクレイピング' },
	{ id: 'trend', name: 'トレンド' },
	{ id: 'notify', name: '通知' },
	{ id: 'qiita', name: 'Qiita' },
	{ id: 'help', name: 'ヘルプ' },
];

var vue_options = {
    el: "#top",
    data: {
        progress_title: '',

		tab_list: TAB_LIST,
        favorite_link: [],

        ble_device: null,
        ble_services: [],
        ble_isConnected: false,
        ble_additional_services: '',
        uuid_input: null,
        uuid_uuid: null,
        uuid_array: null,
        uuid_urn: null,
        image_rotate: 0,
        image_icon: 'android',
        image_icon_list: IMAGE_ICON_LIST,
        image_image: null,
        image_image_scaled: null,
        image_size: {},
        image_scale: 'crop',
        image_src: null,
        image_type: '',
        server_apikey: '',
        server_url: '',
        base64_input: '',
        base64_output: '',
        base64url_input: '',
        base64url_output: '',
        string_input: '',
        string_output: '',
        hmac_input: '',
        hmac_secret: '',
        hmac_output: '',
        aes_input: '',
        aes_iv: '',
        aes_secret: '',
        aes_output: '',
        url_input: '',
        url_output: '',
        html_input: '',
        html_output: '',
        json_inout: '',
        encode_html_space: true,
        js_inout: '',
        css_inout: '',
        html_inout: '',
        marked_inout: '',
        marked_html: null,
        marked_show_type: '',
        date_duration: 0,
        date_duration_unit: 'year',
        date_moment: moment(),
        date_moment_after: null,
        date_input_mode: '',
        date_input_free: null,
        date_input_date: null,
        date_input_time: null,
        qrcode_input: '',
        qrcode_btn: 'QRスキャン開始',
        qrcode_video: null,
        qrcode_canvas: null,
        qrcode_context: null,
        qrcode_scaned_data: '',
        qrcode_running: false,
        qrcode_timer: null,
        clip_data: [],
        notify_gmail_address: '',
        notify_gmail_message: '',
        notify_line_message: '',
        passwd_num: 12,
        passwd_check_lower_letter: true,
        passwd_check_upper_letter: true,
        passwd_check_number: true,
        passwd_check_ecept_lO: false,
        passwd_number_num: 1,
        passwd_check_symbol: false,
        passwd_symbol_pattern: "-+*/_",
        passwd_symbol_num: 1,
        passwd_password: '',
        scraping_keikyu_message: '',
        scraping_keikyu_received_date: '',
        qiita_item_list: [],
        qiita_items_received_date: '',
        base_decimal: 0,
        cardinal_decimal: 0,
        cardinal_binary: 0,
        cardinal_hexadecimal: 0,
        cardinal_hexadecimal_num: 2,
        cardinal_check_hexadecimal: false,
        cardinal_binary_num: 2,
        cardinal_check_binary: false,
        array_pattern: [],
        array_base: [],
        array_random_length: 1,
        gengou_era_name: '令和',
        gengou_era_other: '',
        gengou_era_year: 2,
        gengou_anno_year: 2020,
        gengou_list: gengou_list.reverse(),
        trend_items_received_date: null,
        trend_item_list: [],
        binary_output: '',
        binary_cr_num: 0,
        binary_space: false,
        binary_format: 'none',
        binary_type: '',
        binary_data: null,
        binary_input: '',
        binary_dataurl: '',
        binary_text: '',
        color_list: color_list,
        color_value: "#000000",
        color_r: 0,
        color_g: 0,
        color_b: 0,
        color_basic_list: color_basic_list,
        color_near: null
    },
    computed: {
        date_unix: function(){
            return this.date_moment.valueOf();
        },
        date_iso: function(){
            return moment(this.date_moment).utc().format();
        },
        date_iso2: function(){
            return this.date_moment.format();
        },
        date_locale: function(){
            var date = this.date_moment.toDate();
            return date.toLocaleString();
        },
        date_unix_after: function(){
            if( !this.date_moment_after )
                return null;
            return this.date_moment_after.valueOf();
        },
        date_iso_after: function(){
            if( !this.date_moment_after )
                return null;
            return moment(this.date_moment_after).utc().format();
        },
        date_iso2_after: function(){
            if( !this.date_moment_after )
                return null;
            return this.date_moment_after.format();
        },
        date_locale_after: function(){
            if( !this.date_moment_after )
                return null;
            var date = this.date_moment_after.toDate();
            return date.toLocaleString();
        },
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
			Cookies.set('favorite_link', JSON.stringify(this.favorite_link), { expires: 365 });
        },
        file_drag: function(e){
            e.stopPropagation();
            e.preventDefault();
        },

        /* BLE Central */
        ble_allnotify: async function(){
            for( var i = 0 ; i < this.ble_services.length ; i++ ){
                for( var j = 0 ; j < this.ble_services[i].characteristics.length ; j++ ){
                    var characteristic = this.ble_services[i].characteristics[j];
                    if( characteristic.characteristic.properties.notify ){
                        this.notify_enable(characteristic, true);
                    }
                }
            }
            this.toast_show("All startNotificationしました。");
        },
        ble_allread: async function(){
            for( var i = 0 ; i < this.ble_services.length ; i++ ){
                for( var j = 0 ; j < this.ble_services[i].characteristics.length ; j++ ){
                    var characteristic = this.ble_services[i].characteristics[j];
                    if( characteristic.characteristic.properties.read ){
                        try{
                            await characteristic.characteristic.readValue();
                            this.$set(characteristic, "value_changed", false);
                        }catch(error){
                            console.error(error);
                        }
                    }
                }
            }
            this.toast_show("All readValueしました。");
        },
        ble_disconnect: function(){
            if( this.ble_device != null && this.ble_device.gatt.connected ){
                this.ble_device.gatt.disconnect();
                this.ble_services = [];
                this.ble_isConnected = false;
            }
        },
        ble_connect: async function(){
            try{
                this.ble_disconnect();
                
                var additional_services;
                if( this.ble_additional_services.trim() ){
                    additional_services = this.ble_additional_services.split(/\r\n|\r|\n/);
                    for( var i = 0 ; i < additional_services.length ; i++ ){
                        if( additional_services[i].length == 4 )
                        additional_services[i] = parseInt(additional_services[i], 16);
                    }
                }else{
                    additional_services = [];
                }
                var optionalServices = additional_services.concat(Object.keys(serviceUuidList).map(x => parseInt(x)));

                console.log('Execute : requestDevice');
                var device = await navigator.bluetooth.requestDevice({
                    acceptAllDevices:true,
                    optionalServices: optionalServices
                });
            }catch(error){
                console.error(error);
                alert(error);
                return;
            }

            this.progress_open();
            try{
                console.log("requestDevice OK");
                this.ble_services = [];
                this.ble_device = device;
                this.ble_device.addEventListener('gattserverdisconnected', this.ble_onDisconnect.bind(this.ble_onDisconnect) );
                var server = await this.ble_device.gatt.connect()
                console.log('Execute : getPrimaryServices');
                var services = await server.getPrimaryServices();
                console.log(services);
                services.map(async service => this.ble_setService(service));
                this.ble_isConnected = true;
                this.toast_show("接続しました。");
            }catch(error){
                console.error(error);
                alert(error);
            }finally{
                this.progress_close();
            }
        },
        async ble_onDisconnect(event){
            console.log('onDisconnect');
            this.ble_isConnected = false;
            this.ble_services = [];
        },
        async ble_onDataChanged(event){
            console.log('ble_onDataChanged');
            console.log(event);
            var characteristic = this.find_characteristic(event.target.service.uuid, event.target.uuid);
            try{
                this.$set(characteristic, "value_hex", this.dataview2hex(characteristic.characteristic.value));
                this.$set(characteristic, "value_changed", true);
            }catch(error){
                console.log(error);
            }
        },
        find_characteristic(service_uuid, characteristic_uuid){
            var service = this.ble_services.find(item => item.uuid == service_uuid);
            if( !service )
                return null;
            return service.characteristics.find(item => item.uuid == characteristic_uuid);
        },
        async ble_setService(service){
            var item = {
                uuid: service.uuid,
                service: service,
                characteristics: []
            };
            try{
                console.log('Execute : getCharacteristics');
                var characteristics = await service.getCharacteristics();
                characteristics.map(async characteristic => this.ble_setCharacteristic(item.characteristics, characteristic))
            }catch(error){
//                console.error(error);
            }
            this.ble_services.push(item);
        },
        async ble_setCharacteristic(characteristics, characteristic) {
            var item = {
                uuid: characteristic.uuid,
                characteristic: characteristic,
            };
            item.properties = "properties:";
            if( characteristic.properties.broadacast )
                item.properties += " broadcast";
            if( characteristic.properties.read )
                item.properties += " read";
            if( characteristic.properties.writeWithoutResponse )
                item.properties += " writeWithoutResponse";
            if( characteristic.properties.write )
                item.properties += " write";
            if( characteristic.properties.notify )
                item.properties += " notify";
            if( characteristic.properties.indicate )
                item.properties += " indicate";
            if( characteristic.properties.authenticatedSignedWrites )
                item.properties += " authenticatedSignedWrites";
            characteristic.addEventListener('characteristicvaluechanged', this.ble_onDataChanged.bind(this.ble_onDataChanged) );
            characteristics.push(item);
        },
        dataview2hex: function(data){
            return new Uint8Array(data.buffer).reduce((hex, val) =>{
                var t = val.toString(16);
                return hex += ('00' + t).slice(-2);
            }, "").toUpperCase();
        },
        hex2array: function(hex){
            var array = new Uint8Array(hex.length / 2);
            for( var i = 0 ; i < hex.length ; i += 2)
                array[i / 2] = parseInt(hex.slice(i, i + 2), 16);
            return array;
        },
        async value_read(characteristic){
            try{
                await characteristic.characteristic.readValue();
                this.$set(characteristic, "value_changed", false);
            }catch(error){
                console.error(error);
            }
        },
        async value_write(characteristic){
            try{
                var array = this.hex2array(characteristic.value_hex);
                if( characteristic.characteristic.properties.writeWithoutResponse )
                    await characteristic.characteristic.writeValueWithoutResponse(array);
                else
                    await characteristic.characteristic.writeValueWithResponse(array);
            }catch(error){
                console.error(error);
            }
        },
        async notify_enable(characteristic, forceEnable = false){
            if( characteristic.notify_enabled && !forceEnable ){
                characteristic.characteristic.stopNotifications();
                this.$set(characteristic, "notify_enabled", false);
            }else{
                characteristic.characteristic.startNotifications();
                this.$set(characteristic, "notify_enabled", true);
            }
        },
        uuid128touuid16(uuid128){
            if( uuid128.substr(0, 4) == '0000' && uuid128.substr(8, 28) == "-0000-1000-8000-00805f9b34fb" )
                return parseInt(uuid128.substr(0, 8), 16);
            else
                return -1;
        },
        find_service_name: function(uuid){
            var uuid16 = this.uuid128touuid16(uuid);
            if( uuid16 < 0 )
                return uuid;
            var name = serviceUuidList[uuid16];
            if( !name )
                return ('0000' + uuid16.toString(16)).slice(-4).toUpperCase();
            return name;
        },
        find_characteristic_name: function(uuid){
            var uuid16 = this.uuid128touuid16(uuid);
            if( uuid16 < 0 )
                return null;
            var name = characteristicUuidList[uuid16];
            if( !name )
                return ('0000' + uuid16.toString(16)).slice(-4).toUpperCase();
            return name;
        },
        
        /* UUID */
        uuid_parse: function(){
            var uuid = UUID.parse(this.uuid_input);
            if( !uuid ){
                if( this.uuid_input.indexOf('-') < 0 ){
                    var t = this.uuid_input.slice(0, 8) + '-' + this.uuid_input.slice(8, 12) + '-' + this.uuid_input.slice(12, 16) + '-' + this.uuid_input.slice(16, 20) + '-' + this.uuid_input.slice(20, 32);
                    uuid = UUID.parse(t);
                }
                if( !uuid ){
                    alert('入力が不正です。');
                    return;
                }
            }
            this.uuid_uuid = uuid;
            this.uuid_array = uuid.hexNoDelim;
        },
        uuid_generate: function(){
            var uuid = UUID.genV4();
            this.uuid_input = uuid;
            this.uuid_uuid = uuid;
            this.uuid_array = uuid.hexNoDelim;
        },
        /* 画像ファイル */
        image_open: function(e){
            this.image_open_file(e.target.files[0]);
        },
        image_drop: function(e){
            e.stopPropagation();
            e.preventDefault();

            $('#image_file')[0].files = e.dataTransfer.files;
            this.image_open_file(e.dataTransfer.files[0]);
        },
        image_open_file: function(file){
            if( !file.type.startsWith('image/') ){
                alert('画像ファイルではありません。');
                return;
            }

            var reader = new FileReader();
            reader.onload = (theFile) =>{
                this.image_type = file.type;
                this.image_src = reader.result;
                this.image_image = new Image();
                this.image_image.onload = () =>{
                    this.image_size = { width: this.image_image.width, height: this.image_image.height };
                    this.image_scale_change();
                };
                this.image_image.src = this.image_src;
            };
            reader.readAsDataURL(file);
        },
        image_scale_change: function(){
            if(!this.image_src)
                return;

            var image = this.image_image;
            var size, sx, sy, sw, sh, dx, dy, dw, dh;

            if( this.image_scale == 'cover'){
                size = (image.width > image.height) ? image.width : image.height;
                sx = sy = 0;
                sw = image.width;
                sh = image.height;
                dx = dy = 0;
                dw = dh = size;
            }else
            if( this.image_scale == 'contain'){
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
            }else
            if( this.image_scale == 'crop'){
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

            var canvas2 = $('#image_icon')[0];
            canvas2.width = canvas.width;
            canvas2.height = canvas.height;
            var context2 = canvas2.getContext('2d');
            context2.drawImage(canvas, 0, 0);
        },
        image_save: async function(){
            if(!this.image_src)
                return;

            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            var zip = new JSZip();
            var list = this.image_icon_list[this.image_icon];
            for( var i = 0 ; i < list.length ; i++ ){
                canvas.width = list[i];
                canvas.height = list[i];
                context.drawImage(this.image_image_scaled, 0, 0, this.image_image_scaled.width, this.image_image_scaled.height, 0, 0, canvas.width, canvas.height);

                var data_url = canvas.toDataURL('image/png');
                var byteStr = atob( data_url.split( "," )[1] ) ;
                var content = new Uint8Array(byteStr.length);
                for( var j = 0; j < byteStr.length; j++ )
                    content[j] = byteStr.charCodeAt( j ) ;
                var blob = new Blob( [ content ], {
                    type: this.image_type,
                });

                var fname = list[i] + "x" + list[i] + '.png';
                zip.file(fname, blob);
            }

            var zip_blob = await zip.generateAsync({type: "blob"})
            var url = window.URL.createObjectURL(zip_blob);

            var a = document.createElement("a");
            a.href = url;
            a.target = '_blank';
            a.download = "icon_list.zip";
            a.click();
            window.URL.revokeObjectURL(url);
        },
        image_click: function(e){
            this.image_type = '';
            this.image_src = null;

            e.target.value = '';
        },

        /* QRコード */
        qrcode_create: function(){
            $('#qrcode_area').empty();
            new QRCode($("#qrcode_area")[0], this.qrcode_input);
        },
        qrcode_scan: function(){
            this.qrcode_video = $('#qrcode_camera')[0];
            this.qrcode_canvas = $('#qrcode_canvas')[0];

            if( this.qrcode_running ){
                this.qrcode_forcestop();
                return;
            }

            this.qrcode_running = true;
            this.qrcode_btn = 'QRスキャン停止';

            this.qrcode_timer = setTimeout(() =>{
                this.qrcode_forcestop();
            }, QRCODE_CANCEL_TIMER);

            return navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
            .then(stream =>{
                this.qrcode_scaned_data = "";
                this.qrcode_video.srcObject = stream;
                this.qrcode_draw();
            })
            .catch(error =>{
                alert(error);
            });
        },
        qrcode_draw: function(){
//            console.log(this.qrcode_video.videoWidth, this.qrcode_video.videoHeight);
            if( this.qrcode_context == null ){
                if( this.qrcode_video.videoWidth == 0 || this.qrcode_video.videoHeight == 0 ){
                    if( this.qrcode_running )
                        requestAnimationFrame(this.qrcode_draw);
                    return;
                }
                this.qrcode_canvas.width = this.qrcode_video.videoWidth;
                this.qrcode_canvas.height = this.qrcode_video.videoHeight;
                this.qrcode_context = this.qrcode_canvas.getContext('2d');
            }
            this.qrcode_context.drawImage(this.qrcode_video, 0, 0, this.qrcode_canvas.width, this.qrcode_canvas.height);
            const imageData = this.qrcode_context.getImageData(0, 0, this.qrcode_canvas.width, this.qrcode_canvas.height);

            const code = jsQR(imageData.data, this.qrcode_canvas.width, this.qrcode_canvas.height);
            if( code && code.data != "" ){
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
            }else{
                if( this.qrcode_running )
                    requestAnimationFrame(this.qrcode_draw);
            }
        },
        qrcode_forcestop: function(){
            if( !this.qrcode_running )
                return;

            this.qrcode_running = false;

            if( this.qrcode_timer != null ){
                clearTimeout(this.qrcode_timer);
                this.qrcode_timer = null;
            }

            this.qrcode_video.pause();
            this.qrcode_video.srcObject = null;
            this.qrcode_btn = 'QRスキャン開始';
        },

        /* 文字列 */
        string_encode: function(encode){
            try{
                if( encode )
                    this.string_output = byteAry2hexStr(encoder.encode(this.string_input));
                else
                    this.string_output = decoder.decode(new Uint8Array(hexStr2byteAry(this.string_input)));
            }catch( error ){
                alert(error);
            }
        },

        /* 暗号化 */
        crypto_hmac: function(){
            try{
                this.hmac_output = byteAry2hexStr(makeHmacSha256(this.chmac_input, this.hmac_secret));
            }catch( error ){
                alert(error);
            }
        },
        crypto_aes: function(encrypt){
            try{
                var input = CryptoJS.enc.Hex.parse(this.aes_input);
                var iv = CryptoJS.enc.Hex.parse(this.aes_iv);
                var key = CryptoJS.enc.Hex.parse(this.aes_secret);
                if( encrypt ){
                    var encrypted = CryptoJS.AES.encrypt(input, key, { iv: iv, padding: CryptoJS.pad.NoPadding });
                    this.aes_output = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
                }else{
                    var decrypted = CryptoJS.AES.decrypt(CryptoJS.lib.CipherParams.create({ ciphertext: input }), key, { iv: iv, padding: CryptoJS.pad.NoPadding });
                    this.aes_output = decrypted.toString(CryptoJS.enc.Hex);
                }
            }catch( error ){
                alert(error);
            }
        },

        /* エンコード */
        base64_encode: function(encode, bin){
            try{
                if( !bin ){
                    if( encode )
                        this.base64_output = btoa(this.base64_input);
                    else
                        this.base64_output = atob(this.base64_input);
                }else{
                    if( encode )
                        this.base64_output = bufferToBase64(hexStr2byteAry(this.base64_input));
                    else
                        this.base64_output = byteAry2hexStr(base64ToBuffer(this.base64_input));
                }
            }catch( error ){
                alert(error);
            }
        },
        base64url_encode: function(encode){
            try{
                if( encode )
                    this.base64url_output = base64url.encode(hexStr2byteAry(this.base64url_input));
                else
                    this.base64url_output = byteAry2hexStr(base64url.decode(this.base64url_input));
            }catch( error ){
                alert(error);
            }
        },
        url_encode: function(encode){
            try{
                if( encode )
                    this.url_output = encodeURIComponent(this.url_input);
                else
                    this.url_output = decodeURIComponent(this.url_input);
            }catch( error ){
                alert(error);
            }
        },
        html_encode: function(space){
            const html_entities = {
                '\"': '&quot;',
                '&': '&amp;',
                '\'': '&apos;',
                '<': '&lt;',
                '>': '&gt;',
                ' ': space ? '&nbsp;' : undefined,
            };

            this.html_output = this.html_input.split('').map((entity) => {
                return html_entities[entity] || entity;
            }).join('');
        },

        /* カラー */
        color_change: function(){
            this.color_r = this.rgb2num(this.color_value, "r");
            this.color_g = this.rgb2num(this.color_value, "g");
            this.color_b = this.rgb2num(this.color_value, "b");
        },
        color_select: function(rgb){
            this.color_value = rgb.toLowerCase();
            this.color_change();
        },
        color_range: function(){
            var rgb = [this.color_r, this.color_g, this.color_b];
            this.color_select('#' + byteAry2hexStr(rgb) );
        },
        color_do_near: function(){
            var min_delta = 200.0;
            var min_target = null;
            for( var i = 0 ; i < color_list.length ; i++ ){
                var delta = chroma.deltaE(this.color_value, color_list[i].rgb);
                if( delta < min_delta ){
                    min_delta = delta;
                    min_target = color_list[i];
                }
            }

            this.color_near = min_target;
        },

        /* パスワード */
        passwd_create: function(){
            var passwd_num = this.passwd_num;
            var passwd_number_num = this.passwd_check_number ? this.passwd_number_num : 0;
            var passwd_symbol_num = this.passwd_check_symbol ? this.passwd_symbol_num : 0;
            if( passwd_num < 1 || passwd_num < (passwd_number_num + passwd_symbol_num) ){
                alert('入力が不正です。');
                return;
            }
            if( (!this.passwd_check_lower_letter && !this.passwd_check_upper_letter) && passwd_num != (passwd_number_num + passwd_symbol_num)){
                alert('入力が不正です。');
                return;
            }

            var kind = Array(passwd_num);
            kind.fill(0);
            for( var i = 0 ; i < passwd_number_num ; i++ )
                kind[i] = 'n';
            for( var i = 0 ; i < passwd_symbol_num ; i++ )
                kind[passwd_number_num + i] = 's';

            for( var i = 0 ; i < passwd_num ; i++ ){
                var index = make_random(passwd_num - 1);
                if( index == i || kind[i] == kind[index] )
                    continue;
                var temp = kind[i];
                kind[i] = kind[index];
                kind[index] = temp;
            }

            const number_pattern = '0123456789';
            var alpha_pattern = '';
            if( this.passwd_check_lower_letter ){
                if( this.passwd_check_ecept_lO )
                    alpha_pattern += "abcdefghijkmnopqrstuvwxyz";
                else
                    alpha_pattern += "abcdefghijklmnopqrstuvwxyz";
            }
            if( this.passwd_check_upper_letter ){
                if( this.passwd_check_ecept_lO )
                    alpha_pattern += "ABCDEFGHJKLMNPQRSTUVWXYZ";
                else
                    alpha_pattern += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            }

            var passwd = '';
            for( var i = 0 ; i < kind.length ; i++ ){
                if( kind[i] == 'n' ){
                    var index = make_random(number_pattern.length - 1);
                    passwd += number_pattern.charAt(index);
                }else if( kind[i] == 's' ){
                    var pattern = this.passwd_symbol_pattern;
                    var index = make_random(pattern.length - 1);
                    passwd += pattern.charAt(index);
                }else{
                    var index = make_random(alpha_pattern.length - 1);
                    passwd += alpha_pattern.charAt(index);
                }
            }

            this.passwd_password = passwd;
        },

        /* バイト配列 */
        array_set: function(ptn){
            if( ptn == 0 ){
                this.array_base = hexStr2byteAry(this.array_pattern[0]);
            }else if( ptn == 1 ){
                this.array_base = hexStr2byteAry(this.array_pattern[1], ' ');
            }else if( ptn == 2 ){
                this.array_base = hexStr2byteAry(this.array_pattern[2], ',');
            }else if( ptn == 3 ){
                this.array_base = hexStr2byteAry_2(this.array_pattern[3], ',');
            }else if( ptn == 4 ){
                this.array_base = hexStr2byteAry_3(this.array_pattern[4], ',');
            }

            this.array_pattern[0] = byteAry2hexStr(this.array_base, '');
            this.array_pattern[1] = byteAry2hexStr(this.array_base, ' ');
            this.array_pattern[2] = byteAry2hexStr(this.array_base, ', ', '0x');
            this.array_pattern[3] = byteAry2hexStr(this.array_base, ', ', '(byte)0x');
            this.array_pattern[4] = this.array_base.join(', ');
        },
        array_random_generate: function(){
            var array = [];
            for( var i = 0 ; i < this.array_random_length ; i++ )
                array.push(make_random(255));
            this.array_base = array;
            this.array_set(-1);
        },

        /* バイナリファイル */
        binary_save: function(){
            var target = this.binary_input.replace(/\r?\n|\s/g, '');
			var array = hexStr2byteAry(target);
            var buffer = new ArrayBuffer(array.length);
			var dv = new DataView(buffer);
			for( var i = 0 ; i < array.length ; i++ )
				dv.setUint8(i, array[i]);

			var blob = new Blob([buffer], {type: "octet/stream"});
			var url = window.URL.createObjectURL(blob);

			var a = document.createElement("a");
			a.href = url;
			a.target = '_blank';
			a.download = "array.bin";
			a.click();
			window.URL.revokeObjectURL(url);
        },
        binary_open: function(e){
            var file = e.target.files[0];
            this.binary_open_file(file);
        },
        binary_click: function(e){
            this.binary_type = '';
            this.binary_output = '';
            this.binary_data = null;
            this.binary_input = '';
            this.binary_dataurl = '';
            this.binary_text = '';

            e.target.value = '';
        },
        binary_copy: function(){
            if( this.binary_data != null )
                this.binary_input = byteAry2hexStr(this.binary_data);
        },
        binary_change: function(){
            if( this.binary_data != null ){
                if( this.binary_format == 'none' ){
                    this.binary_output = byteAry2hexStr(this.binary_data);
                }else if(this.binary_format == 'cr'){
                    this.binary_cr();
                }else if( this.binary_format == 'dataurl'){
                    this.binary_output = this.binary_dataurl;
                }
            }
        },
        binary_cr: function(){
            var num_of_interval = this.binary_cr_num;
            if( num_of_interval == 0 ){
                if( this.binary_space )
                    this.binary_output = byteAry2hexStr(this.binary_data, ' ');
                else
                    this.binary_output = byteAry2hexStr(this.binary_data);
            }else{
                var str = '';
                for( var i = 0 ; i < this.binary_data.length ; i += num_of_interval ){
                    if( this.binary_space )
                        str += byteAry2hexStr(this.binary_data.slice( i, i + num_of_interval ), ' ') + '\n';
                    else
                        str += byteAry2hexStr(this.binary_data.slice( i, i + num_of_interval )) + '\n';
                }
                this.binary_output = str;
            }
        },
        binary_drop: function(e){
            e.stopPropagation();
            e.preventDefault();

            $('#binary_file')[0].files = e.dataTransfer.files;
            this.binary_open_file(e.dataTransfer.files[0]);
        },
        binary_open_file: function(file){
            var reader = new FileReader();
            reader.onload = (theFile) =>{
                this.binary_data = new Uint8Array(reader.result);
                this.binary_type = file.type || 'application/octet-stream';
                if( this.binary_type.startsWith('text/'))
                    this.binary_text = decoder.decode(this.binary_data);
                this.binary_dataurl = "data:" + this.binary_type + ";base64," + bufferToBase64(this.binary_data);

                this.binary_change();
            };
            reader.readAsArrayBuffer(file);
        },

        /* 日時 */
        date_get_now: function(target){
            if( target == 'base')
                this.date_moment = moment();
            else
                this.date_moment_after = moment();
        },
        date_input_dialog: function(target){
            this.date_input_mode = target;
            var temp;
            if( target == 'base')
                temp = moment(this.date_moment);
            else
                temp = moment(this.date_moment_after);
            this.date_input_date = temp.format('YYYY-MM-DD');
            this.date_input_time = temp.format('HH:mm:ss');
            this.dialog_open('#date_input_dialog');
        },
        date_duration_reset: function(){
            this.date_duration = 0;
            this.date_process();
        },
        date_process: function(){
            var temp = moment(this.date_moment);
            if( this.date_duration_unit == 'year' )
                temp.add(this.date_duration, 'years');
            else if( this.date_duration_unit == 'month' )
                temp.add(this.date_duration, 'months');
            else if( this.date_duration_unit == 'day' )
                temp.add(this.date_duration, 'days');
            else if( this.date_duration_unit == 'hour' )
                temp.add(this.date_duration, 'hours');
            else if( this.date_duration_unit == 'minute' )
                temp.add(this.date_duration, 'minutes');
            else if( this.date_duration_unit == 'second' )
                temp.add(this.date_duration, 'seconds');
            this.date_moment_after = temp;
        },
        date_input_process: function(target){
            var date;
            if( target == 'free'){
                if( !this.date_input_free ){
                    alert('入力値が不正です。');
                    return;
                }
                date = this.date_input_free;
            }else{
                if( !this.date_input_date || !this.date_input_time ){
                    alert('入力値が不正です。');
                    return;
                }
                date = this.date_input_date + ' ' + this.date_input_time;
            }

            if( this.date_input_mode == 'base'){
                if( !isNaN(date) )
                    this.date_moment = moment(Number(date));
                else
                    this.date_moment = moment(date);
            }else{
                if( !isNaN(date) )
                    this.date_moment_after = moment(Number(date));
                else
                    this.date_moment_after = moment(date);
            }
            this.dialog_close('#date_input_dialog');
        },
        date_elapsed_process: function(){
            var base = moment(this.date_moment);
            var after = moment(this.date_moment_after);
            if( this.date_duration_unit == 'year' )
                this.date_duration = after.diff(base, 'years');
            else if(this.date_duration_unit == 'month')
                this.date_duration = after.diff(base, 'months');
            else if(this.date_duration_unit == 'day')
                this.date_duration = after.diff(base, 'days');
            else if(this.date_duration_unit == 'hour')
                this.date_duration = after.diff(base, 'hours');
            else if(this.date_duration_unit == 'minute')
                this.date_duration = after.diff(base, 'minutes');
            else if(this.date_duration_unit == 'second')
                this.date_duration = after.diff(base, 'seconds');
        },

        /* 基数 */
        cardinal_convart: function(radix){
            var base = 0;
            if( radix == 10){
                base = parseInt(this.cardinal_decimal, 10);
            }else if( radix == 2){
                base = parseInt(this.cardinal_binary, 2);
            }else if( radix == 16){
                base = parseInt(this.cardinal_hexadecimal, 16);
            }
            this.base_decimal = Math.floor(base);

            this.cardinal_update();
        },
        cardinal_shift(radix, shift){
            if( shift == 'right' )
                this.base_decimal = Math.floor(this.base_decimal / radix);
            else
                this.base_decimal = Math.floor(this.base_decimal * radix);

            this.cardinal_update();
        },
        cardinal_update: function(){
            this.cardinal_decimal = this.base_decimal;
            
            var temp = this.base_decimal.toString(2);
            if( this.cardinal_check_binary ){
                for( var i = temp.length ; i < this.cardinal_binary_num; i++ )
                    temp = '0' + temp;
            }
            this.cardinal_binary = temp;
            var temp = this.base_decimal.toString(16);
            if( this.cardinal_check_hexadecimal ){
                for( var i = temp.length ; i < this.cardinal_hexadecimal_num; i++ )
                    temp = '0' + temp;
            }
            this.cardinal_hexadecimal = temp;
        },

        /* クリップ */
        clip_save: function(index){
            Cookies.set('clip_data' + index, this.clip_data[index], { expires: 365 });
        },
        clip_clearall: function(){
            for( var i = 0 ; i <= 6 ; i++ )
                this.clip_clear(i);
            this.clip_data = JSON.parse(JSON.stringify(this.clip_data));
        },
        clip_clear: function(index){
            this.clip_data[index] = '';
            Cookies.remove('clip_data' + index);
            this.clip_data = JSON.parse(JSON.stringify(this.clip_data));
        },

        /* 元号 */
        gengou_search_era: function(era){
            for( var i = 0 ; i < this.gengou_list.length ; i++ ){
                if( this.gengou_list[i].name == era )
                    return this.gengou_list[i];
            }

            return null;
        },
        gengou_search_anno: function(anno){
            for( var i = 0 ; i < this.gengou_list.length ; i++ ){
                if( this.gengou_list[i].start <= anno && (this.gengou_list[i].end ? anno <= this.gengou_list[i].end : true ))
                    return this.gengou_list[i];
            }

            return null;
        },
        gengou_to_anno: function(){
            var era_name = (this.gengou_era_name == 'その他') ? this.gengou_era_other : this.gengou_era_name;
            var gengou = this.gengou_search_era(era_name);
            if( !gengou ){
                alert('入力が不正です。');
                return;
            }
        
            var year = this.gengou_era_year;
            if( year <= 0 ){
                alert('入力が不正です。');
                return;
            }

            var anno_year = gengou.start + year - 1;
            if( gengou.end && anno_year > gengou.end ){
                alert('入力が不正です。');
                return;
            }
            this.gengou_anno_year = anno_year;
        },
        gengou_to_era: function(){
            var year = this.gengou_anno_year;
            var gengou = this.gengou_search_anno(year);
            if( !gengou ){
                alert('入力が不正です。');
                return;
            }

            if( gengou.name == '令和' || gengou.name == '平成' || gengou.name == '昭和' || gengou.name == '大正' || gengou.name == '明治' ){
                this.gengou_era_name = gengou.name;
            }else{
                this.gengou_era_name = 'その他';
                this.gengou_era_other = gengou.name;
            }

            this.gengou_era_year = year - gengou.start + 1;
        },
        
        /* スクレイピング */
        scraping_keikyu: function(){
            var body = {
                apikey: this.server_apikey
            };
            do_post(this.server_url + '/scraping-keikyu', body)
            .then(json =>{
                if( json.result != 'OK'){
                    alert('失敗しました。');
                    return;
                }
                Cookies.set('server_apikey', this.server_apikey, { expires: 365 });
                Cookies.set('server_url', this.server_url, { expires: 365 });
                this.scraping_keikyu_message = json.message;
                this.scraping_keikyu_received_date = new Date().toLocaleString();
            })
            .catch(error =>{
                alert(error);
            });
        },

        /* 整形 */
        arrange_process: function(type){
            try{
                if( type == 'json' )
                    this.json_inout = JSON.stringify(JSON.parse(this.json_inout), null, '\t');
                else if( type == 'javascript')
                    this.js_inout = js_beautify(this.js_inout, { indent_size: 2, space_in_empty_paren: true });
                else if( type == 'css')
                    this.css_inout = css_beautify(this.css_inout, { indent_size: 2, space_in_empty_paren: true });
                else if( type == 'html')
                   this.html_inout = html_beautify(this.html_inout, { indent_size: 2, space_in_empty_paren: true });
            }catch( error ){
                alert(error);
            }
        },
        arrange_convert: function(type){
            try{
                if( type == 'marked_view'){
                    this.marked_show_type = type;
                    document.getElementById('marked_content').innerHTML = marked(this.marked_inout);
                    this.dialog_open('#marked_dialog');
                }else
                if( type == 'marked_html' ){
                    this.marked_show_type = type;
                    this.marked_html = marked(this.marked_inout);;
                    this.dialog_open('#marked_dialog');
                }
            }catch( error ){
                alert(error);
            }
        },
        /* トレンド */
        trend_get: function(){
            var body = {
                apikey: this.server_apikey
            };
            do_post(this.server_url + '/trendword', body)
            .then(json =>{
                if( json.result != 'OK'){
                    alert('失敗しました。');
                    return;
                }

                this.trend_item_list = json.trends;
                this.trend_items_received_date = new Date().toLocaleString();
                Cookies.set('server_apikey', this.server_apikey, { expires: 365 });
                Cookies.set('server_url', this.server_url, { expires: 365 });
            })
            .catch(error =>{
                alert(error);
            });
        },

        /* 通知 */
        notify_gmail: function(){
            var body = {
                mail_address : this.notify_gmail_address,
                message: this.notify_gmail_message,
                apikey: this.server_apikey
            };

            do_post(this.server_url + '/notify-gmail', body)
            .then(json =>{
                if( json.result != 'OK'){
                    alert('失敗しました。');
                    return;
                }
                Cookies.set('server_apikey', this.server_apikey, { expires: 365 });
                Cookies.set('server_url', this.server_url, { expires: 365 });
                Cookies.set('notify_gmail_address', this.notify_gmail_address, { expires: 365 });
                alert('送信しました。');
            })
            .catch(error =>{
                alert(error);
            });
        },
        notify_line: function(){
            var body = {
                message: this.notify_line_message,
                apikey: this.server_apikey
            };

            do_post(this.server_url + '/notify-line', body)
            .then(json =>{
                if( json.result != 'OK'){
                    alert('失敗しました。');
                    return;
                }
                Cookies.set('server_apikey', this.server_apikey, { expires: 365 });
                Cookies.set('server_url', this.server_url, { expires: 365 });
                alert('送信しました。');
            })
            .catch(error =>{
                alert(error);
            });
        },

        /* Qiita */
        qiita_items: function(){
            var body = {
                apikey: this.server_apikey
            };

            this.progress_open();
            do_post(this.server_url + '/qiita-items', body)
            .then(json =>{
                this.progress_close();
                if( json.result != 'OK'){
                    alert('失敗しました。');
                    return;
                }
                this.qiita_item_list = json.items;
                this.qiita_items_received_date = new Date().toLocaleString();
                Cookies.set('server_apikey', this.server_apikey, { expires: 365 });
                Cookies.set('server_url', this.server_url, { expires: 365 });
            })
            .catch(error =>{
                this.progress_close();
                alert(error);
            });
        },
        rgb2num: function(rgb, sel){
            if( sel == 'r' )
                return parseInt(rgb.slice(1, 3), 16);
            else if( sel == 'g' )
                return parseInt(rgb.slice(3, 5), 16);
            else if( sel == 'b' )
                return parseInt(rgb.slice(5, 7), 16);
        },
    },
    created: function(){
    },
    mounted: function(){
        proc_load();
        history.replaceState(null, null, location.pathname);

		var link = Cookies.get('favorite_link');
		if( !link )
			this.favorite_link = [];
		else
			this.favorite_link = JSON.parse(link);
		
        this.date_process();
        for( var i = 0 ; i <= 6 ; i++ ){
            this.clip_data[i] = Cookies.get('clip_data' + i);
        }
        this.server_apikey = Cookies.get('server_apikey');
        this.server_url = Cookies.get('server_url');
        this.notify_gmail_address = Cookies.get('notify_gmail_address');
        
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').then(async (registration) => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }).catch((err) => {
                console.log('ServiceWorker registration failed: ', err);
            });
        }
    }
};
vue_add_methods(vue_options, methods_bootstrap);
vue_add_components(vue_options, components_bootstrap);
var vue = new Vue( vue_options );

function do_post(url, body){
    const headers = new Headers( { "Content-Type" : "application/json; charset=utf-8" } );
    
    return fetch(url, {
        method : 'POST',
        body : JSON.stringify(body),
        headers: headers
    })
    .then((response) => {
        if( !response.ok )
            throw 'status is not 200';
        return response.json();
    });
}

function make_random(max){
	return Math.floor(Math.random() * (max + 1));
}

function hexStr2byteAry(hexs, sep = '') {
    hexs = hexs.trim(hexs);
    if( sep == '' ){
        var array = [];
        for( var i = 0 ; i < hexs.length / 2 ; i++)
            array[i] = parseInt(hexs.substr(i * 2, 2), 16);
        return array;
    }else{
        return hexs.split(sep).map((h) => {
            return parseInt(h, 16);
        });
    }
}

function hexStr2byteAry_2(hexs, sep = '') {
    hexs = hexs.trim(hexs);
    hexs = hexs.replace(/\( ?byte ?\)/g, "");
    if( sep == '' ){
        var array = [];
        for( var i = 0 ; i < hexs.length / 2 ; i++)
            array[i] = parseInt(hexs.substr(i * 2, 2), 16);
        return array;
    }else{
        return hexs.split(sep).map((h) => {
            return parseInt(h, 16);
        });
    }
}

function hexStr2byteAry_3(hexs, sep = '') {
    hexs = hexs.trim(hexs);
    return hexs.split(sep).map((h) => {
        return parseInt(h);
    });
}

function byteAry2hexStr(bytes, sep = '', pref = '') {
    if( bytes instanceof ArrayBuffer )
        bytes = new Uint8Array(bytes);
    if( bytes instanceof Uint8Array )
        bytes = Array.from(bytes);

    return bytes.map((b) => {
        var s = b.toString(16);
        return pref + (b < 0x10 ? '0'+s : s);
    })
    .join(sep);
}

function uint8array_to_wordarray(ba) {
	var wa = [];
	for (var i = 0; i < ba.length; i++) {
		wa[(i / 4) | 0] |= ba[i] << (24 - 8 * i);
	}

	return CryptoJS.lib.WordArray.create(wa, ba.length);
}

function wordToByteArray(word, length) {
	var ba = [];
	if (length > 0)
		ba.push(word >>> 24);
	if (length > 1)
		ba.push((word >>> 16) & 0xFF);
	if (length > 2)
		ba.push((word >>> 8) & 0xFF);
	if (length > 3)
		ba.push(word & 0xFF);

	return ba;
}

function wordarray_to_uint8array(wordArray, length) {
	if (wordArray.hasOwnProperty("sigBytes") && wordArray.hasOwnProperty("words")) {
		length = wordArray.sigBytes;
		wordArray = wordArray.words;
	}

	var result = [], i = 0;
	while (length > 0) {
		var bytes = wordToByteArray(wordArray[i], Math.min(4, length));
		length -= bytes.length;
		result.push(bytes);
		i++;
    }
    
	return Uint8Array.from([].concat.apply([], result));
}

function bufferToBase64(buf) {
    if( buf instanceof ArrayBuffer )
        buf = new Uint8Array(buf);
    if( buf instanceof Uint8Array )
        buf = Array.from(buf);

    var binstr = buf.map(b => String.fromCharCode(b)).join("");
    return btoa(binstr);
}

function base64ToBuffer(b64) {
    var binstr = atob(b64);
    var buf = new Uint8Array(binstr.length);
    Array.from(binstr).forEach((ch, i) => buf[i] = ch.charCodeAt(0));
    return buf;
}

function makeHmacSha256(input, secret){
    var hash = CryptoJS.HmacSHA256(input, secret);
    return wordarray_to_uint8array(hash);
}

const serviceUuidList = {
    0x1800: "Generic Access",
    0x1801: "Generic Attribute",
    0x1802: "Immediate Alert",
    0x1803: "Link Loss",
    0x1804: "Tx Power",
    0x1805: "Current Time Service",
    0x1806: "Reference Time Update Service",
    0x1807: "Next DST Change Service",
    0x1808: "Glucose",
    0x1809: "Health Thermometer",
    0x180A: "Device Information",
    0x180B: "Network Availability Service",
    0x180D: "Heart Rate",
    0x180E: "Phone Alert Status Service",
    0x180F: "Battery Service",
    0x1810: "Blood Pressure",
    0x1811: "Alert Notification Service",
    0x1812: "Human Interface Device",
    0x1813: "Scan Parameters",
    0x1814: "Running Speed and Cadence",
    0x1815: "Automation IO",
    0x1816: "Cycling Speed and Cadence",
    0x1818: "Cycling Power",
    0x1819: "Location and Navigation",
    0x181A: "Environmental Sensing",
    0x181B: "Body Composition",
    0x181C: "User Data",
    0x181D: "Weight Scale",
    0x181E: "Bond Management Service",
    0x181F: "Continuous Glucose Monitoring",
    0x1820: "Internet Protocol Support Service",
    0x1821: "Indoor Positioning",
    0x1822: "Pulse Oximeter Service",
    0x1823: "HTTP Proxy",
    0x1824: "Transport Discovery",
    0x1825: "Object Transfer Service",
    0x1826: "Fitness Machine",
    0x1827: "Mesh Provisioning Service",
    0x1828: "Mesh Proxy Service",
    0x1829: "Reconnection Configuration",
};

const characteristicUuidList = {
    0x2A00: "Device Name",
    0x2A01: "Appearance",
    0x2A02: "Peripheral Privacy Flag",
    0x2A03: "Reconnection Address",
    0x2A04: "Peripheral Preferred Connection Parameters",
    0x2A05: "Service Changed",
    0x2A06: "Alert Level",
    0x2A07: "Tx Power Level",
    0x2A08: "Date Time",
    0x2A09: "Day of Week",
    0x2A0A: "Day Date Time",
    0x2A0B: "Exact Time 100",
    0x2A0C: "Exact Time 256",
    0x2A0D: "DST Offset",
    0x2A0E: "Time Zone",
    0x2A0F: "Local Time Information",
    0x2A10: "Secondary Time Zone",
    0x2A11: "Time with DST",
    0x2A12: "Time Accuracy",
    0x2A13: "Time Source",
    0x2A14: "Reference Time Information",
    0x2A15: "Time Broadcast",
    0x2A16: "Time Update Control Point",
    0x2A17: "Time Update State",
    0x2A18: "Glucose Measurement",
    0x2A19: "Battery Level",
    0x2A1A: "Battery Power State",
    0x2A1B: "Battery Level State",
    0x2A1C: "Temperature Measurement",
    0x2A1D: "Temperature Type",
    0x2A1E: "Intermediate Temperature",
    0x2A1F: "Temperature Celsius",
    0x2A20: "Temperature Fahrenheit",
    0x2A21: "Measurement Interval",
    0x2A22: "Boot Keyboard Input Report",
    0x2A23: "System ID",
    0x2A24: "Model Number String",
    0x2A25: "Serial Number String",
    0x2A26: "Firmware Revision String",
    0x2A27: "Hardware Revision String",
    0x2A28: "Software Revision String",
    0x2A29: "Manufacturer Name String",
    0x2A2A: "IEEE 11073-20601 Regulatory Certification Data List",
    0x2A2B: "Current Time",
    0x2A2C: "Magnetic Declination",
    0x2A2D: "Latitude",
    0x2A2E: "Longitude",
    0x2A2F: "Position 2D",
    0x2A30: "Position 3D",
    0x2A31: "Scan Refresh",
    0x2A32: "Boot Keyboard Output Report",
    0x2A33: "Boot Mouse Input Report",
    0x2A34: "Glucose Measurement Context",
    0x2A35: "Blood Pressure Measurement",
    0x2A36: "Intermediate Cuff Pressure",
    0x2A37: "Heart Rate Measurement",
    0x2A38: "Body Sensor Location",
    0x2A39: "Heart Rate Control Point",
    0x2A3A: "Removable",
    0x2A3B: "Service Required",
    0x2A3C: "Scientific Temperature Celsius",
    0x2A3D: "String",
    0x2A3E: "Network Availability",
    0x2A3F: "Alert Status",
    0x2A40: "Ringer Control point",
    0x2A41: "Ringer Setting",
    0x2A42: "Alert Category ID Bit Mask",
    0x2A43: "Alert Category ID",
    0x2A44: "Alert Notification Control Point",
    0x2A45: "Unread Alert Status",
    0x2A46: "New Alert",
    0x2A47: "Supported New Alert Category",
    0x2A48: "Supported Unread Alert Category",
    0x2A49: "Blood Pressure Feature",
    0x2A4A: "HID Information",
    0x2A4B: "Report Map",
    0x2A4C: "HID Control Point",
    0x2A4D: "Report",
    0x2A4E: "Protocol Mode",
    0x2A4F: "Scan Interval Window",
    0x2A50: "PnP ID",
    0x2A51: "Glucose Feature",
    0x2A52: "Record Access Control Point",
    0x2A53: "RSC Measurement",
    0x2A54: "RSC Feature",
    0x2A56: "Digital",
    0x2A55: "SC Control Point",
    0x2A57: "Digital Output",
    0x2A58: "Analog",
    0x2A59: "Analog Output",
    0x2A5A: "Aggregate",
    0x2A5B: "CSC Measurement",
    0x2A5C: "CSC Feature",
    0x2A5D: "Sensor Location",
    0x2A5E: "PLX Spot-Check Measurement",
    0x2A5F: "PLX Continuous Measurement Characteristic",
    0x2A60: "PLX Features",
    0x2A62: "Pulse Oximetry Control Point",
    0x2A63: "Cycling Power Measurement",
    0x2A64: "Cycling Power Vector",
    0x2A65: "Cycling Power Feature",
    0x2A66: "Cycling Power Control Point",
    0x2A67: "Location and Speed Characteristic",
    0x2A68: "Navigation",
    0x2A69: "Position Quality",
    0x2A6A: "LN Feature",
    0x2A6B: "LN Control Point",
    0x2A6C: "Elevation",
    0x2A6D: "Pressure",
    0x2A6E: "Temperature",
    0x2A6F: "Humidity",
    0x2A70: "True Wind Speed",
    0x2A71: "True Wind Direction",
    0x2A72: "Apparent Wind Speed",
    0x2A73: "Apparent Wind Direction",
    0x2A74: "Gust Factor",
    0x2A75: "Pollen Concentration",
    0x2A76: "UV Index",
    0x2A77: "Irradiance",
    0x2A78: "Rainfall",
    0x2A79: "Wind Chill",
    0x2A7A: "Heat Index",
    0x2A7B: "Dew Point",
    0x2A7D: "Descriptor Value Changed",
    0x2A7E: "Aerobic Heart Rate Lower Limit",
    0x2A7F: "Aerobic Threshold",
    0x2A80: "Age",
    0x2A81: "Anaerobic Heart Rate Lower Limit",
    0x2A82: "Anaerobic Heart Rate Upper Limit",
    0x2A83: "Anaerobic Threshold",
    0x2A84: "Aerobic Heart Rate Upper Limit",
    0x2A85: "Date of Birth",
    0x2A86: "Date of Threshold Assessment",
    0x2A87: "Email Address",
    0x2A88: "Fat Burn Heart Rate Lower Limit",
    0x2A89: "Fat Burn Heart Rate Upper Limit",
    0x2A8A: "First Name",
    0x2A8B: "Five Zone Heart Rate Limits",
    0x2A8C: "Gender",
    0x2A8D: "Heart Rate Max",
    0x2A8E: "Height",
    0x2A8F: "Hip Circumference",
    0x2A90: "Last Name",
    0x2A91: "Maximum Recommended Heart Rate",
    0x2A92: "Resting Heart Rate",
    0x2A93: "Sport Type for Aerobic and Anaerobic Thresholds",
    0x2A94: "Three Zone Heart Rate Limits",
    0x2A95: "Two Zone Heart Rate Limit",
    0x2A96: "VO2 Max",
    0x2A97: "Waist Circumference",
    0x2A98: "Weight",
    0x2A99: "Database Change Increment",
    0x2A9A: "User Index",
    0x2A9B: "Body Composition Feature",
    0x2A9C: "Body Composition Measurement",
    0x2A9D: "Weight Measurement",
    0x2A9E: "Weight Scale Feature",
    0x2A9F: "User Control Point",
    0x2AA0: "Magnetic Flux Density - 2D",
    0x2AA1: "Magnetic Flux Density - 3D",
    0x2AA2: "Language",
    0x2AA3: "Barometric Pressure Trend",
    0x2AA4: "Bond Management Control Point",
    0x2AA5: "Bond Management Features",
    0x2AA6: "Central Address Resolution",
    0x2AA7: "CGM Measurement",
    0x2AA8: "CGM Feature",
    0x2AA9: "CGM Status",
    0x2AAA: "CGM Session Start Time",
    0x2AAB: "CGM Session Run Time",
    0x2AAC: "CGM Specific Ops Control Point",
    0x2AAD: "Indoor Positioning Configuration",
    0x2AAE: "Latitude",
    0x2AAF: "Longitude",
    0x2AB0: "Local North Coordinate",
    0x2AB1: "Local East Coordinate",
    0x2AB3: "Altitude",
    0x2AB4: "Uncertainty",
    0x2AB5: "Location Name",
    0x2AB6: "URI",
    0x2ABC: "TDS Control Point",
    0x2ABD: "OTS Feature",
    0x2ABE: "Object Name",
    0x2ABF: "Object Type",
    0x2AC0: "Object Size",
    0x2AC1: "Object First-Created",
    0x2AC2: "Object Last-Modified",
    0x2AC3: "Object ID",
    0x2AC4: "Object Properties",
    0x2AC5: "Object Action Control Point",
    0x2AC6: "Object List Control Point",
    0x2AC7: "Object List Filter",
    0x2AC8: "Object Changed",
    0x2AC9: "Resolvable Private Address Only",
    0x2ACE: "Cross Trainer Data",
    0x2AD9: "Fitness Machine Control Point",
    0x2ACC: "Fitness Machine Feature",
    0x2ACD: "Treadmill Data",
    0x2ACF: "Step Climber Data",
    0x2AB2: "Floor Number",
    0x2AB7: "HTTP Headers",
    0x2AB8: "HTTP Status Code",
    0x2AB9: "HTTP Entity Body",
    0x2ABA: "HTTP Control Point",
    0x2ABB: "HTTPS Security",
    0x2AC9: "Resolvable Private Address Only",
    0x2AD0: "Stair Climber Data",
    0x2AD1: "Rower Data",
    0x2AD2: "Indoor Bike Data",
    0x2AD3: "Training Status",
    0x2AD4: "Supported Speed Range",
    0x2AD5: "Supported Inclination Range",
    0x2AD6: "Supported Resistance Level Range",
    0x2AD7: "Supported Heart Rate Range",
    0x2AD8: "Supported Power Range",
    0x2ADA: "Fitness Machine Status",
    0x2ADB: "Mesh Provisioning Data In",
    0x2ADC: "Mesh Provisioning Data Out",
    0x2ADD: "Mesh Proxy Data In",
    0x2ADE: "Mesh Proxy Data Out",
    0x2B1D: "RC Feature",
    0x2B1E: "RC Settings",
    0x2B1F: "Reconnection Configuration Control Point",
    0x2B29: "Client Supported Features",
    0x2B2A: "Database Hash",
    0x2B3A: "Server Supported Features",
  };