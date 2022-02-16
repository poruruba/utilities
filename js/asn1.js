const decoder = new TextDecoder();
const oid_base_url = "http://oid-info.com/get/";

export class Asn1{
  constructor(bArray, offset = 0){
    var index = 0;
    var tagClass = (bArray[index] & 0xc0) >> 6;
    var structured = (bArray[index] & 0x20) != 0x00;
    var tagNumber = bArray[index++] & 0x1f;
    if (tagNumber === 0x1f) {
      tagNumber = 0;
        while (bArray[index] & 0x80) {
            tag = (tag << 7) + (bArray[index] & 0x7f);
            index++;
        }
        tag = (tag << 7) + (bArray[index] & 0x7f);
        index++;
    }

    var length = 0;
    if (!(bArray[index] & 0x80)) {
        length = bArray[index++];
    } else {
        var numberOfDigits = bArray[index++] & 0x7f;
        for (var i = 0; i < numberOfDigits; i++)
            length = (length << 8) + bArray[index++];
    }
    var startIndex = index;
    if (length == 0x80) {
      length = 0;
      while (bArray[startIndex + length] !== 0 || bArray[startIndex + length + 1] !== 0) {
          length++;
      }
    }
    
    this.tagClass = tagClass;
    this.structured = structured;
    this.tagNumber = tagNumber;
    this.length = length;
    this.totalLength = startIndex + length;
    this.offset = offset;
    if( !structured ){
      var buffer = bArray.subarray(startIndex, startIndex + length);
      this.payload = ba2hex(buffer);
      if( this.tagClass == 0 ){
        switch(this.tagNumber){
          case 1: { // BOOL
            this.contents = {
              boolean: (buffer[0] == 0xff)
            };
            break;
          }
          case 3: { // BIT STRING
            this.contents = {
              unusedBits: buffer[0],
              bytes: ba2hex(buffer.subarray(1))
            };
            break;
          }
          case 4:{ // OCTET STRING
            this.contents = {
              bytes: ba2hex(buffer)
            };
            break;
          }
          case 6:{ // OBJECT IDENTIFIER
            this.contents = {
              oid: this.berObjectIdentifierValue(buffer)
            };
            break;
          }
          case 12:{ // UTF8String
            this.contents = {
              text: decoder.decode(buffer)
            }
            break;
          }
          case 19:{ // PrintableString
            this.contents = {
              text: decoder.decode(buffer)
            }
            break;
          }
          case 23:{ // UTCTime 
            this.contents = {
              datetime: moment(decoder.decode(buffer), "YYMMDDHHmmssZ").toISOString()
            };
            break;
          }
          case 24:{ // GeneralizedTime
            this.contents = {
              datetime: moment(decoder.decode(buffer), "YYYYMMDDHHmmssZ").toISOString()
            };
            break;
          }
        }
      }
    }else{
      var list = [];
      var position = 0;
      while (position < length) {
          var nextPiece = new Asn1(bArray.subarray(startIndex + position, bArray.length), offset + startIndex + position);
          list.push(nextPiece);
          position += nextPiece.totalLength;
      }
      this.structureList = list;
    }
  }

  async translateOid(recursive){
    if( this.tagNumber == 6 )
      this.contents.name = await translateOid(this.contents.oid);

    if( recursive && this.structured ){
      for( const item of this.structureList )
        await item.translateOid(recursive);
    }
  }

  berObjectIdentifierValue(bArray) {
    var position = 0;
    var oid = Math.floor(bArray[position] / 40) + "." + bArray[position] % 40;
    position++;
    while(position < bArray.length) {
        var nextInteger = 0;
        while (bArray[position] & 0x80) {
            nextInteger = (nextInteger << 7) + (bArray[position] & 0x7f);
            position++;
        }
        nextInteger = (nextInteger << 7) + (bArray[position] & 0x7f);
        position++;
        oid += "." + nextInteger;
    }
    return oid;
  }
}

async function do_get_text(url, qs) {
  var params = new URLSearchParams(qs);

  var params_str = params.toString();
  var postfix = (params_str == "") ? "" : ((url.indexOf('?') >= 0) ? ('&' + params_str) : ('?' + params_str));
  return fetch(url + postfix, {
      method: 'GET',
    })
    .then((response) => {
      if (!response.ok)
        throw 'status is not 200';
      return response.text();
    });
}

export async function translateOid(oid){
	var url = oid_base_url + oid;
	var text = await do_get_text(url);
  var pattern1 = new RegExp("<strong><code>.*?<\/code><\/strong>", "g"); 
  var result = text.match(pattern1);
  if( result.length <= 0 )
    return 0;
  return result[0].slice(14, -16);
}

function ba2hex(bytes, sep = '', pref = '') {
  if( !bytes )
      return null;
  if (bytes instanceof ArrayBuffer)
      bytes = new Uint8Array(bytes);
  if (bytes instanceof Uint8Array)
      bytes = Array.from(bytes);

  return bytes.map((b) => {
      const s = b.toString(16);
      return pref + (b < 0x10 ? ('0' + s) : s);
  }).join(sep);
}

// module.exports = {
//   Asn1,
//   translateOid
// };
