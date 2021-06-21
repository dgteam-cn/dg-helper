const big = require('big.js');
// const mineTypeMap = {
//     'application': {
//         'envoy': 'evy',
//         'fractals': 'fif',
//         'futuresplash': 'spl',
//         'hta': 'hta',
//         'internet-property-stream': 'acx',
//         'mac-binhex40': 'hqx',
//         'msword': ['doc', 'dot'],
//         'vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
//         'octet-stream': ['*', 'bin', 'class', 'dms', 'exe', 'lha', 'lzh'],
//         'oda': 'oda',
//         'olescript': 'axs',
//         'pdf': 'pdf',
//         'pics-rules': 'prf',
//         'pkcs10': 'p10',
//         'pkix-crl': 'crl',
//         'postscript': ['ai', 'eps', 'ps'],
//         'rtf': 'rtf',
//         'set-payment-initiation': 'setpay',
//         'set-registration-initiation': 'setreg',
//         'vnd.ms-excel': ['xla', 'xlc', 'xlm', 'xls', 'xlt', 'xlw'],
//         'vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
//         'vnd.ms-outlook': 'msg',
//         'vnd.ms-pkicertstore': 'sst',
//         'vnd.ms-pkiseccat': 'cat',
//         'vnd.ms-pkistl': 'stl',
//         'vnd.ms-powerpoint': ['pot', 'pps', 'ppt'],
//         'vnd.ms-project': 'mpp',
//         'vnd.ms-works': ['wcm', 'wdb', 'wks', 'wps'],
//         'winhlp': 'hlp',
//         'x-bcpio': 'bcpio',
//         'x-cdf': 'cdf',
//         'x-compress': 'z',
//         'x-compressed': 'tgz',
//         'x-cpio': 'cpio',
//         'x-csh': 'csh',
//         'x-director': ['dcr', 'dir', 'dxr'],
//         'x-dvi': 'dvi',
//         'x-gtar': 'gtar',
//         'x-gzip': 'gz',
//         'x-hdf': 'hdf',
//         'x-internet-signup': ['ins', 'isp'],
//         'x-iphone': 'iii',
//         'x-javascript': 'js',
//         'x-latex': 'latex',
//         'x-msaccess': 'mdb',
//         'x-mscardfile': 'crd',
//         'x-msclip': 'clp',
//         'x-msdownload': 'dll',
//         'x-msmediaview': ['m13', 'm14', 'mvb'],
//         'x-msmetafile': 'wmf',
//         'x-msmoney': 'mny',
//         'x-mspublisher': 'pub',
//         'x-msschedule': 'scd',
//         'x-msterminal': 'trm',
//         'x-mswrite': 'wri',
//         'x-netcdf': ['cdf', 'nc'],
//         'x-perfmon': ['pma', 'pmc', 'pml', 'pmr', 'pmw'],
//         'x-pkcs12': ['p12', 'pfx'],
//         'x-pkcs7-certificates': ['p7b', 'spc'],
//         'x-pkcs7-certreqresp': 'p7r',
//         'x-pkcs7-mime': ['p7c', 'p7m'],
//         'x-pkcs7-signature': 'p7s',
//         'x-sh': 'sh',
//         'x-shar': 'shar',
//         'x-shockwave-flash': 'swf',
//         'x-stuffit': 'sit',
//         'x-sv4cpio': 'sv4cpio',
//         'x-sv4crc': 'sv4crc',
//         'x-tar': 'tar',
//         'x-tcl': 'tcl',
//         'x-tex': 'tex',
//         'x-texinfo': ['texi', 'texinfo'],
//         'x-troff': ['roff', 't', 'tr'],
//         'x-troff-man': 'man',
//         'x-troff-me': 'me',
//         'x-troff-ms': 'ms',
//         'x-ustar': 'ustar',
//         'x-wais-source': 'src',
//         'x-x509-ca-cert': ['cer', 'crt', 'der'],
//         'ynd.ms-pkipko': 'pko',
//         'zip': 'zip'
//     },
//     'audio': {
//         'basic': ['au', 'snd'],
//         'mid': ['mid', 'rmi'],
//         'mpeg': 'mp3',
//         'x-aiff': ['aif', 'aifc', 'aiff'],
//         'x-mpegurl': 'm3u',
//         'x-pn-realaudio': ['ra', 'ram'],
//         'x-wav': 'wav'
//     },
//     'image': {
//         'bmp': 'bmp',
//         'cis-cod': 'cod',
//         'gif': 'gif',
//         'ief': 'ief',
//         'jpeg': ['jpe', 'jpeg', 'jpg'],
//         'png': 'png',
//         'pipeg': 'jfif',
//         'svg+xml': 'svg',
//         'tiff': ['tif', 'tiff'],
//         'x-cmu-raster': 'ras',
//         'x-cmx': 'cmx',
//         'x-icon': 'ico',
//         'x-portable-anymap': 'pnm',
//         'x-portable-bitmap': 'pbm',
//         'x-portable-graymap': 'pgm',
//         'x-portable-pixmap': 'ppm',
//         'x-rgb': 'rgb',
//         'x-xbitmap': 'xbm',
//         'x-xpixmap': 'xpm',
//         'x-xwindowdump': 'xwd'
//     },
//     'message': {
//         'rfc822': ['mht', 'mhtml', 'nws']
//     },
//     'text': {
//         'css': 'css',
//         'h323': '323',
//         'html': ['htm', 'html', 'stm'],
//         'iuls': 'uls',
//         'plain': ['bas', 'c', 'h', 'txt'],
//         'richtext': 'rtx',
//         'scriptlet': 'sct',
//         'tab-separated-values': 'tsv',
//         'webviewhtml': 'htt',
//         'x-component': 'htc',
//         'x-setext': 'etx',
//         'x-vcard': 'vcf'
//     },
//     'video': {
//         'mpeg': ['mp2', 'mpa', 'mpe', 'mpeg', 'mpg', 'mpv2'],
//         'quicktime': ['mov', 'qt'],
//         'x-la-asf': ['lsf', 'lsx'],
//         'x-ms-asf': ['asf', 'asr', 'asx'],
//         'x-msvideo': 'avi',
//         'x-sgi-movie': 'movie'
//     },
//     'x-world': {
//         'x-world/x-vrml': ['flr', 'vrml', 'wrl', 'wrz', 'xaf', 'xof']
//     }
// }
// const accepts = {
//     image: ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp'],
//     txt: ['text/plain'],
//     word: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
//     excel: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
//     pdf: ['application/pdf'],
//     // document: ['text/plain','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
//     video: ['video/mp4'],
//     sound: ['audio/x-mpeg'],
//     html: ['text/html']
// }
/**
 * 把字节数转换为指定的格式
 * @param {number} size - 原字节数大小
 * @param {number} [opt.round = 2] 保留几位小数
 * @returns {string}
 */
const fileSizeName = (size, { round = 2 } = {}) => {
    if (size) {
        try {
            size = Number(size);
            if (1024 > size) {
                return size + ' B';
            }
            else if (1048576 > size) {
                return big(size).div(1024).round(round, 1) + ' KB';
            }
            else if (1073741824 > size) {
                return big(size).div(1048576).round(round, 1) + ' MB';
            }
            else {
                return big(size).div(1073741824).round(round, 1) + ' GB';
            }
        }
        catch (e) {
            return '-';
        }
    }
    return '-';
};
module.exports = { fileSizeName };
