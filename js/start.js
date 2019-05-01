'use strict';

//var vConsole = new VConsole();

new ClipboardJS('.clip_btn');

var vue_options = {
    el: "#top",
    data: {
        progress_title: '',

        base64_input: '',
        base64_output: '',
        url_input: '',
        url_output: '',
        html_input: '',
        html_output: '',
        json_inout: '',
        encode_html_space: false,
        js_inout: '',
        css_inout: '',
        html_inout: '',
        duration_year: 0,
        duration_month: 0,
        duration_day: 0,
        duration_hour: 0,
        duration_minute: 0,
        duration_second: 0,
        date_moment: moment(),
        date_moment_after: null,
        qrcode_input: '',
        clip_data: [],
        notify_gmail_address: '',
        notify_gmail_message: '',
        notify_line_message: '',
        notify_apikey: '',
        notify_url: '',
        passwd_num: 12,
        passwd_check_lower_letter: true,
        passwd_check_upper_letter: true,
        passwd_check_number: true,
        passwd_number_num: 1,
        passwd_check_symbol: false,
        passwd_symbol_pattern: "-+*/_",
        passwd_symbol_num: 1,
        passwd_password: '',
        scraping_apikey: '',
        scraping_url: '',
        scraping_keikyu_message: '',
        scraping_keikyu_received_date: '',
        qiita_apikey: '',
        qiita_url: '',
        qiita_item_list: [],
        qiita_items_received_date: '',
        base_decimal: 0,
        cardinal_decimal: 0,
        cardinal_binary: 0,
        cardinal_octet: 0,
        cardinal_hexadecimal: 0,
        cardinal_hexadecimal_num: 2,
        cardinal_check_hexadecimal: false,
        cardinal_binary_num: 2,
        cardinal_check_binary: false,
        cardinal_octet_num: 2,
        cardinal_check_octet: false,
        array_pattern: [],
        base_array: '',
        array_length: 0,
        gengou_era_name: '令和',
        gengou_era_other: '',
        gengou_era_year: 1,
        gengou_anno_year: 2019,
        gengou_list: gengou_list.reverse(),
    },
    computed: {
        date_unix: function(){
            var date = this.date_moment.toDate();
            return date.getTime();
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
            var date = this.date_moment_after.toDate();
            return date.getTime();
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
        }
    },
    methods: {
        /* QRコード */
        qrcode_create: function(){
            $('#qrcode_area').empty();
            new QRCode($("#qrcode_area")[0], this.qrcode_input);
        },

        /* エンコード */
        base64_encode: function(encode){
            try{
                if( encode )
                    this.base64_output = btoa(this.base64_input);
                else
                    this.base64_output = atob(this.base64_input);
            }catch( error ){
                alert(error);
            }
        },
        url_encode: function(encode){
            try{
                if( encode )
                    this.url_output = encodeURI(this.url_input);
                else
                    this.url_output = decodeURI(this.url_input);
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

        /* パスワード */
        passwd_create: function(){
            var passwd_num = Number(this.passwd_num);
            var passwd_number_num = this.passwd_check_number ? Number(this.passwd_number_num) : 0;
            var passwd_symbol_num = this.passwd_check_symbol ? Number(this.passwd_symbol_num) : 0;
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
            if( this.passwd_check_lower_letter )
                alpha_pattern += "abcdefghijklmnopqrstuvwxyz";
            if( this.passwd_check_upper_letter )
                alpha_pattern += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

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
                this.base_array = hexStr2byteAry(this.array_pattern[0]);
            }else if( ptn == 1 ){
                this.base_array = hexStr2byteAry(this.array_pattern[1], ' ');
            }else if( ptn == 2 ){
                this.base_array = hexStr2byteAry(this.array_pattern[2], ',');
            }else if( ptn == 3 ){
                this.base_array = hexStr2byteAry_2(this.array_pattern[3], ',');
            }

            this.array_length = this.base_array.length;
            this.array_pattern[0] = byteAry2hexStr(this.base_array, '');
            this.array_pattern[1] = byteAry2hexStr(this.base_array, ' ');
            this.array_pattern[2] = byteAry2hexStr(this.base_array, ', ', '0x');
            this.array_pattern[3] = byteAry2hexStr(this.base_array, ', ', '(byte)0x');
        },
        
        /* 日時 */
        date_get_now: function(){
            this.date_moment = moment();
        },
        date_process: function(){
            var temp = moment(this.date_moment);
            temp.add(Number(this.duration_year), 'years');
            temp.add(Number(this.duration_month), 'months');
            temp.add(Number(this.duration_day), 'days');
            temp.add(Number(this.duration_hour), 'hours');
            temp.add(Number(this.duration_minute), 'minutes');
            temp.add(Number(this.duration_second), 'seconds');
            this.date_moment_after = temp;
        },
        date_set: function(){
            var date = window.prompt("日時を指定してください", "");
            if(date == null )
                return;
            if( !isNaN(date) )
                this.date_moment = moment(Number(date));
            else
                this.date_moment = moment(date);
        },
        date_reset_duration: function(){
            this.duration_year = 0;
            this.duration_month = 0;
            this.duration_day = 0;
            this.duration_hour = 0;
            this.duration_minute = 0;
            this.duration_second = 0;
        },

        /* 基数 */
        cardinal_convart: function(cardinal){
            var base = 0;
            if( cardinal == 'decimal'){
                base = parseInt(this.cardinal_decimal, 10);
            }else if( cardinal == 'binary'){
                base = parseInt(this.cardinal_binary, 2);
            }else if( cardinal == 'octet'){
                base = parseInt(this.cardinal_octet, 8);
            }else if( cardinal == 'hexadecimal'){
                base = parseInt(this.cardinal_hexadecimal, 16);
            }
            this.base_decimal = Math.floor(base);

            this.cardinal_update();
        },
        cardinal_shift(cardinal, shift){
            var mult = 1;
            switch( cardinal ){
                case 'binary': mult = 2; break;
                case 'decimal': mult = 10; break;
                case 'octet': mult = 8; break;
                case 'hexadecimal': mult = 16; break;
            }
            if( shift == 'right' )
                this.base_decimal = Math.floor(this.base_decimal / mult);
            else
                this.base_decimal = Math.floor(this.base_decimal * mult);

            this.cardinal_update();
        },
        cardinal_update: function(){
            this.cardinal_decimal = this.base_decimal;
            var temp = Math.floor(this.base_decimal.toString(2));
            if( this.cardinal_check_binary ){
                for( var i = temp.length ; i < this.cardinal_binary_num; i++ )
                    temp = '0' + temp;
            }
            this.cardinal_binary = temp;
            var temp =this.base_decimal.toString(8);
            if( this.cardinal_check_binary ){
                for( var i = temp.length ; i < this.cardinal_octet_num; i++ )
                    temp = '0' + temp;
            }
            this.cardinal_octet = temp;
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
            for( var i = 0 ; i <= 6 ; i++ ){
                this.clip_clear(i);
            }
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
        
            var year = Number(this.gengou_era_year);
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
            var year = Number(this.gengou_anno_year);
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
                apikey: this.scraping_apikey
            };
            do_post(this.scraping_url + '/scraping-keikyu', body)
            .then(json =>{
                if( json.result != 'OK'){
                    alert('失敗しました。');
                    return;
                }
                Cookies.set('scraping_apikey', this.scraping_apikey, { expires: 365 });
                Cookies.set('scraping_url', this.scraping_url, { expires: 365 });
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

        /* 通知 */
        notify_gmail: function(){
            var body = {
                mail_address : this.notify_gmail_address,
                message: this.notify_gmail_message,
                apikey: this.notify_apikey
            };

            do_post(this.notify_url + '/notify-gmail', body)
            .then(json =>{
                if( json.result != 'OK'){
                    alert('失敗しました。');
                    return;
                }
                Cookies.set('notify_apikey', this.notify_apikey, { expires: 365 });
                Cookies.set('notify_url', this.notify_url, { expires: 365 });
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
                apikey: this.notify_apikey
            };

            do_post(this.notify_url + '/notify-line', body)
            .then(json =>{
                if( json.result != 'OK'){
                    alert('失敗しました。');
                    return;
                }
                Cookies.set('notify_apikey', this.notify_apikey, { expires: 365 });
                alert('送信しました。');
            })
            .catch(error =>{
                alert(error);
            });
        },
        qiita_items: function(){
            var body = {
                apikey: this.qiita_apikey
            };

            this.progress_open();
            do_post(this.qiita_url + '/qiita-items', body)
            .then(json =>{
                this.progress_close();
                if( json.result != 'OK'){
                    alert('失敗しました。');
                    return;
                }
                this.qiita_item_list = json.items;
                this.qiita_items_received_date = new Date().toLocaleString();
                Cookies.set('qiita_apikey', this.qiita_apikey, { expires: 365 });
                Cookies.set('qiita_url', this.qiita_url, { expires: 365 });
            })
            .catch(error =>{
                this.progress_close();
                alert(error);
            });
        }
    },
    created: function(){
    },
    mounted: function(){
        proc_load();
        history.replaceState(null, null, location.pathname);

        this.date_process();
        for( var i = 0 ; i <= 6 ; i++ ){
            this.clip_data[i] = Cookies.get('clip_data' + i);
        }
        this.notify_apikey = Cookies.get('notify_apikey');
        this.notify_url = Cookies.get('notify_url');
        this.notify_gmail_address = Cookies.get('notify_gmail_address');
        this.scraping_apikey = Cookies.get('scraping_apikey');
        this.scraping_url = Cookies.get('scraping_url');
        this.qiita_apikey = Cookies.get('qiita_apikey');
        this.qiita_url = Cookies.get('qiita_url');
    }
};
vue_add_methods(vue_options, methods_utils);
var vue = new Vue( vue_options );

function do_post_token(url, body, token){
    var data = new URLSearchParams();
    for( var name in body )
        data.append(name, body[name]);

    return fetch(url, {
        method : 'POST',
        body : data,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : 'Bearer ' + token }
    })
    .then((response) => {
        if( response.status != 200 )
            throw 'status is not 200';
        return response.json();
    });
}

function do_post(url, body){
    const headers = new Headers( { "Content-Type" : "application/json; charset=utf-8" } );
    
    return fetch(url, {
        method : 'POST',
        body : JSON.stringify(body),
        headers: headers
    })
    .then((response) => {
        if( response.status != 200 )
            throw 'status is not 200';
        return response.json();
    });
}

function make_random(max)
{
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

function byteAry2hexStr(bytes, sep = '', pref = '') {
    return bytes.map((b) => {
        var s = b.toString(16);
        return pref + (b < 0x10 ? '0'+s : s);
    })
    .join(sep);
}
