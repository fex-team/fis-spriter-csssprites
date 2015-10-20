module.exports.getUrl = function (file, from, opt) {
    if (fis.emit) {
        var msg = {
            target: file,
            file: from
        };
        fis.emit('plugin:relative:fetch', msg);
        return msg.ret || file.getUrl(opt.hash, opt.domain);
    }
    return file.getUrl(opt.hash, opt.domain);
}
