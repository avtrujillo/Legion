var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var fs = require("fs");
var Sentry = require("@sentry/node");
Sentry.init({ dsn: process.env.SENTRY_DSN });
var Base = require("eris-sharder").Base;
var Tupperbox = (function (_super) {
    __extends(Tupperbox, _super);
    function Tupperbox(bot) {
        return _super.call(this, bot) || this;
    }
    Tupperbox.prototype.launch = function () {
        var bot = this.bot;
        bot.base = this;
        bot.sentry = Sentry;
        bot.db = require("./modules/db");
        bot.msg = require("./modules/msg");
        bot.cmd = require("./modules/cmd");
        bot.proxy = require("./modules/proxy");
        bot.paginator = require("./modules/paginator");
        bot.recent = {};
        bot.cmds = {};
        bot.dialogs = {};
        bot.owner = process.env.DISCORD_OWNERID;
        bot.defaultCfg = { prefix: process.env.DEFAULT_PREFIX, lang: process.env.DEFAULT_LANG };
        try {
            bot.blacklist = require("./modules/blacklist.json");
        }
        catch (e) {
            bot.blacklist = [];
        }
        require("./modules/ipc")(bot);
        require("./modules/util")(bot);
        var files = fs.readdirSync("./commands");
        files.forEach(function (file) {
            bot.cmds[file.slice(0, -3)] = require("./commands/" + file);
        });
        files = fs.readdirSync("./events");
        files.forEach(function (file) {
            bot.on(file.slice(0, -3), function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return require("./events/" + file).apply(void 0, __spreadArrays(args, [bot]));
            });
        });
        process.on("message", function (message) {
            if (bot.ipc[message.name])
                bot.ipc[message.name](message);
        });
        setInterval(function () { return bot.updateStatus(); }, 3600000);
        bot.updateStatus();
        if (!process.env.BOT_INVITE)
            delete bot.cmds.invite;
        if (!process.env.SUPPORT_INVITE)
            delete bot.cmds.feedback;
        if (!fs.existsSync("privacy.txt")) {
            console.warn("no privacy command");
            delete bot.cmds.privacy;
        }
    };
    return Tupperbox;
}(Base));
module.exports = Tupperbox;
//# sourceMappingURL=bot.js.map