#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/tsup/assets/esm_shims.js
import path from "path";
import { fileURLToPath } from "url";
var init_esm_shims = __esm({
  "node_modules/tsup/assets/esm_shims.js"() {
    "use strict";
  }
});

// node_modules/is-docker/index.js
import fs6 from "fs";
function hasDockerEnv() {
  try {
    fs6.statSync("/.dockerenv");
    return true;
  } catch {
    return false;
  }
}
function hasDockerCGroup() {
  try {
    return fs6.readFileSync("/proc/self/cgroup", "utf8").includes("docker");
  } catch {
    return false;
  }
}
function isDocker() {
  if (isDockerCached === void 0) {
    isDockerCached = hasDockerEnv() || hasDockerCGroup();
  }
  return isDockerCached;
}
var isDockerCached;
var init_is_docker = __esm({
  "node_modules/is-docker/index.js"() {
    "use strict";
    init_esm_shims();
  }
});

// node_modules/is-inside-container/index.js
import fs7 from "fs";
function isInsideContainer() {
  if (cachedResult === void 0) {
    cachedResult = hasContainerEnv() || isDocker();
  }
  return cachedResult;
}
var cachedResult, hasContainerEnv;
var init_is_inside_container = __esm({
  "node_modules/is-inside-container/index.js"() {
    "use strict";
    init_esm_shims();
    init_is_docker();
    hasContainerEnv = () => {
      try {
        fs7.statSync("/run/.containerenv");
        return true;
      } catch {
        return false;
      }
    };
  }
});

// node_modules/is-wsl/index.js
import process3 from "process";
import os7 from "os";
import fs8 from "fs";
var isWsl, is_wsl_default;
var init_is_wsl = __esm({
  "node_modules/is-wsl/index.js"() {
    "use strict";
    init_esm_shims();
    init_is_inside_container();
    isWsl = () => {
      if (process3.platform !== "linux") {
        return false;
      }
      if (os7.release().toLowerCase().includes("microsoft")) {
        if (isInsideContainer()) {
          return false;
        }
        return true;
      }
      try {
        if (fs8.readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft")) {
          return !isInsideContainer();
        }
      } catch {
      }
      if (fs8.existsSync("/proc/sys/fs/binfmt_misc/WSLInterop") || fs8.existsSync("/run/WSL")) {
        return !isInsideContainer();
      }
      return false;
    };
    is_wsl_default = process3.env.__IS_WSL_TEST__ ? isWsl : isWsl();
  }
});

// node_modules/isexe/windows.js
var require_windows = __commonJS({
  "node_modules/isexe/windows.js"(exports, module) {
    "use strict";
    init_esm_shims();
    module.exports = isexe;
    isexe.sync = sync;
    var fs16 = __require("fs");
    function checkPathExt(path16, options) {
      var pathext = options.pathExt !== void 0 ? options.pathExt : process.env.PATHEXT;
      if (!pathext) {
        return true;
      }
      pathext = pathext.split(";");
      if (pathext.indexOf("") !== -1) {
        return true;
      }
      for (var i = 0; i < pathext.length; i++) {
        var p = pathext[i].toLowerCase();
        if (p && path16.substr(-p.length).toLowerCase() === p) {
          return true;
        }
      }
      return false;
    }
    function checkStat(stat, path16, options) {
      if (!stat.isSymbolicLink() && !stat.isFile()) {
        return false;
      }
      return checkPathExt(path16, options);
    }
    function isexe(path16, options, cb) {
      fs16.stat(path16, function(er, stat) {
        cb(er, er ? false : checkStat(stat, path16, options));
      });
    }
    function sync(path16, options) {
      return checkStat(fs16.statSync(path16), path16, options);
    }
  }
});

// node_modules/isexe/mode.js
var require_mode = __commonJS({
  "node_modules/isexe/mode.js"(exports, module) {
    "use strict";
    init_esm_shims();
    module.exports = isexe;
    isexe.sync = sync;
    var fs16 = __require("fs");
    function isexe(path16, options, cb) {
      fs16.stat(path16, function(er, stat) {
        cb(er, er ? false : checkStat(stat, options));
      });
    }
    function sync(path16, options) {
      return checkStat(fs16.statSync(path16), options);
    }
    function checkStat(stat, options) {
      return stat.isFile() && checkMode(stat, options);
    }
    function checkMode(stat, options) {
      var mod = stat.mode;
      var uid = stat.uid;
      var gid = stat.gid;
      var myUid = options.uid !== void 0 ? options.uid : process.getuid && process.getuid();
      var myGid = options.gid !== void 0 ? options.gid : process.getgid && process.getgid();
      var u = parseInt("100", 8);
      var g = parseInt("010", 8);
      var o = parseInt("001", 8);
      var ug = u | g;
      var ret = mod & o || mod & g && gid === myGid || mod & u && uid === myUid || mod & ug && myUid === 0;
      return ret;
    }
  }
});

// node_modules/isexe/index.js
var require_isexe = __commonJS({
  "node_modules/isexe/index.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var fs16 = __require("fs");
    var core;
    if (process.platform === "win32" || global.TESTING_WINDOWS) {
      core = require_windows();
    } else {
      core = require_mode();
    }
    module.exports = isexe;
    isexe.sync = sync;
    function isexe(path16, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      if (!cb) {
        if (typeof Promise !== "function") {
          throw new TypeError("callback not provided");
        }
        return new Promise(function(resolve, reject) {
          isexe(path16, options || {}, function(er, is) {
            if (er) {
              reject(er);
            } else {
              resolve(is);
            }
          });
        });
      }
      core(path16, options || {}, function(er, is) {
        if (er) {
          if (er.code === "EACCES" || options && options.ignoreErrors) {
            er = null;
            is = false;
          }
        }
        cb(er, is);
      });
    }
    function sync(path16, options) {
      try {
        return core.sync(path16, options || {});
      } catch (er) {
        if (options && options.ignoreErrors || er.code === "EACCES") {
          return false;
        } else {
          throw er;
        }
      }
    }
  }
});

// node_modules/which/which.js
var require_which = __commonJS({
  "node_modules/which/which.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var isWindows = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys";
    var path16 = __require("path");
    var COLON = isWindows ? ";" : ":";
    var isexe = require_isexe();
    var getNotFoundError = (cmd) => Object.assign(new Error(`not found: ${cmd}`), { code: "ENOENT" });
    var getPathInfo = (cmd, opt) => {
      const colon = opt.colon || COLON;
      const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? [""] : [
        // windows always checks the cwd first
        ...isWindows ? [process.cwd()] : [],
        ...(opt.path || process.env.PATH || /* istanbul ignore next: very unusual */
        "").split(colon)
      ];
      const pathExtExe = isWindows ? opt.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "";
      const pathExt = isWindows ? pathExtExe.split(colon) : [""];
      if (isWindows) {
        if (cmd.indexOf(".") !== -1 && pathExt[0] !== "")
          pathExt.unshift("");
      }
      return {
        pathEnv,
        pathExt,
        pathExtExe
      };
    };
    var which = (cmd, opt, cb) => {
      if (typeof opt === "function") {
        cb = opt;
        opt = {};
      }
      if (!opt)
        opt = {};
      const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
      const found = [];
      const step = (i) => new Promise((resolve, reject) => {
        if (i === pathEnv.length)
          return opt.all && found.length ? resolve(found) : reject(getNotFoundError(cmd));
        const ppRaw = pathEnv[i];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = path16.join(pathPart, cmd);
        const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        resolve(subStep(p, i, 0));
      });
      const subStep = (p, i, ii) => new Promise((resolve, reject) => {
        if (ii === pathExt.length)
          return resolve(step(i + 1));
        const ext = pathExt[ii];
        isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
          if (!er && is) {
            if (opt.all)
              found.push(p + ext);
            else
              return resolve(p + ext);
          }
          return resolve(subStep(p, i, ii + 1));
        });
      });
      return cb ? step(0).then((res) => cb(null, res), cb) : step(0);
    };
    var whichSync = (cmd, opt) => {
      opt = opt || {};
      const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
      const found = [];
      for (let i = 0; i < pathEnv.length; i++) {
        const ppRaw = pathEnv[i];
        const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
        const pCmd = path16.join(pathPart, cmd);
        const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
        for (let j = 0; j < pathExt.length; j++) {
          const cur = p + pathExt[j];
          try {
            const is = isexe.sync(cur, { pathExt: pathExtExe });
            if (is) {
              if (opt.all)
                found.push(cur);
              else
                return cur;
            }
          } catch (ex) {
          }
        }
      }
      if (opt.all && found.length)
        return found;
      if (opt.nothrow)
        return null;
      throw getNotFoundError(cmd);
    };
    module.exports = which;
    which.sync = whichSync;
  }
});

// node_modules/path-key/index.js
var require_path_key = __commonJS({
  "node_modules/path-key/index.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var pathKey2 = (options = {}) => {
      const environment = options.env || process.env;
      const platform = options.platform || process.platform;
      if (platform !== "win32") {
        return "PATH";
      }
      return Object.keys(environment).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
    };
    module.exports = pathKey2;
    module.exports.default = pathKey2;
  }
});

// node_modules/cross-spawn/lib/util/resolveCommand.js
var require_resolveCommand = __commonJS({
  "node_modules/cross-spawn/lib/util/resolveCommand.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var path16 = __require("path");
    var which = require_which();
    var getPathKey = require_path_key();
    function resolveCommandAttempt(parsed, withoutPathExt) {
      const env3 = parsed.options.env || process.env;
      const cwd = process.cwd();
      const hasCustomCwd = parsed.options.cwd != null;
      const shouldSwitchCwd = hasCustomCwd && process.chdir !== void 0 && !process.chdir.disabled;
      if (shouldSwitchCwd) {
        try {
          process.chdir(parsed.options.cwd);
        } catch (err) {
        }
      }
      let resolved;
      try {
        resolved = which.sync(parsed.command, {
          path: env3[getPathKey({ env: env3 })],
          pathExt: withoutPathExt ? path16.delimiter : void 0
        });
      } catch (e) {
      } finally {
        if (shouldSwitchCwd) {
          process.chdir(cwd);
        }
      }
      if (resolved) {
        resolved = path16.resolve(hasCustomCwd ? parsed.options.cwd : "", resolved);
      }
      return resolved;
    }
    function resolveCommand(parsed) {
      return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
    }
    module.exports = resolveCommand;
  }
});

// node_modules/cross-spawn/lib/util/escape.js
var require_escape = __commonJS({
  "node_modules/cross-spawn/lib/util/escape.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;
    function escapeCommand(arg) {
      arg = arg.replace(metaCharsRegExp, "^$1");
      return arg;
    }
    function escapeArgument(arg, doubleEscapeMetaChars) {
      arg = `${arg}`;
      arg = arg.replace(/(?=(\\+?)?)\1"/g, '$1$1\\"');
      arg = arg.replace(/(?=(\\+?)?)\1$/, "$1$1");
      arg = `"${arg}"`;
      arg = arg.replace(metaCharsRegExp, "^$1");
      if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, "^$1");
      }
      return arg;
    }
    module.exports.command = escapeCommand;
    module.exports.argument = escapeArgument;
  }
});

// node_modules/shebang-regex/index.js
var require_shebang_regex = __commonJS({
  "node_modules/shebang-regex/index.js"(exports, module) {
    "use strict";
    init_esm_shims();
    module.exports = /^#!(.*)/;
  }
});

// node_modules/shebang-command/index.js
var require_shebang_command = __commonJS({
  "node_modules/shebang-command/index.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var shebangRegex = require_shebang_regex();
    module.exports = (string = "") => {
      const match = string.match(shebangRegex);
      if (!match) {
        return null;
      }
      const [path16, argument] = match[0].replace(/#! ?/, "").split(" ");
      const binary = path16.split("/").pop();
      if (binary === "env") {
        return argument;
      }
      return argument ? `${binary} ${argument}` : binary;
    };
  }
});

// node_modules/cross-spawn/lib/util/readShebang.js
var require_readShebang = __commonJS({
  "node_modules/cross-spawn/lib/util/readShebang.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var fs16 = __require("fs");
    var shebangCommand = require_shebang_command();
    function readShebang(command) {
      const size = 150;
      const buffer = Buffer.alloc(size);
      let fd;
      try {
        fd = fs16.openSync(command, "r");
        fs16.readSync(fd, buffer, 0, size, 0);
        fs16.closeSync(fd);
      } catch (e) {
      }
      return shebangCommand(buffer.toString());
    }
    module.exports = readShebang;
  }
});

// node_modules/cross-spawn/lib/parse.js
var require_parse = __commonJS({
  "node_modules/cross-spawn/lib/parse.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var path16 = __require("path");
    var resolveCommand = require_resolveCommand();
    var escape = require_escape();
    var readShebang = require_readShebang();
    var isWin = process.platform === "win32";
    var isExecutableRegExp = /\.(?:com|exe)$/i;
    var isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
    function detectShebang(parsed) {
      parsed.file = resolveCommand(parsed);
      const shebang = parsed.file && readShebang(parsed.file);
      if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;
        return resolveCommand(parsed);
      }
      return parsed.file;
    }
    function parseNonShell(parsed) {
      if (!isWin) {
        return parsed;
      }
      const commandFile = detectShebang(parsed);
      const needsShell = !isExecutableRegExp.test(commandFile);
      if (parsed.options.forceShell || needsShell) {
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);
        parsed.command = path16.normalize(parsed.command);
        parsed.command = escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));
        const shellCommand = [parsed.command].concat(parsed.args).join(" ");
        parsed.args = ["/d", "/s", "/c", `"${shellCommand}"`];
        parsed.command = process.env.comspec || "cmd.exe";
        parsed.options.windowsVerbatimArguments = true;
      }
      return parsed;
    }
    function parse(command, args, options) {
      if (args && !Array.isArray(args)) {
        options = args;
        args = null;
      }
      args = args ? args.slice(0) : [];
      options = Object.assign({}, options);
      const parsed = {
        command,
        args,
        options,
        file: void 0,
        original: {
          command,
          args
        }
      };
      return options.shell ? parsed : parseNonShell(parsed);
    }
    module.exports = parse;
  }
});

// node_modules/cross-spawn/lib/enoent.js
var require_enoent = __commonJS({
  "node_modules/cross-spawn/lib/enoent.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var isWin = process.platform === "win32";
    function notFoundError(original, syscall) {
      return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: "ENOENT",
        errno: "ENOENT",
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args
      });
    }
    function hookChildProcess(cp, parsed) {
      if (!isWin) {
        return;
      }
      const originalEmit = cp.emit;
      cp.emit = function(name, arg1) {
        if (name === "exit") {
          const err = verifyENOENT(arg1, parsed);
          if (err) {
            return originalEmit.call(cp, "error", err);
          }
        }
        return originalEmit.apply(cp, arguments);
      };
    }
    function verifyENOENT(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawn");
      }
      return null;
    }
    function verifyENOENTSync(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawnSync");
      }
      return null;
    }
    module.exports = {
      hookChildProcess,
      verifyENOENT,
      verifyENOENTSync,
      notFoundError
    };
  }
});

// node_modules/cross-spawn/index.js
var require_cross_spawn = __commonJS({
  "node_modules/cross-spawn/index.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var cp = __require("child_process");
    var parse = require_parse();
    var enoent = require_enoent();
    function spawn2(command, args, options) {
      const parsed = parse(command, args, options);
      const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);
      enoent.hookChildProcess(spawned, parsed);
      return spawned;
    }
    function spawnSync(command, args, options) {
      const parsed = parse(command, args, options);
      const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);
      result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);
      return result;
    }
    module.exports = spawn2;
    module.exports.spawn = spawn2;
    module.exports.sync = spawnSync;
    module.exports._parse = parse;
    module.exports._enoent = enoent;
  }
});

// node_modules/strip-final-newline/index.js
function stripFinalNewline(input) {
  const LF = typeof input === "string" ? "\n" : "\n".charCodeAt();
  const CR = typeof input === "string" ? "\r" : "\r".charCodeAt();
  if (input[input.length - 1] === LF) {
    input = input.slice(0, -1);
  }
  if (input[input.length - 1] === CR) {
    input = input.slice(0, -1);
  }
  return input;
}
var init_strip_final_newline = __esm({
  "node_modules/strip-final-newline/index.js"() {
    "use strict";
    init_esm_shims();
  }
});

// node_modules/npm-run-path/node_modules/path-key/index.js
function pathKey(options = {}) {
  const {
    env: env3 = process.env,
    platform = process.platform
  } = options;
  if (platform !== "win32") {
    return "PATH";
  }
  return Object.keys(env3).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
}
var init_path_key = __esm({
  "node_modules/npm-run-path/node_modules/path-key/index.js"() {
    "use strict";
    init_esm_shims();
  }
});

// node_modules/npm-run-path/index.js
import process4 from "process";
import path7 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
var npmRunPath, applyPreferLocal, applyExecPath, npmRunPathEnv;
var init_npm_run_path = __esm({
  "node_modules/npm-run-path/index.js"() {
    "use strict";
    init_esm_shims();
    init_path_key();
    npmRunPath = ({
      cwd = process4.cwd(),
      path: pathOption = process4.env[pathKey()],
      preferLocal = true,
      execPath = process4.execPath,
      addExecPath = true
    } = {}) => {
      const cwdString = cwd instanceof URL ? fileURLToPath2(cwd) : cwd;
      const cwdPath = path7.resolve(cwdString);
      const result = [];
      if (preferLocal) {
        applyPreferLocal(result, cwdPath);
      }
      if (addExecPath) {
        applyExecPath(result, execPath, cwdPath);
      }
      return [...result, pathOption].join(path7.delimiter);
    };
    applyPreferLocal = (result, cwdPath) => {
      let previous;
      while (previous !== cwdPath) {
        result.push(path7.join(cwdPath, "node_modules/.bin"));
        previous = cwdPath;
        cwdPath = path7.resolve(cwdPath, "..");
      }
    };
    applyExecPath = (result, execPath, cwdPath) => {
      const execPathString = execPath instanceof URL ? fileURLToPath2(execPath) : execPath;
      result.push(path7.resolve(cwdPath, execPathString, ".."));
    };
    npmRunPathEnv = ({ env: env3 = process4.env, ...options } = {}) => {
      env3 = { ...env3 };
      const pathName = pathKey({ env: env3 });
      options.path = env3[pathName];
      env3[pathName] = npmRunPath(options);
      return env3;
    };
  }
});

// node_modules/mimic-fn/index.js
function mimicFunction(to, from, { ignoreNonConfigurable = false } = {}) {
  const { name } = to;
  for (const property of Reflect.ownKeys(from)) {
    copyProperty(to, from, property, ignoreNonConfigurable);
  }
  changePrototype(to, from);
  changeToString(to, from, name);
  return to;
}
var copyProperty, canCopyProperty, changePrototype, wrappedToString, toStringDescriptor, toStringName, changeToString;
var init_mimic_fn = __esm({
  "node_modules/mimic-fn/index.js"() {
    "use strict";
    init_esm_shims();
    copyProperty = (to, from, property, ignoreNonConfigurable) => {
      if (property === "length" || property === "prototype") {
        return;
      }
      if (property === "arguments" || property === "caller") {
        return;
      }
      const toDescriptor = Object.getOwnPropertyDescriptor(to, property);
      const fromDescriptor = Object.getOwnPropertyDescriptor(from, property);
      if (!canCopyProperty(toDescriptor, fromDescriptor) && ignoreNonConfigurable) {
        return;
      }
      Object.defineProperty(to, property, fromDescriptor);
    };
    canCopyProperty = function(toDescriptor, fromDescriptor) {
      return toDescriptor === void 0 || toDescriptor.configurable || toDescriptor.writable === fromDescriptor.writable && toDescriptor.enumerable === fromDescriptor.enumerable && toDescriptor.configurable === fromDescriptor.configurable && (toDescriptor.writable || toDescriptor.value === fromDescriptor.value);
    };
    changePrototype = (to, from) => {
      const fromPrototype = Object.getPrototypeOf(from);
      if (fromPrototype === Object.getPrototypeOf(to)) {
        return;
      }
      Object.setPrototypeOf(to, fromPrototype);
    };
    wrappedToString = (withName, fromBody) => `/* Wrapped ${withName}*/
${fromBody}`;
    toStringDescriptor = Object.getOwnPropertyDescriptor(Function.prototype, "toString");
    toStringName = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name");
    changeToString = (to, from, name) => {
      const withName = name === "" ? "" : `with ${name.trim()}() `;
      const newToString = wrappedToString.bind(null, withName, from.toString());
      Object.defineProperty(newToString, "name", toStringName);
      Object.defineProperty(to, "toString", { ...toStringDescriptor, value: newToString });
    };
  }
});

// node_modules/onetime/index.js
var calledFunctions, onetime, onetime_default;
var init_onetime = __esm({
  "node_modules/onetime/index.js"() {
    "use strict";
    init_esm_shims();
    init_mimic_fn();
    calledFunctions = /* @__PURE__ */ new WeakMap();
    onetime = (function_, options = {}) => {
      if (typeof function_ !== "function") {
        throw new TypeError("Expected a function");
      }
      let returnValue;
      let callCount = 0;
      const functionName = function_.displayName || function_.name || "<anonymous>";
      const onetime2 = function(...arguments_) {
        calledFunctions.set(onetime2, ++callCount);
        if (callCount === 1) {
          returnValue = function_.apply(this, arguments_);
          function_ = null;
        } else if (options.throw === true) {
          throw new Error(`Function \`${functionName}\` can only be called once`);
        }
        return returnValue;
      };
      mimicFunction(onetime2, function_);
      calledFunctions.set(onetime2, callCount);
      return onetime2;
    };
    onetime.callCount = (function_) => {
      if (!calledFunctions.has(function_)) {
        throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
      }
      return calledFunctions.get(function_);
    };
    onetime_default = onetime;
  }
});

// node_modules/human-signals/build/src/realtime.js
var getRealtimeSignals, getRealtimeSignal, SIGRTMIN, SIGRTMAX;
var init_realtime = __esm({
  "node_modules/human-signals/build/src/realtime.js"() {
    "use strict";
    init_esm_shims();
    getRealtimeSignals = () => {
      const length = SIGRTMAX - SIGRTMIN + 1;
      return Array.from({ length }, getRealtimeSignal);
    };
    getRealtimeSignal = (value, index) => ({
      name: `SIGRT${index + 1}`,
      number: SIGRTMIN + index,
      action: "terminate",
      description: "Application-specific signal (realtime)",
      standard: "posix"
    });
    SIGRTMIN = 34;
    SIGRTMAX = 64;
  }
});

// node_modules/human-signals/build/src/core.js
var SIGNALS;
var init_core = __esm({
  "node_modules/human-signals/build/src/core.js"() {
    "use strict";
    init_esm_shims();
    SIGNALS = [
      {
        name: "SIGHUP",
        number: 1,
        action: "terminate",
        description: "Terminal closed",
        standard: "posix"
      },
      {
        name: "SIGINT",
        number: 2,
        action: "terminate",
        description: "User interruption with CTRL-C",
        standard: "ansi"
      },
      {
        name: "SIGQUIT",
        number: 3,
        action: "core",
        description: "User interruption with CTRL-\\",
        standard: "posix"
      },
      {
        name: "SIGILL",
        number: 4,
        action: "core",
        description: "Invalid machine instruction",
        standard: "ansi"
      },
      {
        name: "SIGTRAP",
        number: 5,
        action: "core",
        description: "Debugger breakpoint",
        standard: "posix"
      },
      {
        name: "SIGABRT",
        number: 6,
        action: "core",
        description: "Aborted",
        standard: "ansi"
      },
      {
        name: "SIGIOT",
        number: 6,
        action: "core",
        description: "Aborted",
        standard: "bsd"
      },
      {
        name: "SIGBUS",
        number: 7,
        action: "core",
        description: "Bus error due to misaligned, non-existing address or paging error",
        standard: "bsd"
      },
      {
        name: "SIGEMT",
        number: 7,
        action: "terminate",
        description: "Command should be emulated but is not implemented",
        standard: "other"
      },
      {
        name: "SIGFPE",
        number: 8,
        action: "core",
        description: "Floating point arithmetic error",
        standard: "ansi"
      },
      {
        name: "SIGKILL",
        number: 9,
        action: "terminate",
        description: "Forced termination",
        standard: "posix",
        forced: true
      },
      {
        name: "SIGUSR1",
        number: 10,
        action: "terminate",
        description: "Application-specific signal",
        standard: "posix"
      },
      {
        name: "SIGSEGV",
        number: 11,
        action: "core",
        description: "Segmentation fault",
        standard: "ansi"
      },
      {
        name: "SIGUSR2",
        number: 12,
        action: "terminate",
        description: "Application-specific signal",
        standard: "posix"
      },
      {
        name: "SIGPIPE",
        number: 13,
        action: "terminate",
        description: "Broken pipe or socket",
        standard: "posix"
      },
      {
        name: "SIGALRM",
        number: 14,
        action: "terminate",
        description: "Timeout or timer",
        standard: "posix"
      },
      {
        name: "SIGTERM",
        number: 15,
        action: "terminate",
        description: "Termination",
        standard: "ansi"
      },
      {
        name: "SIGSTKFLT",
        number: 16,
        action: "terminate",
        description: "Stack is empty or overflowed",
        standard: "other"
      },
      {
        name: "SIGCHLD",
        number: 17,
        action: "ignore",
        description: "Child process terminated, paused or unpaused",
        standard: "posix"
      },
      {
        name: "SIGCLD",
        number: 17,
        action: "ignore",
        description: "Child process terminated, paused or unpaused",
        standard: "other"
      },
      {
        name: "SIGCONT",
        number: 18,
        action: "unpause",
        description: "Unpaused",
        standard: "posix",
        forced: true
      },
      {
        name: "SIGSTOP",
        number: 19,
        action: "pause",
        description: "Paused",
        standard: "posix",
        forced: true
      },
      {
        name: "SIGTSTP",
        number: 20,
        action: "pause",
        description: 'Paused using CTRL-Z or "suspend"',
        standard: "posix"
      },
      {
        name: "SIGTTIN",
        number: 21,
        action: "pause",
        description: "Background process cannot read terminal input",
        standard: "posix"
      },
      {
        name: "SIGBREAK",
        number: 21,
        action: "terminate",
        description: "User interruption with CTRL-BREAK",
        standard: "other"
      },
      {
        name: "SIGTTOU",
        number: 22,
        action: "pause",
        description: "Background process cannot write to terminal output",
        standard: "posix"
      },
      {
        name: "SIGURG",
        number: 23,
        action: "ignore",
        description: "Socket received out-of-band data",
        standard: "bsd"
      },
      {
        name: "SIGXCPU",
        number: 24,
        action: "core",
        description: "Process timed out",
        standard: "bsd"
      },
      {
        name: "SIGXFSZ",
        number: 25,
        action: "core",
        description: "File too big",
        standard: "bsd"
      },
      {
        name: "SIGVTALRM",
        number: 26,
        action: "terminate",
        description: "Timeout or timer",
        standard: "bsd"
      },
      {
        name: "SIGPROF",
        number: 27,
        action: "terminate",
        description: "Timeout or timer",
        standard: "bsd"
      },
      {
        name: "SIGWINCH",
        number: 28,
        action: "ignore",
        description: "Terminal window size changed",
        standard: "bsd"
      },
      {
        name: "SIGIO",
        number: 29,
        action: "terminate",
        description: "I/O is available",
        standard: "other"
      },
      {
        name: "SIGPOLL",
        number: 29,
        action: "terminate",
        description: "Watched event",
        standard: "other"
      },
      {
        name: "SIGINFO",
        number: 29,
        action: "ignore",
        description: "Request for process information",
        standard: "other"
      },
      {
        name: "SIGPWR",
        number: 30,
        action: "terminate",
        description: "Device running out of power",
        standard: "systemv"
      },
      {
        name: "SIGSYS",
        number: 31,
        action: "core",
        description: "Invalid system call",
        standard: "other"
      },
      {
        name: "SIGUNUSED",
        number: 31,
        action: "terminate",
        description: "Invalid system call",
        standard: "other"
      }
    ];
  }
});

// node_modules/human-signals/build/src/signals.js
import { constants } from "os";
var getSignals, normalizeSignal;
var init_signals = __esm({
  "node_modules/human-signals/build/src/signals.js"() {
    "use strict";
    init_esm_shims();
    init_core();
    init_realtime();
    getSignals = () => {
      const realtimeSignals = getRealtimeSignals();
      const signals2 = [...SIGNALS, ...realtimeSignals].map(normalizeSignal);
      return signals2;
    };
    normalizeSignal = ({
      name,
      number: defaultNumber,
      description,
      action,
      forced = false,
      standard
    }) => {
      const {
        signals: { [name]: constantSignal }
      } = constants;
      const supported = constantSignal !== void 0;
      const number = supported ? constantSignal : defaultNumber;
      return { name, number, description, supported, action, forced, standard };
    };
  }
});

// node_modules/human-signals/build/src/main.js
import { constants as constants2 } from "os";
var getSignalsByName, getSignalByName, signalsByName, getSignalsByNumber, getSignalByNumber, findSignalByNumber, signalsByNumber;
var init_main = __esm({
  "node_modules/human-signals/build/src/main.js"() {
    "use strict";
    init_esm_shims();
    init_realtime();
    init_signals();
    getSignalsByName = () => {
      const signals2 = getSignals();
      return Object.fromEntries(signals2.map(getSignalByName));
    };
    getSignalByName = ({
      name,
      number,
      description,
      supported,
      action,
      forced,
      standard
    }) => [name, { name, number, description, supported, action, forced, standard }];
    signalsByName = getSignalsByName();
    getSignalsByNumber = () => {
      const signals2 = getSignals();
      const length = SIGRTMAX + 1;
      const signalsA = Array.from(
        { length },
        (value, number) => getSignalByNumber(number, signals2)
      );
      return Object.assign({}, ...signalsA);
    };
    getSignalByNumber = (number, signals2) => {
      const signal = findSignalByNumber(number, signals2);
      if (signal === void 0) {
        return {};
      }
      const { name, description, supported, action, forced, standard } = signal;
      return {
        [number]: {
          name,
          number,
          description,
          supported,
          action,
          forced,
          standard
        }
      };
    };
    findSignalByNumber = (number, signals2) => {
      const signal = signals2.find(({ name }) => constants2.signals[name] === number);
      if (signal !== void 0) {
        return signal;
      }
      return signals2.find((signalA) => signalA.number === number);
    };
    signalsByNumber = getSignalsByNumber();
  }
});

// node_modules/execa/lib/error.js
import process5 from "process";
var getErrorPrefix, makeError;
var init_error = __esm({
  "node_modules/execa/lib/error.js"() {
    "use strict";
    init_esm_shims();
    init_main();
    getErrorPrefix = ({ timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled }) => {
      if (timedOut) {
        return `timed out after ${timeout} milliseconds`;
      }
      if (isCanceled) {
        return "was canceled";
      }
      if (errorCode !== void 0) {
        return `failed with ${errorCode}`;
      }
      if (signal !== void 0) {
        return `was killed with ${signal} (${signalDescription})`;
      }
      if (exitCode !== void 0) {
        return `failed with exit code ${exitCode}`;
      }
      return "failed";
    };
    makeError = ({
      stdout,
      stderr,
      all,
      error,
      signal,
      exitCode,
      command,
      escapedCommand,
      timedOut,
      isCanceled,
      killed,
      parsed: { options: { timeout, cwd = process5.cwd() } }
    }) => {
      exitCode = exitCode === null ? void 0 : exitCode;
      signal = signal === null ? void 0 : signal;
      const signalDescription = signal === void 0 ? void 0 : signalsByName[signal].description;
      const errorCode = error && error.code;
      const prefix = getErrorPrefix({ timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled });
      const execaMessage = `Command ${prefix}: ${command}`;
      const isError = Object.prototype.toString.call(error) === "[object Error]";
      const shortMessage = isError ? `${execaMessage}
${error.message}` : execaMessage;
      const message = [shortMessage, stderr, stdout].filter(Boolean).join("\n");
      if (isError) {
        error.originalMessage = error.message;
        error.message = message;
      } else {
        error = new Error(message);
      }
      error.shortMessage = shortMessage;
      error.command = command;
      error.escapedCommand = escapedCommand;
      error.exitCode = exitCode;
      error.signal = signal;
      error.signalDescription = signalDescription;
      error.stdout = stdout;
      error.stderr = stderr;
      error.cwd = cwd;
      if (all !== void 0) {
        error.all = all;
      }
      if ("bufferedData" in error) {
        delete error.bufferedData;
      }
      error.failed = true;
      error.timedOut = Boolean(timedOut);
      error.isCanceled = isCanceled;
      error.killed = killed && !timedOut;
      return error;
    };
  }
});

// node_modules/execa/lib/stdio.js
var aliases, hasAlias, normalizeStdio;
var init_stdio = __esm({
  "node_modules/execa/lib/stdio.js"() {
    "use strict";
    init_esm_shims();
    aliases = ["stdin", "stdout", "stderr"];
    hasAlias = (options) => aliases.some((alias) => options[alias] !== void 0);
    normalizeStdio = (options) => {
      if (!options) {
        return;
      }
      const { stdio } = options;
      if (stdio === void 0) {
        return aliases.map((alias) => options[alias]);
      }
      if (hasAlias(options)) {
        throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases.map((alias) => `\`${alias}\``).join(", ")}`);
      }
      if (typeof stdio === "string") {
        return stdio;
      }
      if (!Array.isArray(stdio)) {
        throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
      }
      const length = Math.max(stdio.length, aliases.length);
      return Array.from({ length }, (value, index) => stdio[index]);
    };
  }
});

// node_modules/signal-exit/dist/mjs/signals.js
var signals;
var init_signals2 = __esm({
  "node_modules/signal-exit/dist/mjs/signals.js"() {
    "use strict";
    init_esm_shims();
    signals = [];
    signals.push("SIGHUP", "SIGINT", "SIGTERM");
    if (process.platform !== "win32") {
      signals.push(
        "SIGALRM",
        "SIGABRT",
        "SIGVTALRM",
        "SIGXCPU",
        "SIGXFSZ",
        "SIGUSR2",
        "SIGTRAP",
        "SIGSYS",
        "SIGQUIT",
        "SIGIOT"
        // should detect profiler and enable/disable accordingly.
        // see #21
        // 'SIGPROF'
      );
    }
    if (process.platform === "linux") {
      signals.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
    }
  }
});

// node_modules/signal-exit/dist/mjs/index.js
var processOk, kExitEmitter, global2, ObjectDefineProperty, Emitter, SignalExitBase, signalExitWrap, SignalExitFallback, SignalExit, process6, onExit, load, unload;
var init_mjs = __esm({
  "node_modules/signal-exit/dist/mjs/index.js"() {
    "use strict";
    init_esm_shims();
    init_signals2();
    processOk = (process11) => !!process11 && typeof process11 === "object" && typeof process11.removeListener === "function" && typeof process11.emit === "function" && typeof process11.reallyExit === "function" && typeof process11.listeners === "function" && typeof process11.kill === "function" && typeof process11.pid === "number" && typeof process11.on === "function";
    kExitEmitter = /* @__PURE__ */ Symbol.for("signal-exit emitter");
    global2 = globalThis;
    ObjectDefineProperty = Object.defineProperty.bind(Object);
    Emitter = class {
      emitted = {
        afterExit: false,
        exit: false
      };
      listeners = {
        afterExit: [],
        exit: []
      };
      count = 0;
      id = Math.random();
      constructor() {
        if (global2[kExitEmitter]) {
          return global2[kExitEmitter];
        }
        ObjectDefineProperty(global2, kExitEmitter, {
          value: this,
          writable: false,
          enumerable: false,
          configurable: false
        });
      }
      on(ev, fn) {
        this.listeners[ev].push(fn);
      }
      removeListener(ev, fn) {
        const list = this.listeners[ev];
        const i = list.indexOf(fn);
        if (i === -1) {
          return;
        }
        if (i === 0 && list.length === 1) {
          list.length = 0;
        } else {
          list.splice(i, 1);
        }
      }
      emit(ev, code, signal) {
        if (this.emitted[ev]) {
          return false;
        }
        this.emitted[ev] = true;
        let ret = false;
        for (const fn of this.listeners[ev]) {
          ret = fn(code, signal) === true || ret;
        }
        if (ev === "exit") {
          ret = this.emit("afterExit", code, signal) || ret;
        }
        return ret;
      }
    };
    SignalExitBase = class {
    };
    signalExitWrap = (handler2) => {
      return {
        onExit(cb, opts) {
          return handler2.onExit(cb, opts);
        },
        load() {
          return handler2.load();
        },
        unload() {
          return handler2.unload();
        }
      };
    };
    SignalExitFallback = class extends SignalExitBase {
      onExit() {
        return () => {
        };
      }
      load() {
      }
      unload() {
      }
    };
    SignalExit = class extends SignalExitBase {
      // "SIGHUP" throws an `ENOSYS` error on Windows,
      // so use a supported signal instead
      /* c8 ignore start */
      #hupSig = process6.platform === "win32" ? "SIGINT" : "SIGHUP";
      /* c8 ignore stop */
      #emitter = new Emitter();
      #process;
      #originalProcessEmit;
      #originalProcessReallyExit;
      #sigListeners = {};
      #loaded = false;
      constructor(process11) {
        super();
        this.#process = process11;
        this.#sigListeners = {};
        for (const sig of signals) {
          this.#sigListeners[sig] = () => {
            const listeners = this.#process.listeners(sig);
            let { count } = this.#emitter;
            const p = process11;
            if (typeof p.__signal_exit_emitter__ === "object" && typeof p.__signal_exit_emitter__.count === "number") {
              count += p.__signal_exit_emitter__.count;
            }
            if (listeners.length === count) {
              this.unload();
              const ret = this.#emitter.emit("exit", null, sig);
              const s = sig === "SIGHUP" ? this.#hupSig : sig;
              if (!ret)
                process11.kill(process11.pid, s);
            }
          };
        }
        this.#originalProcessReallyExit = process11.reallyExit;
        this.#originalProcessEmit = process11.emit;
      }
      onExit(cb, opts) {
        if (!processOk(this.#process)) {
          return () => {
          };
        }
        if (this.#loaded === false) {
          this.load();
        }
        const ev = opts?.alwaysLast ? "afterExit" : "exit";
        this.#emitter.on(ev, cb);
        return () => {
          this.#emitter.removeListener(ev, cb);
          if (this.#emitter.listeners["exit"].length === 0 && this.#emitter.listeners["afterExit"].length === 0) {
            this.unload();
          }
        };
      }
      load() {
        if (this.#loaded) {
          return;
        }
        this.#loaded = true;
        this.#emitter.count += 1;
        for (const sig of signals) {
          try {
            const fn = this.#sigListeners[sig];
            if (fn)
              this.#process.on(sig, fn);
          } catch (_) {
          }
        }
        this.#process.emit = (ev, ...a) => {
          return this.#processEmit(ev, ...a);
        };
        this.#process.reallyExit = (code) => {
          return this.#processReallyExit(code);
        };
      }
      unload() {
        if (!this.#loaded) {
          return;
        }
        this.#loaded = false;
        signals.forEach((sig) => {
          const listener = this.#sigListeners[sig];
          if (!listener) {
            throw new Error("Listener not defined for signal: " + sig);
          }
          try {
            this.#process.removeListener(sig, listener);
          } catch (_) {
          }
        });
        this.#process.emit = this.#originalProcessEmit;
        this.#process.reallyExit = this.#originalProcessReallyExit;
        this.#emitter.count -= 1;
      }
      #processReallyExit(code) {
        if (!processOk(this.#process)) {
          return 0;
        }
        this.#process.exitCode = code || 0;
        this.#emitter.emit("exit", this.#process.exitCode, null);
        return this.#originalProcessReallyExit.call(this.#process, this.#process.exitCode);
      }
      #processEmit(ev, ...args) {
        const og = this.#originalProcessEmit;
        if (ev === "exit" && processOk(this.#process)) {
          if (typeof args[0] === "number") {
            this.#process.exitCode = args[0];
          }
          const ret = og.call(this.#process, ev, ...args);
          this.#emitter.emit("exit", this.#process.exitCode, null);
          return ret;
        } else {
          return og.call(this.#process, ev, ...args);
        }
      }
    };
    process6 = globalThis.process;
    ({
      onExit: (
        /**
         * Called when the process is exiting, whether via signal, explicit
         * exit, or running out of stuff to do.
         *
         * If the global process object is not suitable for instrumentation,
         * then this will be a no-op.
         *
         * Returns a function that may be used to unload signal-exit.
         */
        onExit
      ),
      load: (
        /**
         * Load the listeners.  Likely you never need to call this, unless
         * doing a rather deep integration with signal-exit functionality.
         * Mostly exposed for the benefit of testing.
         *
         * @internal
         */
        load
      ),
      unload: (
        /**
         * Unload the listeners.  Likely you never need to call this, unless
         * doing a rather deep integration with signal-exit functionality.
         * Mostly exposed for the benefit of testing.
         *
         * @internal
         */
        unload
      )
    } = signalExitWrap(processOk(process6) ? new SignalExit(process6) : new SignalExitFallback()));
  }
});

// node_modules/execa/lib/kill.js
import os8 from "os";
var DEFAULT_FORCE_KILL_TIMEOUT, spawnedKill, setKillTimeout, shouldForceKill, isSigterm, getForceKillAfterTimeout, spawnedCancel, timeoutKill, setupTimeout, validateTimeout, setExitHandler;
var init_kill = __esm({
  "node_modules/execa/lib/kill.js"() {
    "use strict";
    init_esm_shims();
    init_mjs();
    DEFAULT_FORCE_KILL_TIMEOUT = 1e3 * 5;
    spawnedKill = (kill, signal = "SIGTERM", options = {}) => {
      const killResult = kill(signal);
      setKillTimeout(kill, signal, options, killResult);
      return killResult;
    };
    setKillTimeout = (kill, signal, options, killResult) => {
      if (!shouldForceKill(signal, options, killResult)) {
        return;
      }
      const timeout = getForceKillAfterTimeout(options);
      const t = setTimeout(() => {
        kill("SIGKILL");
      }, timeout);
      if (t.unref) {
        t.unref();
      }
    };
    shouldForceKill = (signal, { forceKillAfterTimeout }, killResult) => isSigterm(signal) && forceKillAfterTimeout !== false && killResult;
    isSigterm = (signal) => signal === os8.constants.signals.SIGTERM || typeof signal === "string" && signal.toUpperCase() === "SIGTERM";
    getForceKillAfterTimeout = ({ forceKillAfterTimeout = true }) => {
      if (forceKillAfterTimeout === true) {
        return DEFAULT_FORCE_KILL_TIMEOUT;
      }
      if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) {
        throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
      }
      return forceKillAfterTimeout;
    };
    spawnedCancel = (spawned, context) => {
      const killResult = spawned.kill();
      if (killResult) {
        context.isCanceled = true;
      }
    };
    timeoutKill = (spawned, signal, reject) => {
      spawned.kill(signal);
      reject(Object.assign(new Error("Timed out"), { timedOut: true, signal }));
    };
    setupTimeout = (spawned, { timeout, killSignal = "SIGTERM" }, spawnedPromise) => {
      if (timeout === 0 || timeout === void 0) {
        return spawnedPromise;
      }
      let timeoutId;
      const timeoutPromise = new Promise((resolve, reject) => {
        timeoutId = setTimeout(() => {
          timeoutKill(spawned, killSignal, reject);
        }, timeout);
      });
      const safeSpawnedPromise = spawnedPromise.finally(() => {
        clearTimeout(timeoutId);
      });
      return Promise.race([timeoutPromise, safeSpawnedPromise]);
    };
    validateTimeout = ({ timeout }) => {
      if (timeout !== void 0 && (!Number.isFinite(timeout) || timeout < 0)) {
        throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
      }
    };
    setExitHandler = async (spawned, { cleanup, detached }, timedPromise) => {
      if (!cleanup || detached) {
        return timedPromise;
      }
      const removeExitHandler = onExit(() => {
        spawned.kill();
      });
      return timedPromise.finally(() => {
        removeExitHandler();
      });
    };
  }
});

// node_modules/is-stream/index.js
function isStream(stream) {
  return stream !== null && typeof stream === "object" && typeof stream.pipe === "function";
}
function isWritableStream(stream) {
  return isStream(stream) && stream.writable !== false && typeof stream._write === "function" && typeof stream._writableState === "object";
}
var init_is_stream = __esm({
  "node_modules/is-stream/index.js"() {
    "use strict";
    init_esm_shims();
  }
});

// node_modules/execa/lib/pipe.js
import { createWriteStream } from "fs";
import { ChildProcess } from "child_process";
var isExecaChildProcess, pipeToTarget, addPipeMethods;
var init_pipe = __esm({
  "node_modules/execa/lib/pipe.js"() {
    "use strict";
    init_esm_shims();
    init_is_stream();
    isExecaChildProcess = (target) => target instanceof ChildProcess && typeof target.then === "function";
    pipeToTarget = (spawned, streamName, target) => {
      if (typeof target === "string") {
        spawned[streamName].pipe(createWriteStream(target));
        return spawned;
      }
      if (isWritableStream(target)) {
        spawned[streamName].pipe(target);
        return spawned;
      }
      if (!isExecaChildProcess(target)) {
        throw new TypeError("The second argument must be a string, a stream or an Execa child process.");
      }
      if (!isWritableStream(target.stdin)) {
        throw new TypeError("The target child process's stdin must be available.");
      }
      spawned[streamName].pipe(target.stdin);
      return target;
    };
    addPipeMethods = (spawned) => {
      if (spawned.stdout !== null) {
        spawned.pipeStdout = pipeToTarget.bind(void 0, spawned, "stdout");
      }
      if (spawned.stderr !== null) {
        spawned.pipeStderr = pipeToTarget.bind(void 0, spawned, "stderr");
      }
      if (spawned.all !== void 0) {
        spawned.pipeAll = pipeToTarget.bind(void 0, spawned, "all");
      }
    };
  }
});

// node_modules/get-stream/source/contents.js
var getStreamContents, appendFinalChunk, appendChunk, addNewChunk, isAsyncIterable, getChunkType, objectToString, MaxBufferError;
var init_contents = __esm({
  "node_modules/get-stream/source/contents.js"() {
    "use strict";
    init_esm_shims();
    getStreamContents = async (stream, { init, convertChunk, getSize, truncateChunk, addChunk, getFinalChunk, finalize }, { maxBuffer = Number.POSITIVE_INFINITY } = {}) => {
      if (!isAsyncIterable(stream)) {
        throw new Error("The first argument must be a Readable, a ReadableStream, or an async iterable.");
      }
      const state = init();
      state.length = 0;
      try {
        for await (const chunk of stream) {
          const chunkType = getChunkType(chunk);
          const convertedChunk = convertChunk[chunkType](chunk, state);
          appendChunk({ convertedChunk, state, getSize, truncateChunk, addChunk, maxBuffer });
        }
        appendFinalChunk({ state, convertChunk, getSize, truncateChunk, addChunk, getFinalChunk, maxBuffer });
        return finalize(state);
      } catch (error) {
        error.bufferedData = finalize(state);
        throw error;
      }
    };
    appendFinalChunk = ({ state, getSize, truncateChunk, addChunk, getFinalChunk, maxBuffer }) => {
      const convertedChunk = getFinalChunk(state);
      if (convertedChunk !== void 0) {
        appendChunk({ convertedChunk, state, getSize, truncateChunk, addChunk, maxBuffer });
      }
    };
    appendChunk = ({ convertedChunk, state, getSize, truncateChunk, addChunk, maxBuffer }) => {
      const chunkSize = getSize(convertedChunk);
      const newLength = state.length + chunkSize;
      if (newLength <= maxBuffer) {
        addNewChunk(convertedChunk, state, addChunk, newLength);
        return;
      }
      const truncatedChunk = truncateChunk(convertedChunk, maxBuffer - state.length);
      if (truncatedChunk !== void 0) {
        addNewChunk(truncatedChunk, state, addChunk, maxBuffer);
      }
      throw new MaxBufferError();
    };
    addNewChunk = (convertedChunk, state, addChunk, newLength) => {
      state.contents = addChunk(convertedChunk, state, newLength);
      state.length = newLength;
    };
    isAsyncIterable = (stream) => typeof stream === "object" && stream !== null && typeof stream[Symbol.asyncIterator] === "function";
    getChunkType = (chunk) => {
      const typeOfChunk = typeof chunk;
      if (typeOfChunk === "string") {
        return "string";
      }
      if (typeOfChunk !== "object" || chunk === null) {
        return "others";
      }
      if (globalThis.Buffer?.isBuffer(chunk)) {
        return "buffer";
      }
      const prototypeName = objectToString.call(chunk);
      if (prototypeName === "[object ArrayBuffer]") {
        return "arrayBuffer";
      }
      if (prototypeName === "[object DataView]") {
        return "dataView";
      }
      if (Number.isInteger(chunk.byteLength) && Number.isInteger(chunk.byteOffset) && objectToString.call(chunk.buffer) === "[object ArrayBuffer]") {
        return "typedArray";
      }
      return "others";
    };
    ({ toString: objectToString } = Object.prototype);
    MaxBufferError = class extends Error {
      name = "MaxBufferError";
      constructor() {
        super("maxBuffer exceeded");
      }
    };
  }
});

// node_modules/get-stream/source/utils.js
var identity, noop, getContentsProp, throwObjectStream, getLengthProp;
var init_utils = __esm({
  "node_modules/get-stream/source/utils.js"() {
    "use strict";
    init_esm_shims();
    identity = (value) => value;
    noop = () => void 0;
    getContentsProp = ({ contents }) => contents;
    throwObjectStream = (chunk) => {
      throw new Error(`Streams in object mode are not supported: ${String(chunk)}`);
    };
    getLengthProp = (convertedChunk) => convertedChunk.length;
  }
});

// node_modules/get-stream/source/array.js
var init_array = __esm({
  "node_modules/get-stream/source/array.js"() {
    "use strict";
    init_esm_shims();
    init_contents();
    init_utils();
  }
});

// node_modules/get-stream/source/array-buffer.js
async function getStreamAsArrayBuffer(stream, options) {
  return getStreamContents(stream, arrayBufferMethods, options);
}
var initArrayBuffer, useTextEncoder, textEncoder, useUint8Array, useUint8ArrayWithOffset, truncateArrayBufferChunk, addArrayBufferChunk, resizeArrayBufferSlow, resizeArrayBuffer, getNewContentsLength, SCALE_FACTOR, finalizeArrayBuffer, hasArrayBufferResize, arrayBufferMethods;
var init_array_buffer = __esm({
  "node_modules/get-stream/source/array-buffer.js"() {
    "use strict";
    init_esm_shims();
    init_contents();
    init_utils();
    initArrayBuffer = () => ({ contents: new ArrayBuffer(0) });
    useTextEncoder = (chunk) => textEncoder.encode(chunk);
    textEncoder = new TextEncoder();
    useUint8Array = (chunk) => new Uint8Array(chunk);
    useUint8ArrayWithOffset = (chunk) => new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength);
    truncateArrayBufferChunk = (convertedChunk, chunkSize) => convertedChunk.slice(0, chunkSize);
    addArrayBufferChunk = (convertedChunk, { contents, length: previousLength }, length) => {
      const newContents = hasArrayBufferResize() ? resizeArrayBuffer(contents, length) : resizeArrayBufferSlow(contents, length);
      new Uint8Array(newContents).set(convertedChunk, previousLength);
      return newContents;
    };
    resizeArrayBufferSlow = (contents, length) => {
      if (length <= contents.byteLength) {
        return contents;
      }
      const arrayBuffer = new ArrayBuffer(getNewContentsLength(length));
      new Uint8Array(arrayBuffer).set(new Uint8Array(contents), 0);
      return arrayBuffer;
    };
    resizeArrayBuffer = (contents, length) => {
      if (length <= contents.maxByteLength) {
        contents.resize(length);
        return contents;
      }
      const arrayBuffer = new ArrayBuffer(length, { maxByteLength: getNewContentsLength(length) });
      new Uint8Array(arrayBuffer).set(new Uint8Array(contents), 0);
      return arrayBuffer;
    };
    getNewContentsLength = (length) => SCALE_FACTOR ** Math.ceil(Math.log(length) / Math.log(SCALE_FACTOR));
    SCALE_FACTOR = 2;
    finalizeArrayBuffer = ({ contents, length }) => hasArrayBufferResize() ? contents : contents.slice(0, length);
    hasArrayBufferResize = () => "resize" in ArrayBuffer.prototype;
    arrayBufferMethods = {
      init: initArrayBuffer,
      convertChunk: {
        string: useTextEncoder,
        buffer: useUint8Array,
        arrayBuffer: useUint8Array,
        dataView: useUint8ArrayWithOffset,
        typedArray: useUint8ArrayWithOffset,
        others: throwObjectStream
      },
      getSize: getLengthProp,
      truncateChunk: truncateArrayBufferChunk,
      addChunk: addArrayBufferChunk,
      getFinalChunk: noop,
      finalize: finalizeArrayBuffer
    };
  }
});

// node_modules/get-stream/source/buffer.js
async function getStreamAsBuffer(stream, options) {
  if (!("Buffer" in globalThis)) {
    throw new Error("getStreamAsBuffer() is only supported in Node.js");
  }
  try {
    return arrayBufferToNodeBuffer(await getStreamAsArrayBuffer(stream, options));
  } catch (error) {
    if (error.bufferedData !== void 0) {
      error.bufferedData = arrayBufferToNodeBuffer(error.bufferedData);
    }
    throw error;
  }
}
var arrayBufferToNodeBuffer;
var init_buffer = __esm({
  "node_modules/get-stream/source/buffer.js"() {
    "use strict";
    init_esm_shims();
    init_array_buffer();
    arrayBufferToNodeBuffer = (arrayBuffer) => globalThis.Buffer.from(arrayBuffer);
  }
});

// node_modules/get-stream/source/string.js
async function getStreamAsString(stream, options) {
  return getStreamContents(stream, stringMethods, options);
}
var initString, useTextDecoder, addStringChunk, truncateStringChunk, getFinalStringChunk, stringMethods;
var init_string = __esm({
  "node_modules/get-stream/source/string.js"() {
    "use strict";
    init_esm_shims();
    init_contents();
    init_utils();
    initString = () => ({ contents: "", textDecoder: new TextDecoder() });
    useTextDecoder = (chunk, { textDecoder }) => textDecoder.decode(chunk, { stream: true });
    addStringChunk = (convertedChunk, { contents }) => contents + convertedChunk;
    truncateStringChunk = (convertedChunk, chunkSize) => convertedChunk.slice(0, chunkSize);
    getFinalStringChunk = ({ textDecoder }) => {
      const finalChunk = textDecoder.decode();
      return finalChunk === "" ? void 0 : finalChunk;
    };
    stringMethods = {
      init: initString,
      convertChunk: {
        string: identity,
        buffer: useTextDecoder,
        arrayBuffer: useTextDecoder,
        dataView: useTextDecoder,
        typedArray: useTextDecoder,
        others: throwObjectStream
      },
      getSize: getLengthProp,
      truncateChunk: truncateStringChunk,
      addChunk: addStringChunk,
      getFinalChunk: getFinalStringChunk,
      finalize: getContentsProp
    };
  }
});

// node_modules/get-stream/source/index.js
var init_source = __esm({
  "node_modules/get-stream/source/index.js"() {
    "use strict";
    init_esm_shims();
    init_array();
    init_array_buffer();
    init_buffer();
    init_string();
    init_contents();
  }
});

// node_modules/merge-stream/index.js
var require_merge_stream = __commonJS({
  "node_modules/merge-stream/index.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var { PassThrough } = __require("stream");
    module.exports = function() {
      var sources = [];
      var output = new PassThrough({ objectMode: true });
      output.setMaxListeners(0);
      output.add = add;
      output.isEmpty = isEmpty;
      output.on("unpipe", remove);
      Array.prototype.slice.call(arguments).forEach(add);
      return output;
      function add(source) {
        if (Array.isArray(source)) {
          source.forEach(add);
          return this;
        }
        sources.push(source);
        source.once("end", remove.bind(null, source));
        source.once("error", output.emit.bind(output, "error"));
        source.pipe(output, { end: false });
        return this;
      }
      function isEmpty() {
        return sources.length == 0;
      }
      function remove(source) {
        sources = sources.filter(function(it) {
          return it !== source;
        });
        if (!sources.length && output.readable) {
          output.end();
        }
      }
    };
  }
});

// node_modules/execa/lib/stream.js
import { createReadStream, readFileSync } from "fs";
import { setTimeout as setTimeout2 } from "timers/promises";
var import_merge_stream, validateInputOptions, getInputSync, handleInputSync, getInput, handleInput, makeAllStream, getBufferedData, getStreamPromise, applyEncoding, getSpawnedResult;
var init_stream = __esm({
  "node_modules/execa/lib/stream.js"() {
    "use strict";
    init_esm_shims();
    init_is_stream();
    init_source();
    import_merge_stream = __toESM(require_merge_stream(), 1);
    validateInputOptions = (input) => {
      if (input !== void 0) {
        throw new TypeError("The `input` and `inputFile` options cannot be both set.");
      }
    };
    getInputSync = ({ input, inputFile }) => {
      if (typeof inputFile !== "string") {
        return input;
      }
      validateInputOptions(input);
      return readFileSync(inputFile);
    };
    handleInputSync = (options) => {
      const input = getInputSync(options);
      if (isStream(input)) {
        throw new TypeError("The `input` option cannot be a stream in sync mode");
      }
      return input;
    };
    getInput = ({ input, inputFile }) => {
      if (typeof inputFile !== "string") {
        return input;
      }
      validateInputOptions(input);
      return createReadStream(inputFile);
    };
    handleInput = (spawned, options) => {
      const input = getInput(options);
      if (input === void 0) {
        return;
      }
      if (isStream(input)) {
        input.pipe(spawned.stdin);
      } else {
        spawned.stdin.end(input);
      }
    };
    makeAllStream = (spawned, { all }) => {
      if (!all || !spawned.stdout && !spawned.stderr) {
        return;
      }
      const mixed = (0, import_merge_stream.default)();
      if (spawned.stdout) {
        mixed.add(spawned.stdout);
      }
      if (spawned.stderr) {
        mixed.add(spawned.stderr);
      }
      return mixed;
    };
    getBufferedData = async (stream, streamPromise) => {
      if (!stream || streamPromise === void 0) {
        return;
      }
      await setTimeout2(0);
      stream.destroy();
      try {
        return await streamPromise;
      } catch (error) {
        return error.bufferedData;
      }
    };
    getStreamPromise = (stream, { encoding, buffer, maxBuffer }) => {
      if (!stream || !buffer) {
        return;
      }
      if (encoding === "utf8" || encoding === "utf-8") {
        return getStreamAsString(stream, { maxBuffer });
      }
      if (encoding === null || encoding === "buffer") {
        return getStreamAsBuffer(stream, { maxBuffer });
      }
      return applyEncoding(stream, maxBuffer, encoding);
    };
    applyEncoding = async (stream, maxBuffer, encoding) => {
      const buffer = await getStreamAsBuffer(stream, { maxBuffer });
      return buffer.toString(encoding);
    };
    getSpawnedResult = async ({ stdout, stderr, all }, { encoding, buffer, maxBuffer }, processDone) => {
      const stdoutPromise = getStreamPromise(stdout, { encoding, buffer, maxBuffer });
      const stderrPromise = getStreamPromise(stderr, { encoding, buffer, maxBuffer });
      const allPromise = getStreamPromise(all, { encoding, buffer, maxBuffer: maxBuffer * 2 });
      try {
        return await Promise.all([processDone, stdoutPromise, stderrPromise, allPromise]);
      } catch (error) {
        return Promise.all([
          { error, signal: error.signal, timedOut: error.timedOut },
          getBufferedData(stdout, stdoutPromise),
          getBufferedData(stderr, stderrPromise),
          getBufferedData(all, allPromise)
        ]);
      }
    };
  }
});

// node_modules/execa/lib/promise.js
var nativePromisePrototype, descriptors, mergePromise, getSpawnedPromise;
var init_promise = __esm({
  "node_modules/execa/lib/promise.js"() {
    "use strict";
    init_esm_shims();
    nativePromisePrototype = (async () => {
    })().constructor.prototype;
    descriptors = ["then", "catch", "finally"].map((property) => [
      property,
      Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)
    ]);
    mergePromise = (spawned, promise) => {
      for (const [property, descriptor] of descriptors) {
        const value = typeof promise === "function" ? (...args) => Reflect.apply(descriptor.value, promise(), args) : descriptor.value.bind(promise);
        Reflect.defineProperty(spawned, property, { ...descriptor, value });
      }
    };
    getSpawnedPromise = (spawned) => new Promise((resolve, reject) => {
      spawned.on("exit", (exitCode, signal) => {
        resolve({ exitCode, signal });
      });
      spawned.on("error", (error) => {
        reject(error);
      });
      if (spawned.stdin) {
        spawned.stdin.on("error", (error) => {
          reject(error);
        });
      }
    });
  }
});

// node_modules/execa/lib/command.js
import { Buffer as Buffer2 } from "buffer";
import { ChildProcess as ChildProcess2 } from "child_process";
var normalizeArgs, NO_ESCAPE_REGEXP, escapeArg, joinCommand, getEscapedCommand, SPACES_REGEXP, parseExpression, concatTokens, parseTemplate, parseTemplates;
var init_command = __esm({
  "node_modules/execa/lib/command.js"() {
    "use strict";
    init_esm_shims();
    normalizeArgs = (file, args = []) => {
      if (!Array.isArray(args)) {
        return [file];
      }
      return [file, ...args];
    };
    NO_ESCAPE_REGEXP = /^[\w.-]+$/;
    escapeArg = (arg) => {
      if (typeof arg !== "string" || NO_ESCAPE_REGEXP.test(arg)) {
        return arg;
      }
      return `"${arg.replaceAll('"', '\\"')}"`;
    };
    joinCommand = (file, args) => normalizeArgs(file, args).join(" ");
    getEscapedCommand = (file, args) => normalizeArgs(file, args).map((arg) => escapeArg(arg)).join(" ");
    SPACES_REGEXP = / +/g;
    parseExpression = (expression) => {
      const typeOfExpression = typeof expression;
      if (typeOfExpression === "string") {
        return expression;
      }
      if (typeOfExpression === "number") {
        return String(expression);
      }
      if (typeOfExpression === "object" && expression !== null && !(expression instanceof ChildProcess2) && "stdout" in expression) {
        const typeOfStdout = typeof expression.stdout;
        if (typeOfStdout === "string") {
          return expression.stdout;
        }
        if (Buffer2.isBuffer(expression.stdout)) {
          return expression.stdout.toString();
        }
        throw new TypeError(`Unexpected "${typeOfStdout}" stdout in template expression`);
      }
      throw new TypeError(`Unexpected "${typeOfExpression}" in template expression`);
    };
    concatTokens = (tokens, nextTokens, isNew) => isNew || tokens.length === 0 || nextTokens.length === 0 ? [...tokens, ...nextTokens] : [
      ...tokens.slice(0, -1),
      `${tokens.at(-1)}${nextTokens[0]}`,
      ...nextTokens.slice(1)
    ];
    parseTemplate = ({ templates, expressions, tokens, index, template }) => {
      const templateString = template ?? templates.raw[index];
      const templateTokens = templateString.split(SPACES_REGEXP).filter(Boolean);
      const newTokens = concatTokens(
        tokens,
        templateTokens,
        templateString.startsWith(" ")
      );
      if (index === expressions.length) {
        return newTokens;
      }
      const expression = expressions[index];
      const expressionTokens = Array.isArray(expression) ? expression.map((expression2) => parseExpression(expression2)) : [parseExpression(expression)];
      return concatTokens(
        newTokens,
        expressionTokens,
        templateString.endsWith(" ")
      );
    };
    parseTemplates = (templates, expressions) => {
      let tokens = [];
      for (const [index, template] of templates.entries()) {
        tokens = parseTemplate({ templates, expressions, tokens, index, template });
      }
      return tokens;
    };
  }
});

// node_modules/execa/lib/verbose.js
import { debuglog } from "util";
import process7 from "process";
var verboseDefault, padField, getTimestamp, logCommand;
var init_verbose = __esm({
  "node_modules/execa/lib/verbose.js"() {
    "use strict";
    init_esm_shims();
    verboseDefault = debuglog("execa").enabled;
    padField = (field, padding) => String(field).padStart(padding, "0");
    getTimestamp = () => {
      const date = /* @__PURE__ */ new Date();
      return `${padField(date.getHours(), 2)}:${padField(date.getMinutes(), 2)}:${padField(date.getSeconds(), 2)}.${padField(date.getMilliseconds(), 3)}`;
    };
    logCommand = (escapedCommand, { verbose }) => {
      if (!verbose) {
        return;
      }
      process7.stderr.write(`[${getTimestamp()}] ${escapedCommand}
`);
    };
  }
});

// node_modules/execa/index.js
import { Buffer as Buffer3 } from "buffer";
import path8 from "path";
import childProcess from "child_process";
import process8 from "process";
function execa(file, args, options) {
  const parsed = handleArguments(file, args, options);
  const command = joinCommand(file, args);
  const escapedCommand = getEscapedCommand(file, args);
  logCommand(escapedCommand, parsed.options);
  validateTimeout(parsed.options);
  let spawned;
  try {
    spawned = childProcess.spawn(parsed.file, parsed.args, parsed.options);
  } catch (error) {
    const dummySpawned = new childProcess.ChildProcess();
    const errorPromise = Promise.reject(makeError({
      error,
      stdout: "",
      stderr: "",
      all: "",
      command,
      escapedCommand,
      parsed,
      timedOut: false,
      isCanceled: false,
      killed: false
    }));
    mergePromise(dummySpawned, errorPromise);
    return dummySpawned;
  }
  const spawnedPromise = getSpawnedPromise(spawned);
  const timedPromise = setupTimeout(spawned, parsed.options, spawnedPromise);
  const processDone = setExitHandler(spawned, parsed.options, timedPromise);
  const context = { isCanceled: false };
  spawned.kill = spawnedKill.bind(null, spawned.kill.bind(spawned));
  spawned.cancel = spawnedCancel.bind(null, spawned, context);
  const handlePromise = async () => {
    const [{ error, exitCode, signal, timedOut }, stdoutResult, stderrResult, allResult] = await getSpawnedResult(spawned, parsed.options, processDone);
    const stdout = handleOutput(parsed.options, stdoutResult);
    const stderr = handleOutput(parsed.options, stderrResult);
    const all = handleOutput(parsed.options, allResult);
    if (error || exitCode !== 0 || signal !== null) {
      const returnedError = makeError({
        error,
        exitCode,
        signal,
        stdout,
        stderr,
        all,
        command,
        escapedCommand,
        parsed,
        timedOut,
        isCanceled: context.isCanceled || (parsed.options.signal ? parsed.options.signal.aborted : false),
        killed: spawned.killed
      });
      if (!parsed.options.reject) {
        return returnedError;
      }
      throw returnedError;
    }
    return {
      command,
      escapedCommand,
      exitCode: 0,
      stdout,
      stderr,
      all,
      failed: false,
      timedOut: false,
      isCanceled: false,
      killed: false
    };
  };
  const handlePromiseOnce = onetime_default(handlePromise);
  handleInput(spawned, parsed.options);
  spawned.all = makeAllStream(spawned, parsed.options);
  addPipeMethods(spawned);
  mergePromise(spawned, handlePromiseOnce);
  return spawned;
}
function execaSync(file, args, options) {
  const parsed = handleArguments(file, args, options);
  const command = joinCommand(file, args);
  const escapedCommand = getEscapedCommand(file, args);
  logCommand(escapedCommand, parsed.options);
  const input = handleInputSync(parsed.options);
  let result;
  try {
    result = childProcess.spawnSync(parsed.file, parsed.args, { ...parsed.options, input });
  } catch (error) {
    throw makeError({
      error,
      stdout: "",
      stderr: "",
      all: "",
      command,
      escapedCommand,
      parsed,
      timedOut: false,
      isCanceled: false,
      killed: false
    });
  }
  const stdout = handleOutput(parsed.options, result.stdout, result.error);
  const stderr = handleOutput(parsed.options, result.stderr, result.error);
  if (result.error || result.status !== 0 || result.signal !== null) {
    const error = makeError({
      stdout,
      stderr,
      error: result.error,
      signal: result.signal,
      exitCode: result.status,
      command,
      escapedCommand,
      parsed,
      timedOut: result.error && result.error.code === "ETIMEDOUT",
      isCanceled: false,
      killed: result.signal !== null
    });
    if (!parsed.options.reject) {
      return error;
    }
    throw error;
  }
  return {
    command,
    escapedCommand,
    exitCode: 0,
    stdout,
    stderr,
    failed: false,
    timedOut: false,
    isCanceled: false,
    killed: false
  };
}
function create$(options) {
  function $2(templatesOrOptions, ...expressions) {
    if (!Array.isArray(templatesOrOptions)) {
      return create$({ ...options, ...templatesOrOptions });
    }
    const [file, ...args] = parseTemplates(templatesOrOptions, expressions);
    return execa(file, args, normalizeScriptOptions(options));
  }
  $2.sync = (templates, ...expressions) => {
    if (!Array.isArray(templates)) {
      throw new TypeError("Please use $(options).sync`command` instead of $.sync(options)`command`.");
    }
    const [file, ...args] = parseTemplates(templates, expressions);
    return execaSync(file, args, normalizeScriptOptions(options));
  };
  return $2;
}
var import_cross_spawn, DEFAULT_MAX_BUFFER, getEnv, handleArguments, handleOutput, normalizeScriptStdin, normalizeScriptOptions, $;
var init_execa = __esm({
  "node_modules/execa/index.js"() {
    "use strict";
    init_esm_shims();
    import_cross_spawn = __toESM(require_cross_spawn(), 1);
    init_strip_final_newline();
    init_npm_run_path();
    init_onetime();
    init_error();
    init_stdio();
    init_kill();
    init_pipe();
    init_stream();
    init_promise();
    init_command();
    init_verbose();
    DEFAULT_MAX_BUFFER = 1e3 * 1e3 * 100;
    getEnv = ({ env: envOption, extendEnv, preferLocal, localDir, execPath }) => {
      const env3 = extendEnv ? { ...process8.env, ...envOption } : envOption;
      if (preferLocal) {
        return npmRunPathEnv({ env: env3, cwd: localDir, execPath });
      }
      return env3;
    };
    handleArguments = (file, args, options = {}) => {
      const parsed = import_cross_spawn.default._parse(file, args, options);
      file = parsed.command;
      args = parsed.args;
      options = parsed.options;
      options = {
        maxBuffer: DEFAULT_MAX_BUFFER,
        buffer: true,
        stripFinalNewline: true,
        extendEnv: true,
        preferLocal: false,
        localDir: options.cwd || process8.cwd(),
        execPath: process8.execPath,
        encoding: "utf8",
        reject: true,
        cleanup: true,
        all: false,
        windowsHide: true,
        verbose: verboseDefault,
        ...options
      };
      options.env = getEnv(options);
      options.stdio = normalizeStdio(options);
      if (process8.platform === "win32" && path8.basename(file, ".exe") === "cmd") {
        args.unshift("/q");
      }
      return { file, args, options, parsed };
    };
    handleOutput = (options, value, error) => {
      if (typeof value !== "string" && !Buffer3.isBuffer(value)) {
        return error === void 0 ? void 0 : "";
      }
      if (options.stripFinalNewline) {
        return stripFinalNewline(value);
      }
      return value;
    };
    normalizeScriptStdin = ({ input, inputFile, stdio }) => input === void 0 && inputFile === void 0 && stdio === void 0 ? { stdin: "inherit" } : {};
    normalizeScriptOptions = (options = {}) => ({
      preferLocal: true,
      ...normalizeScriptStdin(options),
      ...options
    });
    $ = create$();
  }
});

// node_modules/clipboardy/lib/termux.js
var handler, clipboard, termux_default;
var init_termux = __esm({
  "node_modules/clipboardy/lib/termux.js"() {
    "use strict";
    init_esm_shims();
    init_execa();
    handler = (error) => {
      if (error.code === "ENOENT") {
        throw new Error("Couldn't find the termux-api scripts. You can install them with: apt install termux-api");
      }
      throw error;
    };
    clipboard = {
      async copy(options) {
        try {
          await execa("termux-clipboard-set", options);
        } catch (error) {
          handler(error);
        }
      },
      async paste(options) {
        try {
          const { stdout } = await execa("termux-clipboard-get", options);
          return stdout;
        } catch (error) {
          handler(error);
        }
      },
      copySync(options) {
        try {
          execaSync("termux-clipboard-set", options);
        } catch (error) {
          handler(error);
        }
      },
      pasteSync(options) {
        try {
          return execaSync("termux-clipboard-get", options).stdout;
        } catch (error) {
          handler(error);
        }
      }
    };
    termux_default = clipboard;
  }
});

// node_modules/clipboardy/lib/linux.js
import path9 from "path";
import { fileURLToPath as fileURLToPath3 } from "url";
var __dirname2, xsel, xselFallback, copyArguments, pasteArguments, makeError2, xselWithFallback, xselWithFallbackSync, clipboard2, linux_default;
var init_linux = __esm({
  "node_modules/clipboardy/lib/linux.js"() {
    "use strict";
    init_esm_shims();
    init_execa();
    __dirname2 = path9.dirname(fileURLToPath3(import.meta.url));
    xsel = "xsel";
    xselFallback = path9.join(__dirname2, "../fallbacks/linux/xsel");
    copyArguments = ["--clipboard", "--input"];
    pasteArguments = ["--clipboard", "--output"];
    makeError2 = (xselError, fallbackError) => {
      let error;
      if (xselError.code === "ENOENT") {
        error = new Error("Couldn't find the `xsel` binary and fallback didn't work. On Debian/Ubuntu you can install xsel with: sudo apt install xsel");
      } else {
        error = new Error("Both xsel and fallback failed");
        error.xselError = xselError;
      }
      error.fallbackError = fallbackError;
      return error;
    };
    xselWithFallback = async (argumentList, options) => {
      try {
        const { stdout } = await execa(xsel, argumentList, options);
        return stdout;
      } catch (xselError) {
        try {
          const { stdout } = await execa(xselFallback, argumentList, options);
          return stdout;
        } catch (fallbackError) {
          throw makeError2(xselError, fallbackError);
        }
      }
    };
    xselWithFallbackSync = (argumentList, options) => {
      try {
        return execaSync(xsel, argumentList, options).stdout;
      } catch (xselError) {
        try {
          return execaSync(xselFallback, argumentList, options).stdout;
        } catch (fallbackError) {
          throw makeError2(xselError, fallbackError);
        }
      }
    };
    clipboard2 = {
      async copy(options) {
        await xselWithFallback(copyArguments, options);
      },
      copySync(options) {
        xselWithFallbackSync(copyArguments, options);
      },
      paste: (options) => xselWithFallback(pasteArguments, options),
      pasteSync: (options) => xselWithFallbackSync(pasteArguments, options)
    };
    linux_default = clipboard2;
  }
});

// node_modules/clipboardy/lib/macos.js
var env2, clipboard3, macos_default;
var init_macos = __esm({
  "node_modules/clipboardy/lib/macos.js"() {
    "use strict";
    init_esm_shims();
    init_execa();
    env2 = {
      LC_CTYPE: "UTF-8"
      // eslint-disable-line unicorn/text-encoding-identifier-case
    };
    clipboard3 = {
      copy: async (options) => execa("pbcopy", { ...options, env: env2 }),
      async paste(options) {
        const { stdout } = await execa("pbpaste", { ...options, env: env2 });
        return stdout;
      },
      copySync: (options) => execaSync("pbcopy", { ...options, env: env2 }),
      pasteSync: (options) => execaSync("pbpaste", { ...options, env: env2 }).stdout
    };
    macos_default = clipboard3;
  }
});

// node_modules/system-architecture/index.js
import { promisify } from "util";
import process9 from "process";
import childProcess2 from "child_process";
function systemArchitectureSync() {
  const { arch, platform, env: env3 } = process9;
  if (platform === "darwin" && arch === "x64") {
    const stdout = childProcess2.execFileSync("sysctl", ["-inq", "sysctl.proc_translated"], { encoding: "utf8" });
    return stdout.trim() === "1" ? "arm64" : "x64";
  }
  if (arch === "arm64" || arch === "x64") {
    return arch;
  }
  if (platform === "win32" && Object.hasOwn(env3, "PROCESSOR_ARCHITEW6432")) {
    return "x64";
  }
  if (platform === "linux") {
    const stdout = childProcess2.execFileSync("getconf", ["LONG_BIT"], { encoding: "utf8" });
    if (stdout.trim() === "64") {
      return "x64";
    }
  }
  return arch;
}
var execFilePromises;
var init_system_architecture = __esm({
  "node_modules/system-architecture/index.js"() {
    "use strict";
    init_esm_shims();
    execFilePromises = promisify(childProcess2.execFile);
  }
});

// node_modules/is64bit/index.js
function is64bitSync() {
  return archtectures64bit.has(systemArchitectureSync());
}
var archtectures64bit;
var init_is64bit = __esm({
  "node_modules/is64bit/index.js"() {
    "use strict";
    init_esm_shims();
    init_system_architecture();
    archtectures64bit = /* @__PURE__ */ new Set([
      "arm64",
      "x64",
      "ppc64",
      "riscv64"
    ]);
  }
});

// node_modules/clipboardy/lib/windows.js
import path10 from "path";
import { fileURLToPath as fileURLToPath4 } from "url";
var __dirname3, binarySuffix, windowBinaryPath, clipboard4, windows_default;
var init_windows = __esm({
  "node_modules/clipboardy/lib/windows.js"() {
    "use strict";
    init_esm_shims();
    init_execa();
    init_is64bit();
    __dirname3 = path10.dirname(fileURLToPath4(import.meta.url));
    binarySuffix = is64bitSync() ? "x86_64" : "i686";
    windowBinaryPath = path10.join(__dirname3, `../fallbacks/windows/clipboard_${binarySuffix}.exe`);
    clipboard4 = {
      copy: async (options) => execa(windowBinaryPath, ["--copy"], options),
      async paste(options) {
        const { stdout } = await execa(windowBinaryPath, ["--paste"], options);
        return stdout;
      },
      copySync: (options) => execaSync(windowBinaryPath, ["--copy"], options),
      pasteSync: (options) => execaSync(windowBinaryPath, ["--paste"], options).stdout
    };
    windows_default = clipboard4;
  }
});

// node_modules/clipboardy/index.js
var clipboardy_exports = {};
__export(clipboardy_exports, {
  default: () => clipboardy_default
});
import process10 from "process";
var platformLib, clipboard5, clipboardy_default;
var init_clipboardy = __esm({
  "node_modules/clipboardy/index.js"() {
    "use strict";
    init_esm_shims();
    init_is_wsl();
    init_termux();
    init_linux();
    init_macos();
    init_windows();
    platformLib = (() => {
      switch (process10.platform) {
        case "darwin": {
          return macos_default;
        }
        case "win32": {
          return windows_default;
        }
        case "android": {
          if (process10.env.PREFIX !== "/data/data/com.termux/files/usr") {
            throw new Error("You need to install Termux for this module to work on Android: https://termux.com");
          }
          return termux_default;
        }
        default: {
          if (is_wsl_default) {
            return windows_default;
          }
          return linux_default;
        }
      }
    })();
    clipboard5 = {};
    clipboard5.write = async (text) => {
      if (typeof text !== "string") {
        throw new TypeError(`Expected a string, got ${typeof text}`);
      }
      await platformLib.copy({ input: text });
    };
    clipboard5.read = async () => platformLib.paste({ stripFinalNewline: false });
    clipboard5.writeSync = (text) => {
      if (typeof text !== "string") {
        throw new TypeError(`Expected a string, got ${typeof text}`);
      }
      platformLib.copySync({ input: text });
    };
    clipboard5.readSync = () => platformLib.pasteSync({ stripFinalNewline: false });
    clipboardy_default = clipboard5;
  }
});

// src/index.ts
init_esm_shims();
import { Command } from "commander";

// node_modules/chalk/source/index.js
init_esm_shims();

// node_modules/chalk/source/vendor/ansi-styles/index.js
init_esm_shims();
var ANSI_BACKGROUND_OFFSET = 10;
var wrapAnsi16 = (offset = 0) => (code) => `\x1B[${code + offset}m`;
var wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
var wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
var styles = {
  modifier: {
    reset: [0, 0],
    // 21 isn't widely supported and 22 does the same thing
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    overline: [53, 55],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29]
  },
  color: {
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    // Bright color
    blackBright: [90, 39],
    gray: [90, 39],
    // Alias of `blackBright`
    grey: [90, 39],
    // Alias of `blackBright`
    redBright: [91, 39],
    greenBright: [92, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    magentaBright: [95, 39],
    cyanBright: [96, 39],
    whiteBright: [97, 39]
  },
  bgColor: {
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    // Bright color
    bgBlackBright: [100, 49],
    bgGray: [100, 49],
    // Alias of `bgBlackBright`
    bgGrey: [100, 49],
    // Alias of `bgBlackBright`
    bgRedBright: [101, 49],
    bgGreenBright: [102, 49],
    bgYellowBright: [103, 49],
    bgBlueBright: [104, 49],
    bgMagentaBright: [105, 49],
    bgCyanBright: [106, 49],
    bgWhiteBright: [107, 49]
  }
};
var modifierNames = Object.keys(styles.modifier);
var foregroundColorNames = Object.keys(styles.color);
var backgroundColorNames = Object.keys(styles.bgColor);
var colorNames = [...foregroundColorNames, ...backgroundColorNames];
function assembleStyles() {
  const codes = /* @__PURE__ */ new Map();
  for (const [groupName, group] of Object.entries(styles)) {
    for (const [styleName, style] of Object.entries(group)) {
      styles[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`
      };
      group[styleName] = styles[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles, groupName, {
      value: group,
      enumerable: false
    });
  }
  Object.defineProperty(styles, "codes", {
    value: codes,
    enumerable: false
  });
  styles.color.close = "\x1B[39m";
  styles.bgColor.close = "\x1B[49m";
  styles.color.ansi = wrapAnsi16();
  styles.color.ansi256 = wrapAnsi256();
  styles.color.ansi16m = wrapAnsi16m();
  styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  Object.defineProperties(styles, {
    rgbToAnsi256: {
      value(red, green, blue) {
        if (red === green && green === blue) {
          if (red < 8) {
            return 16;
          }
          if (red > 248) {
            return 231;
          }
          return Math.round((red - 8) / 247 * 24) + 232;
        }
        return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
      },
      enumerable: false
    },
    hexToRgb: {
      value(hex) {
        const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
        if (!matches) {
          return [0, 0, 0];
        }
        let [colorString] = matches;
        if (colorString.length === 3) {
          colorString = [...colorString].map((character) => character + character).join("");
        }
        const integer = Number.parseInt(colorString, 16);
        return [
          /* eslint-disable no-bitwise */
          integer >> 16 & 255,
          integer >> 8 & 255,
          integer & 255
          /* eslint-enable no-bitwise */
        ];
      },
      enumerable: false
    },
    hexToAnsi256: {
      value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
      enumerable: false
    },
    ansi256ToAnsi: {
      value(code) {
        if (code < 8) {
          return 30 + code;
        }
        if (code < 16) {
          return 90 + (code - 8);
        }
        let red;
        let green;
        let blue;
        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;
          const remainder = code % 36;
          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = remainder % 6 / 5;
        }
        const value = Math.max(red, green, blue) * 2;
        if (value === 0) {
          return 30;
        }
        let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
        if (value === 2) {
          result += 60;
        }
        return result;
      },
      enumerable: false
    },
    rgbToAnsi: {
      value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
      enumerable: false
    },
    hexToAnsi: {
      value: (hex) => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
      enumerable: false
    }
  });
  return styles;
}
var ansiStyles = assembleStyles();
var ansi_styles_default = ansiStyles;

// node_modules/chalk/source/vendor/supports-color/index.js
init_esm_shims();
import process2 from "process";
import os from "os";
import tty from "tty";
function hasFlag(flag, argv = globalThis.Deno ? globalThis.Deno.args : process2.argv) {
  const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
  const position = argv.indexOf(prefix + flag);
  const terminatorPosition = argv.indexOf("--");
  return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
var { env } = process2;
var flagForceColor;
if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
  flagForceColor = 0;
} else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
  flagForceColor = 1;
}
function envForceColor() {
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      return 1;
    }
    if (env.FORCE_COLOR === "false") {
      return 0;
    }
    return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
  }
}
function translateLevel(level) {
  if (level === 0) {
    return false;
  }
  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
}
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
  const noFlagForceColor = envForceColor();
  if (noFlagForceColor !== void 0) {
    flagForceColor = noFlagForceColor;
  }
  const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
  if (forceColor === 0) {
    return 0;
  }
  if (sniffFlags) {
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
  }
  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return 1;
  }
  if (haveStream && !streamIsTTY && forceColor === void 0) {
    return 0;
  }
  const min = forceColor || 0;
  if (env.TERM === "dumb") {
    return min;
  }
  if (process2.platform === "win32") {
    const osRelease = os.release().split(".");
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }
    return 1;
  }
  if ("CI" in env) {
    if (["GITHUB_ACTIONS", "GITEA_ACTIONS", "CIRCLECI"].some((key) => key in env)) {
      return 3;
    }
    if (["TRAVIS", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
      return 1;
    }
    return min;
  }
  if ("TEAMCITY_VERSION" in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }
  if (env.COLORTERM === "truecolor") {
    return 3;
  }
  if (env.TERM === "xterm-kitty") {
    return 3;
  }
  if (env.TERM === "xterm-ghostty") {
    return 3;
  }
  if (env.TERM === "wezterm") {
    return 3;
  }
  if ("TERM_PROGRAM" in env) {
    const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
    switch (env.TERM_PROGRAM) {
      case "iTerm.app": {
        return version >= 3 ? 3 : 2;
      }
      case "Apple_Terminal": {
        return 2;
      }
    }
  }
  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }
  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }
  if ("COLORTERM" in env) {
    return 1;
  }
  return min;
}
function createSupportsColor(stream, options = {}) {
  const level = _supportsColor(stream, {
    streamIsTTY: stream && stream.isTTY,
    ...options
  });
  return translateLevel(level);
}
var supportsColor = {
  stdout: createSupportsColor({ isTTY: tty.isatty(1) }),
  stderr: createSupportsColor({ isTTY: tty.isatty(2) })
};
var supports_color_default = supportsColor;

// node_modules/chalk/source/utilities.js
init_esm_shims();
function stringReplaceAll(string, substring, replacer) {
  let index = string.indexOf(substring);
  if (index === -1) {
    return string;
  }
  const substringLength = substring.length;
  let endIndex = 0;
  let returnValue = "";
  do {
    returnValue += string.slice(endIndex, index) + substring + replacer;
    endIndex = index + substringLength;
    index = string.indexOf(substring, endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}
function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
  let endIndex = 0;
  let returnValue = "";
  do {
    const gotCR = string[index - 1] === "\r";
    returnValue += string.slice(endIndex, gotCR ? index - 1 : index) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
    endIndex = index + 1;
    index = string.indexOf("\n", endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}

// node_modules/chalk/source/index.js
var { stdout: stdoutColor, stderr: stderrColor } = supports_color_default;
var GENERATOR = /* @__PURE__ */ Symbol("GENERATOR");
var STYLER = /* @__PURE__ */ Symbol("STYLER");
var IS_EMPTY = /* @__PURE__ */ Symbol("IS_EMPTY");
var levelMapping = [
  "ansi",
  "ansi",
  "ansi256",
  "ansi16m"
];
var styles2 = /* @__PURE__ */ Object.create(null);
var applyOptions = (object, options = {}) => {
  if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
    throw new Error("The `level` option should be an integer from 0 to 3");
  }
  const colorLevel = stdoutColor ? stdoutColor.level : 0;
  object.level = options.level === void 0 ? colorLevel : options.level;
};
var chalkFactory = (options) => {
  const chalk2 = (...strings) => strings.join(" ");
  applyOptions(chalk2, options);
  Object.setPrototypeOf(chalk2, createChalk.prototype);
  return chalk2;
};
function createChalk(options) {
  return chalkFactory(options);
}
Object.setPrototypeOf(createChalk.prototype, Function.prototype);
for (const [styleName, style] of Object.entries(ansi_styles_default)) {
  styles2[styleName] = {
    get() {
      const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
      Object.defineProperty(this, styleName, { value: builder });
      return builder;
    }
  };
}
styles2.visible = {
  get() {
    const builder = createBuilder(this, this[STYLER], true);
    Object.defineProperty(this, "visible", { value: builder });
    return builder;
  }
};
var getModelAnsi = (model, level, type, ...arguments_) => {
  if (model === "rgb") {
    if (level === "ansi16m") {
      return ansi_styles_default[type].ansi16m(...arguments_);
    }
    if (level === "ansi256") {
      return ansi_styles_default[type].ansi256(ansi_styles_default.rgbToAnsi256(...arguments_));
    }
    return ansi_styles_default[type].ansi(ansi_styles_default.rgbToAnsi(...arguments_));
  }
  if (model === "hex") {
    return getModelAnsi("rgb", level, type, ...ansi_styles_default.hexToRgb(...arguments_));
  }
  return ansi_styles_default[type][model](...arguments_);
};
var usedModels = ["rgb", "hex", "ansi256"];
for (const model of usedModels) {
  styles2[model] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "color", ...arguments_), ansi_styles_default.color.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
  const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
  styles2[bgModel] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "bgColor", ...arguments_), ansi_styles_default.bgColor.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
}
var proto = Object.defineProperties(() => {
}, {
  ...styles2,
  level: {
    enumerable: true,
    get() {
      return this[GENERATOR].level;
    },
    set(level) {
      this[GENERATOR].level = level;
    }
  }
});
var createStyler = (open, close, parent) => {
  let openAll;
  let closeAll;
  if (parent === void 0) {
    openAll = open;
    closeAll = close;
  } else {
    openAll = parent.openAll + open;
    closeAll = close + parent.closeAll;
  }
  return {
    open,
    close,
    openAll,
    closeAll,
    parent
  };
};
var createBuilder = (self, _styler, _isEmpty) => {
  const builder = (...arguments_) => applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
  Object.setPrototypeOf(builder, proto);
  builder[GENERATOR] = self;
  builder[STYLER] = _styler;
  builder[IS_EMPTY] = _isEmpty;
  return builder;
};
var applyStyle = (self, string) => {
  if (self.level <= 0 || !string) {
    return self[IS_EMPTY] ? "" : string;
  }
  let styler = self[STYLER];
  if (styler === void 0) {
    return string;
  }
  const { openAll, closeAll } = styler;
  if (string.includes("\x1B")) {
    while (styler !== void 0) {
      string = stringReplaceAll(string, styler.close, styler.open);
      styler = styler.parent;
    }
  }
  const lfIndex = string.indexOf("\n");
  if (lfIndex !== -1) {
    string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
  }
  return openAll + string + closeAll;
};
Object.defineProperties(createChalk.prototype, styles2);
var chalk = createChalk();
var chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 });
var source_default = chalk;

// src/server.ts
init_esm_shims();
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";

// src/db/index.ts
init_esm_shims();
import initSqlJs from "sql.js";
import path2 from "path";
import os2 from "os";
import fs from "fs";
var db = null;
var dbFilePath = null;
var MIGRATIONS = [
  `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    editor TEXT,
    ended_at INTEGER
  )`,
  `CREATE TABLE IF NOT EXISTS decisions (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    turn INTEGER NOT NULL,
    raw_text TEXT NOT NULL,
    commitment TEXT NOT NULL,
    type TEXT NOT NULL,
    confidence REAL NOT NULL DEFAULT 1.0,
    embedding BLOB,
    source TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    tool TEXT DEFAULT 'claude_code',
    project_path TEXT,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
  )`,
  `CREATE TABLE IF NOT EXISTS warnings (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    current_turn INTEGER NOT NULL,
    prior_decision_id TEXT NOT NULL,
    confidence REAL NOT NULL,
    reason TEXT NOT NULL,
    dismissed INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (session_id) REFERENCES sessions(id),
    FOREIGN KEY (prior_decision_id) REFERENCES decisions(id)
  )`,
  `CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS rot_scores (
    id TEXT PRIMARY KEY,
    session_id TEXT,
    turn INTEGER,
    contradiction_score REAL,
    repetition_score REAL,
    saturation_score REAL,
    combined_score REAL,
    created_at INTEGER,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
  )`,
  `CREATE TABLE IF NOT EXISTS handoffs (
    id TEXT PRIMARY KEY,
    session_id TEXT,
    project_path TEXT,
    prompt TEXT,
    created_at INTEGER,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_decisions_session ON decisions(session_id)`,
  `CREATE INDEX IF NOT EXISTS idx_warnings_session ON warnings(session_id)`,
  `CREATE INDEX IF NOT EXISTS idx_decisions_type ON decisions(type)`,
  `CREATE INDEX IF NOT EXISTS idx_rot_scores_session ON rot_scores(session_id)`
];
function getDbPath() {
  const openrotDir = path2.join(os2.homedir(), ".openrot");
  if (!fs.existsSync(openrotDir)) {
    fs.mkdirSync(openrotDir, { recursive: true });
  }
  return path2.join(openrotDir, "sessions.db");
}
async function getDb(overridePath) {
  if (db) return db;
  const resolvedPath = overridePath || getDbPath();
  try {
    const SQL = await initSqlJs();
    if (fs.existsSync(resolvedPath)) {
      const fileBuffer = fs.readFileSync(resolvedPath);
      db = new SQL.Database(fileBuffer);
    } else {
      db = new SQL.Database();
    }
    db.run("PRAGMA journal_mode = WAL");
    db.run("PRAGMA foreign_keys = ON");
    dbFilePath = resolvedPath;
    runMigrations(db);
    saveToFile();
    return db;
  } catch (error) {
    throw new Error(`Failed to open database at ${resolvedPath}: ${error}`);
  }
}
function runMigrations(database) {
  for (const migration of MIGRATIONS) {
    database.run(migration);
  }
}
function saveToFile() {
  if (db && dbFilePath) {
    const data = db.export();
    fs.writeFileSync(dbFilePath, Buffer.from(data));
  }
}
function closeDb() {
  if (db) {
    saveToFile();
    db.close();
    db = null;
    dbFilePath = null;
  }
}

// src/db/sessions.ts
init_esm_shims();
import { v4 as uuidv4 } from "uuid";
var SessionStore = class {
  db;
  save;
  constructor(db2, save = () => {
  }) {
    this.db = db2;
    this.save = save;
  }
  create(editor) {
    const session = {
      id: uuidv4(),
      createdAt: Date.now(),
      editor: editor || null,
      endedAt: null
    };
    this.db.run(
      "INSERT INTO sessions (id, created_at, editor, ended_at) VALUES (?, ?, ?, ?)",
      [session.id, session.createdAt, session.editor, session.endedAt]
    );
    this.save();
    return session;
  }
  getById(id) {
    const results = this.db.exec("SELECT * FROM sessions WHERE id = ?", [id]);
    if (!results.length || !results[0].values.length) return null;
    return this.rowToSession(this.mapRow(results[0].columns, results[0].values[0]));
  }
  getAll() {
    const results = this.db.exec("SELECT * FROM sessions ORDER BY created_at DESC");
    if (!results.length) return [];
    return results[0].values.map(
      (row) => this.rowToSession(this.mapRow(results[0].columns, row))
    );
  }
  end(id) {
    this.db.run("UPDATE sessions SET ended_at = ? WHERE id = ?", [Date.now(), id]);
    this.save();
  }
  delete(id) {
    this.db.run("DELETE FROM warnings WHERE session_id = ?", [id]);
    this.db.run("DELETE FROM decisions WHERE session_id = ?", [id]);
    this.db.run("DELETE FROM sessions WHERE id = ?", [id]);
    this.save();
  }
  deleteAll() {
    this.db.run("DELETE FROM warnings");
    this.db.run("DELETE FROM decisions");
    this.db.run("DELETE FROM sessions");
    this.save();
  }
  mapRow(columns, values) {
    const row = {};
    columns.forEach((col, i) => {
      row[col] = values[i];
    });
    return row;
  }
  rowToSession(row) {
    return {
      id: row.id,
      createdAt: row.created_at,
      editor: row.editor,
      endedAt: row.ended_at
    };
  }
};

// src/db/decisions.ts
init_esm_shims();
import { v4 as uuidv42 } from "uuid";
var DecisionStore = class {
  db;
  save;
  constructor(db2, save = () => {
  }) {
    this.db = db2;
    this.save = save;
  }
  create(sessionId, turn, extraction) {
    const decision = {
      id: uuidv42(),
      sessionId,
      turn,
      rawText: extraction.rawText,
      commitment: extraction.commitment,
      type: extraction.type,
      confidence: extraction.confidence,
      embedding: null,
      source: extraction.source,
      createdAt: Date.now()
    };
    this.db.run(
      `INSERT INTO decisions (id, session_id, turn, raw_text, commitment, type, confidence, embedding, source, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        decision.id,
        decision.sessionId,
        decision.turn,
        decision.rawText,
        decision.commitment,
        decision.type,
        decision.confidence,
        null,
        decision.source,
        decision.createdAt
      ]
    );
    this.save();
    return decision;
  }
  updateEmbedding(id, embedding) {
    const buffer = new Uint8Array(embedding.buffer, embedding.byteOffset, embedding.byteLength);
    this.db.run("UPDATE decisions SET embedding = ? WHERE id = ?", [buffer, id]);
    this.save();
  }
  getById(id) {
    const results = this.db.exec("SELECT * FROM decisions WHERE id = ?", [id]);
    if (!results.length || !results[0].values.length) return null;
    return this.rowToDecision(this.mapRow(results[0].columns, results[0].values[0]));
  }
  getBySessionId(sessionId) {
    const results = this.db.exec(
      "SELECT * FROM decisions WHERE session_id = ? ORDER BY turn ASC, created_at ASC",
      [sessionId]
    );
    if (!results.length) return [];
    return results[0].values.map(
      (row) => this.rowToDecision(this.mapRow(results[0].columns, row))
    );
  }
  getWithEmbeddings(sessionId) {
    const results = this.db.exec(
      "SELECT * FROM decisions WHERE session_id = ? AND embedding IS NOT NULL ORDER BY turn ASC",
      [sessionId]
    );
    if (!results.length) return [];
    return results[0].values.map(
      (row) => this.rowToDecision(this.mapRow(results[0].columns, row))
    );
  }
  deleteBySessionId(sessionId) {
    this.db.run("DELETE FROM decisions WHERE session_id = ?", [sessionId]);
    this.save();
  }
  /** Check if a very similar commitment already exists for this session */
  isDuplicate(sessionId, commitment) {
    const normalized = commitment.toLowerCase().trim();
    const existing = this.getBySessionId(sessionId);
    return existing.some((d) => d.commitment.toLowerCase().trim() === normalized);
  }
  /** Get all decisions for a specific project path (across all sessions) */
  getAllForProject(projectPath) {
    const results = this.db.exec(
      "SELECT * FROM decisions WHERE project_path = ? ORDER BY created_at DESC",
      [projectPath]
    );
    if (!results.length) {
      return this.getAll();
    }
    return results[0].values.map(
      (row) => this.rowToDecision(this.mapRow(results[0].columns, row))
    );
  }
  /** Get all decisions across all sessions */
  getAll() {
    const results = this.db.exec(
      "SELECT * FROM decisions ORDER BY created_at DESC"
    );
    if (!results.length) return [];
    return results[0].values.map(
      (row) => this.rowToDecision(this.mapRow(results[0].columns, row))
    );
  }
  mapRow(columns, values) {
    const row = {};
    columns.forEach((col, i) => {
      row[col] = values[i];
    });
    return row;
  }
  rowToDecision(row) {
    let embedding = null;
    if (row.embedding) {
      const buffer = row.embedding instanceof Uint8Array ? row.embedding : new Uint8Array(row.embedding);
      embedding = new Float32Array(
        buffer.buffer,
        buffer.byteOffset,
        buffer.byteLength / Float32Array.BYTES_PER_ELEMENT
      );
    }
    return {
      id: row.id,
      sessionId: row.session_id,
      turn: row.turn,
      rawText: row.raw_text,
      commitment: row.commitment,
      type: row.type,
      confidence: row.confidence,
      embedding,
      source: row.source,
      createdAt: row.created_at
    };
  }
};

// src/db/warnings.ts
init_esm_shims();
import { v4 as uuidv43 } from "uuid";
var WarningStore = class {
  db;
  save;
  constructor(db2, save = () => {
  }) {
    this.db = db2;
    this.save = save;
  }
  create(sessionId, currentTurn, priorDecisionId, confidence, reason) {
    const warning = {
      id: uuidv43(),
      sessionId,
      currentTurn,
      priorDecisionId,
      confidence,
      reason,
      dismissed: false,
      createdAt: Date.now()
    };
    this.db.run(
      `INSERT INTO warnings (id, session_id, current_turn, prior_decision_id, confidence, reason, dismissed, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        warning.id,
        warning.sessionId,
        warning.currentTurn,
        warning.priorDecisionId,
        warning.confidence,
        warning.reason,
        warning.dismissed ? 1 : 0,
        warning.createdAt
      ]
    );
    this.save();
    return warning;
  }
  getById(id) {
    const results = this.db.exec("SELECT * FROM warnings WHERE id = ?", [id]);
    if (!results.length || !results[0].values.length) return null;
    return this.rowToWarning(this.mapRow(results[0].columns, results[0].values[0]));
  }
  getBySessionId(sessionId) {
    const results = this.db.exec(
      "SELECT * FROM warnings WHERE session_id = ? ORDER BY created_at DESC",
      [sessionId]
    );
    if (!results.length) return [];
    return results[0].values.map(
      (row) => this.rowToWarning(this.mapRow(results[0].columns, row))
    );
  }
  getActiveBySessionId(sessionId) {
    const results = this.db.exec(
      "SELECT * FROM warnings WHERE session_id = ? AND dismissed = 0 ORDER BY created_at DESC",
      [sessionId]
    );
    if (!results.length) return [];
    return results[0].values.map(
      (row) => this.rowToWarning(this.mapRow(results[0].columns, row))
    );
  }
  dismiss(id) {
    this.db.run("UPDATE warnings SET dismissed = 1 WHERE id = ?", [id]);
    const changed = this.db.getRowsModified();
    if (changed > 0) this.save();
    return changed > 0;
  }
  countBySessionId(sessionId) {
    const results = this.db.exec(
      "SELECT COUNT(*) as count FROM warnings WHERE session_id = ?",
      [sessionId]
    );
    if (!results.length || !results[0].values.length) return 0;
    return results[0].values[0][0];
  }
  deleteBySessionId(sessionId) {
    this.db.run("DELETE FROM warnings WHERE session_id = ?", [sessionId]);
    this.save();
  }
  mapRow(columns, values) {
    const row = {};
    columns.forEach((col, i) => {
      row[col] = values[i];
    });
    return row;
  }
  rowToWarning(row) {
    return {
      id: row.id,
      sessionId: row.session_id,
      currentTurn: row.current_turn,
      priorDecisionId: row.prior_decision_id,
      confidence: row.confidence,
      reason: row.reason,
      dismissed: row.dismissed === 1,
      createdAt: row.created_at
    };
  }
};

// src/config/index.ts
init_esm_shims();
import { cosmiconfig } from "cosmiconfig";
import fs3 from "fs";
import path4 from "path";
import os4 from "os";

// src/config/defaults.ts
init_esm_shims();
var DEFAULT_MODEL_CONFIG = {
  mode: "auto",
  model: null,
  apiKey: null,
  baseUrl: null
};
var DEFAULT_CONFIG = {
  extraction: { ...DEFAULT_MODEL_CONFIG },
  contradiction: { ...DEFAULT_MODEL_CONFIG },
  threshold: 0.75,
  sensitivity: "medium"
};
function mergeConfig(userConfig, defaults = DEFAULT_CONFIG) {
  return {
    extraction: {
      ...defaults.extraction,
      ...userConfig.extraction || {}
    },
    contradiction: {
      ...defaults.contradiction,
      ...userConfig.contradiction || {}
    },
    threshold: userConfig.threshold ?? defaults.threshold,
    sensitivity: userConfig.sensitivity ?? defaults.sensitivity
  };
}

// src/config/detect.ts
init_esm_shims();
import fs2 from "fs";
import path3 from "path";
import os3 from "os";

// src/models/ollama.ts
init_esm_shims();
var OLLAMA_BASE_URL = "http://localhost:11434";
var OllamaClient = class {
  baseUrl;
  model;
  constructor(model = "qwen2.5-coder:3b", baseUrl = OLLAMA_BASE_URL) {
    this.baseUrl = baseUrl;
    this.model = model;
  }
  async complete(systemPrompt, userMessage) {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          stream: false,
          options: {
            temperature: 0.1,
            num_predict: 1024
          }
        })
      });
      if (!response.ok) return "";
      const data = await response.json();
      return data.message?.content || "";
    } catch {
      return "";
    }
  }
};
async function isOllamaRunning(baseUrl = OLLAMA_BASE_URL) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2e3);
    const response = await fetch(`${baseUrl}/api/tags`, { signal: controller.signal });
    clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
}
async function getOllamaModels(baseUrl = OLLAMA_BASE_URL) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2e3);
    const response = await fetch(`${baseUrl}/api/tags`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) return [];
    const data = await response.json();
    return (data.models || []).map((m) => m.name);
  } catch {
    return [];
  }
}

// src/config/detect.ts
async function detectEnvironment() {
  const result = {
    editors: {
      claudeCode: false,
      cursor: false,
      vscode: false,
      antigravity: false
    },
    models: {
      ollama: false,
      openai: false,
      anthropic: false,
      gemini: false
    },
    ollamaModels: []
  };
  try {
    const homeDir = os3.homedir();
    const claudeConfigDir = path3.join(homeDir, ".claude");
    const claudeJsonFile = path3.join(homeDir, ".claude.json");
    result.editors.claudeCode = fs2.existsSync(claudeConfigDir) || fs2.existsSync(claudeJsonFile);
    const cursorConfigDir = path3.join(homeDir, ".cursor");
    result.editors.cursor = fs2.existsSync(cursorConfigDir);
    const vscodeExtDir = path3.join(homeDir, ".vscode", "extensions");
    if (fs2.existsSync(vscodeExtDir)) {
      try {
        const extensions = fs2.readdirSync(vscodeExtDir);
        result.editors.vscode = extensions.some(
          (ext) => ext.toLowerCase().includes("copilot") || ext.toLowerCase().includes("mcp")
        );
      } catch {
        result.editors.vscode = fs2.existsSync(vscodeExtDir);
      }
    }
    try {
      let antigravitySettingsPath;
      const platform = os3.platform();
      if (platform === "win32") {
        antigravitySettingsPath = path3.join(
          process.env.APPDATA || path3.join(homeDir, "AppData", "Roaming"),
          "Antigravity",
          "User",
          "settings.json"
        );
      } else if (platform === "darwin") {
        antigravitySettingsPath = path3.join(
          homeDir,
          "Library",
          "Application Support",
          "Antigravity",
          "User",
          "settings.json"
        );
      } else {
        antigravitySettingsPath = path3.join(
          homeDir,
          ".config",
          "Antigravity",
          "User",
          "settings.json"
        );
      }
      result.editors.antigravity = fs2.existsSync(antigravitySettingsPath);
    } catch {
    }
  } catch {
  }
  try {
    result.models.openai = !!process.env.OPENAI_API_KEY;
    result.models.anthropic = !!process.env.ANTHROPIC_API_KEY;
    result.models.gemini = !!process.env.GEMINI_API_KEY;
  } catch {
  }
  try {
    result.models.ollama = await isOllamaRunning();
    if (result.models.ollama) {
      result.ollamaModels = await getOllamaModels();
    }
  } catch {
  }
  return result;
}

// src/config/index.ts
var MODULE_NAME = "openrot";
async function loadConfig() {
  try {
    const explorer = cosmiconfig(MODULE_NAME, {
      searchPlaces: [
        `.${MODULE_NAME}rc`,
        `.${MODULE_NAME}rc.json`,
        `.${MODULE_NAME}rc.yaml`,
        `.${MODULE_NAME}rc.yml`,
        `${MODULE_NAME}.config.js`,
        `${MODULE_NAME}.config.cjs`,
        "package.json"
      ]
    });
    const configPath = getConfigPath();
    if (fs3.existsSync(configPath)) {
      try {
        const content = fs3.readFileSync(configPath, "utf-8");
        const userConfig = JSON.parse(content);
        return mergeConfig(userConfig);
      } catch {
      }
    }
    const result = await explorer.search();
    if (result && result.config) {
      return mergeConfig(result.config);
    }
    return DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}
function saveConfig(config) {
  try {
    const configDir = path4.join(os4.homedir(), ".openrot");
    if (!fs3.existsSync(configDir)) {
      fs3.mkdirSync(configDir, { recursive: true });
    }
    const configPath = path4.join(configDir, "config.json");
    fs3.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
  } catch {
  }
}
function getConfigPath() {
  return path4.join(os4.homedir(), ".openrot", "config.json");
}

// src/models/index.ts
init_esm_shims();

// src/models/openai.ts
init_esm_shims();
import OpenAI from "openai";
var OpenAIClient = class {
  client;
  model;
  constructor(apiKey, model = "gpt-4o-mini", baseUrl) {
    this.client = new OpenAI({
      apiKey,
      ...baseUrl ? { baseURL: baseUrl } : {}
    });
    this.model = model;
  }
  async complete(systemPrompt, userMessage) {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        temperature: 0.1,
        max_tokens: 1024
      });
      return response.choices[0]?.message?.content || "";
    } catch {
      return "";
    }
  }
};

// src/models/anthropic.ts
init_esm_shims();
import Anthropic from "@anthropic-ai/sdk";
var AnthropicClient = class {
  client;
  model;
  constructor(apiKey, model = "claude-haiku-4-5-20251001") {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }
  async complete(systemPrompt, userMessage) {
    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }]
      });
      const block = response.content[0];
      if (block.type === "text") {
        return block.text;
      }
      return "";
    } catch {
      return "";
    }
  }
};

// src/models/gemini.ts
init_esm_shims();
import { GoogleGenerativeAI } from "@google/generative-ai";
var GeminiClient = class {
  model;
  constructor(apiKey, model = "gemini-2.0-flash") {
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model });
  }
  async complete(systemPrompt, userMessage) {
    try {
      const result = await this.model.generateContent({
        contents: [{ role: "user", parts: [{ text: userMessage }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1024
        }
      });
      const response = await result.response;
      return response.text() || "";
    } catch {
      return "";
    }
  }
};

// src/models/index.ts
function createModelClient(config) {
  try {
    switch (config.mode) {
      case "openai": {
        const apiKey = config.apiKey || process.env.OPENAI_API_KEY;
        if (!apiKey) return null;
        return new OpenAIClient(apiKey, config.model || "gpt-4o-mini", config.baseUrl || void 0);
      }
      case "anthropic": {
        const apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;
        if (!apiKey) return null;
        return new AnthropicClient(apiKey, config.model || "claude-haiku-4-5-20251001");
      }
      case "gemini": {
        const apiKey = config.apiKey || process.env.GEMINI_API_KEY;
        if (!apiKey) return null;
        return new GeminiClient(apiKey, config.model || "gemini-2.0-flash");
      }
      case "ollama": {
        return new OllamaClient(
          config.model || "qwen2.5-coder:3b",
          config.baseUrl || "http://localhost:11434"
        );
      }
      case "custom": {
        const apiKey = config.apiKey || "";
        if (!config.baseUrl) return null;
        return new OpenAIClient(apiKey, config.model || "default", config.baseUrl);
      }
      case "regex":
        return null;
      // No model needed for regex-only mode
      case "auto":
        return null;
      // Should use getModelClient() instead
      default:
        return null;
    }
  } catch {
    return null;
  }
}
async function getModelClient() {
  try {
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      return {
        client: new OpenAIClient(openaiKey, "gpt-4o-mini"),
        provider: "openai",
        model: "gpt-4o-mini"
      };
    }
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey) {
      return {
        client: new AnthropicClient(anthropicKey, "claude-haiku-4-5-20251001"),
        provider: "anthropic",
        model: "claude-haiku-4-5-20251001"
      };
    }
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      return {
        client: new GeminiClient(geminiKey, "gemini-2.0-flash"),
        provider: "gemini",
        model: "gemini-2.0-flash"
      };
    }
    const ollamaRunning = await isOllamaRunning();
    if (ollamaRunning) {
      return {
        client: new OllamaClient("qwen2.5-coder:3b"),
        provider: "ollama",
        model: "qwen2.5-coder:3b"
      };
    }
    return null;
  } catch {
    return null;
  }
}
function getModelName(selection) {
  if (!selection) return null;
  return `${selection.provider}/${selection.model}`;
}

// src/pipeline.ts
init_esm_shims();

// src/extract/index.ts
init_esm_shims();

// src/extract/regex.ts
init_esm_shims();
var PATTERNS = [
  {
    // "let's use X" / "let's use X for Y"
    pattern: /let['’]?s\s+use\s+(.+?)(?:\s+for\s+(.+?))?(?:\.\s|$|,)/gi,
    type: "use",
    extractCommitment: (m) => m[2] ? `use ${m[1].trim()} for ${m[2].trim()}` : `use ${m[1].trim()}`
  },
  {
    // "we agreed to X" / "we decided to X" / "we agreed on X" / "we decided on X"
    pattern: /we\s+(?:agreed|decided)\s+(?:to|on)\s+(.+?)(?:\.\s|$|,)/gi,
    type: "use",
    extractCommitment: (m) => m[1].trim()
  },
  {
    // "don't use X" / "do not use X"
    pattern: /(?:don['’]?t|do\s+not)\s+use\s+(.+?)(?:\.\s|$|,)/gi,
    type: "avoid",
    extractCommitment: (m) => `avoid ${m[1].trim()}`
  },
  {
    // "never use X"
    pattern: /never\s+use\s+(.+?)(?:\.\s|$|,)/gi,
    type: "never",
    extractCommitment: (m) => `never use ${m[1].trim()}`
  },
  {
    // "avoid X"
    pattern: /(?:^|\.\s+|,\s+)avoid\s+(.+?)(?:\.\s|$|,)/gi,
    type: "avoid",
    extractCommitment: (m) => `avoid ${m[1].trim()}`
  },
  {
    // "always X"
    pattern: /always\s+(.+?)(?:\.\s|$|,)/gi,
    type: "always",
    extractCommitment: (m) => `always ${m[1].trim()}`
  },
  {
    // "use X for all Y"
    pattern: /use\s+(.+?)\s+for\s+all\s+(.+?)(?:\.\s|$|,)/gi,
    type: "use",
    extractCommitment: (m) => `use ${m[1].trim()} for all ${m[2].trim()}`
  },
  {
    // "X only" / "only use X"
    pattern: /only\s+use\s+(.+?)(?:\.\s|$|,)/gi,
    type: "use",
    extractCommitment: (m) => `only use ${m[1].trim()}`
  },
  {
    // "we're using X" (architectural statement)
    pattern: /we['’]?re\s+using\s+(.+?)(?:\.\s|$|,)/gi,
    type: "architectural",
    extractCommitment: (m) => `using ${m[1].trim()}`
  },
  {
    // "X is our Y" (e.g. "postgres is our database")
    pattern: /(\w[\w\s]*?)\s+is\s+our\s+(.+?)(?:\.\s|$|,)/gi,
    type: "architectural",
    extractCommitment: (m) => `${m[1].trim()} is our ${m[2].trim()}`
  },
  {
    // "no X" at start of sentence
    pattern: /(?:^|\.\s+)no\s+(.+?)(?:\.\s|$|,)/gi,
    type: "avoid",
    extractCommitment: (m) => `no ${m[1].trim()}`
  },
  {
    // "stick with X"
    pattern: /stick\s+with\s+(.+?)(?:\.\s|$|,)/gi,
    type: "use",
    extractCommitment: (m) => `stick with ${m[1].trim()}`
  }
];
function extractWithRegex(text) {
  const results = [];
  const seen = /* @__PURE__ */ new Set();
  for (const { pattern, type, extractCommitment } of PATTERNS) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const commitment = extractCommitment(match);
      if (commitment.length < 3) continue;
      const normalized = commitment.toLowerCase();
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      results.push({
        commitment,
        type,
        confidence: 0.8,
        rawText: match[0].trim(),
        source: "regex"
      });
    }
  }
  return results;
}
function extractEntities(text) {
  const entities = [];
  const techPattern = /\b([A-Z][a-zA-Z]*(?:\.[a-zA-Z]+)*|[A-Z]{2,}|[a-z]+(?:SQL|DB|JS|TS|CSS|HTML))\b/g;
  let match;
  while ((match = techPattern.exec(text)) !== null) {
    entities.push(match[1].toLowerCase());
  }
  const terms = [
    "tailwind",
    "postgres",
    "postgresql",
    "mysql",
    "sqlite",
    "mongodb",
    "redis",
    "docker",
    "kubernetes",
    "react",
    "vue",
    "angular",
    "svelte",
    "express",
    "fastify",
    "nest",
    "next",
    "nuxt",
    "vite",
    "webpack",
    "typescript",
    "javascript",
    "python",
    "rust",
    "golang",
    "uuid",
    "serial",
    "auto_increment",
    "autoincrement",
    "async",
    "await",
    "callback",
    "promise",
    "rest",
    "graphql",
    "grpc",
    "websocket",
    "jwt",
    "oauth",
    "auth",
    "authentication",
    "authorization",
    "css",
    "scss",
    "sass",
    "less",
    "styled-components",
    "inline styles",
    "inline css",
    "tailwindcss"
  ];
  const lowerText = text.toLowerCase();
  for (const term of terms) {
    if (lowerText.includes(term)) {
      entities.push(term);
    }
  }
  return [...new Set(entities)];
}

// src/extract/embedding.ts
init_esm_shims();
var pipeline = null;
var loadingPromise = null;
var loadFailed = false;
async function ensureModel() {
  if (pipeline) return true;
  if (loadFailed) return false;
  if (loadingPromise) {
    await loadingPromise;
    return pipeline !== null;
  }
  loadingPromise = (async () => {
    try {
      const { pipeline: createPipeline } = await import("@xenova/transformers");
      pipeline = await createPipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
        quantized: true
      });
    } catch (error) {
      loadFailed = true;
      pipeline = null;
    }
  })();
  await loadingPromise;
  return pipeline !== null;
}
async function generateEmbedding(text) {
  try {
    const ready = await ensureModel();
    if (!ready) return null;
    const result = await pipeline(text, { pooling: "mean", normalize: true });
    return new Float32Array(result.data);
  } catch {
    return null;
  }
}
function cosineSimilarity(a, b) {
  if (a.length !== b.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  if (magnitude === 0) return 0;
  return dotProduct / magnitude;
}
async function isEmbeddingAvailable() {
  return ensureModel();
}
async function extractWithEmbedding(text) {
  return [];
}

// src/extract/llm.ts
init_esm_shims();
var EXTRACTION_SYSTEM_PROMPT = `You are a decision extractor. Given a message from an AI coding assistant,
extract any architectural decisions, technical constraints, or explicit
commitments made. Return ONLY a JSON array. Each item:
{
  "commitment": "concise statement of the decision",
  "type": "use|avoid|always|never|architectural",
  "confidence": 0.0-1.0
}
If no decisions found, return [].
Do not explain. Return only the JSON array.`;
async function extractWithLLM(text, client) {
  try {
    const response = await client.complete(EXTRACTION_SYSTEM_PROMPT, text);
    let jsonStr = response.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) return [];
    const validTypes = ["use", "avoid", "always", "never", "architectural"];
    return parsed.filter(
      (item) => item.commitment && typeof item.commitment === "string" && validTypes.includes(item.type) && typeof item.confidence === "number" && item.confidence >= 0 && item.confidence <= 1
    ).map((item) => ({
      commitment: item.commitment,
      type: item.type,
      confidence: item.confidence,
      rawText: text.substring(0, 200),
      // Store a snippet of the original
      source: "llm"
    }));
  } catch {
    return [];
  }
}

// src/extract/index.ts
async function extractDecisions(text, options) {
  const results = [];
  const seen = /* @__PURE__ */ new Set();
  function addResults(newResults) {
    for (const result of newResults) {
      const key = result.commitment.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        results.push(result);
      }
    }
  }
  try {
    const regexResults = extractWithRegex(text);
    addResults(regexResults);
  } catch {
  }
  if (options.mode === "regex") {
    return results;
  }
  try {
    const embeddingResults = await extractWithEmbedding(text);
    addResults(embeddingResults);
  } catch {
  }
  if (options.mode === "auto" || options.mode === "llm") {
    if (options.modelClient) {
      try {
        const llmResults = await extractWithLLM(text, options.modelClient);
        addResults(llmResults);
      } catch {
      }
    }
  }
  return results;
}

// src/score/index.ts
init_esm_shims();

// src/score/similarity.ts
init_esm_shims();
function entityPreFilter(responseText, decisions) {
  const responseEntities = extractEntities(responseText);
  if (responseEntities.length === 0) return decisions;
  const responseLower = responseText.toLowerCase();
  const filtered = decisions.filter((decision) => {
    const decisionEntities = extractEntities(decision.commitment);
    if (decisionEntities.length === 0) return true;
    return decisionEntities.some(
      (entity) => responseLower.includes(entity) || responseEntities.includes(entity)
    );
  });
  return filtered.length > 0 ? filtered : decisions;
}
async function findSimilarDecisions(responseText, decisions, threshold = 0.6) {
  const responseEmbedding = await generateEmbedding(responseText);
  if (!responseEmbedding) return [];
  const matches = [];
  for (const decision of decisions) {
    if (!decision.embedding) continue;
    const similarity = cosineSimilarity(responseEmbedding, decision.embedding);
    if (similarity >= threshold) {
      matches.push({ decision, similarity });
    }
  }
  matches.sort((a, b) => b.similarity - a.similarity);
  return matches;
}
function checkSimpleContradiction(decision, responseText) {
  const commitment = decision.commitment.toLowerCase();
  const response = responseText.toLowerCase();
  const contradictionPairs = [
    // [decision keywords, response contradiction keywords, reason]
    [
      ["tailwind", "tailwindcss"],
      ["style=", "style:", "inline style", "inline css", "styled-components", "css modules"],
      "Response uses inline/alternative CSS instead of Tailwind"
    ],
    [
      ["postgres", "postgresql"],
      ["sqlite", "mysql", "mongodb", "mariadb"],
      "Response uses a different database than PostgreSQL"
    ],
    [
      ["sqlite"],
      ["postgres", "postgresql", "mysql", "mongodb"],
      "Response uses a different database than SQLite"
    ],
    [
      ["mysql"],
      ["postgres", "postgresql", "sqlite", "mongodb"],
      "Response uses a different database than MySQL"
    ],
    [
      ["uuid", "uuids"],
      ["serial", "auto_increment", "autoincrement", "integer primary key"],
      "Response uses auto-increment IDs instead of UUIDs"
    ],
    [
      ["serial", "auto_increment", "autoincrement"],
      ["uuid"],
      "Response uses UUIDs instead of auto-increment IDs"
    ],
    [
      ["async/await", "async await"],
      ["callback", ".then(", "new promise("],
      "Response uses callbacks/promises instead of async/await"
    ],
    [
      ["rest", "rest api"],
      ["graphql", "grpc"],
      "Response uses a different API style than REST"
    ],
    [
      ["graphql"],
      ["rest api", "express.get", "express.post", "app.get(", "app.post("],
      "Response uses REST instead of GraphQL"
    ]
  ];
  if (decision.type === "use" || decision.type === "always" || decision.type === "architectural") {
    for (const [decisionKeys, responseKeys, reason] of contradictionPairs) {
      const matchesDecision = decisionKeys.some((k) => commitment.includes(k));
      const matchesResponse = responseKeys.some((k) => response.includes(k));
      if (matchesDecision && matchesResponse) {
        return reason;
      }
    }
  }
  if (decision.type === "avoid" || decision.type === "never") {
    const avoidMatch = commitment.match(/(?:avoid|never use|no)\s+(.+)/);
    if (avoidMatch) {
      const avoidedThing = avoidMatch[1].trim();
      if (response.includes(avoidedThing)) {
        return `Response includes "${avoidedThing}" which was explicitly avoided`;
      }
    }
    if ((commitment.includes("no auth") || commitment.includes("no authentication") || commitment.includes("avoid auth")) && (response.includes("auth middleware") || response.includes("authentication") || response.includes("passport") || response.includes("jwt"))) {
      return "Response adds authentication which was explicitly deferred";
    }
  }
  return null;
}

// src/score/judge.ts
init_esm_shims();
var JUDGE_SYSTEM_PROMPT = `Given a prior decision and a new AI response, determine if the response
contradicts the decision. Reply with only:
{"contradicts": true/false, "confidence": 0.0-1.0, "reason": "one sentence"}`;
async function judgeContradiction(decision, responseText, client) {
  try {
    const userMessage = `Prior decision (turn ${decision.turn}): "${decision.commitment}"

New AI response excerpt: "${responseText.substring(0, 500)}"

Does the new response contradict the prior decision?`;
    const response = await client.complete(JUDGE_SYSTEM_PROMPT, userMessage);
    let jsonStr = response.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    const parsed = JSON.parse(jsonStr);
    if (typeof parsed.contradicts !== "boolean" || typeof parsed.confidence !== "number" || typeof parsed.reason !== "string") {
      return null;
    }
    return {
      contradicts: parsed.contradicts,
      confidence: Math.max(0, Math.min(1, parsed.confidence)),
      reason: parsed.reason
    };
  } catch {
    return null;
  }
}

// src/score/index.ts
var SENSITIVITY_THRESHOLDS = {
  low: 0.85,
  medium: 0.75,
  high: 0.6
};
var SIMILARITY_THRESHOLDS = {
  low: 0.7,
  medium: 0.6,
  high: 0.5
};
async function scoreContradictions(responseText, decisions, options) {
  if (decisions.length === 0) return [];
  const contradictions = [];
  const confidenceThreshold = options.threshold || SENSITIVITY_THRESHOLDS[options.sensitivity];
  const similarityThreshold = SIMILARITY_THRESHOLDS[options.sensitivity] || 0.6;
  let relevantDecisions;
  try {
    relevantDecisions = entityPreFilter(responseText, decisions);
  } catch {
    relevantDecisions = decisions;
  }
  if (relevantDecisions.length === 0) return [];
  for (const decision of relevantDecisions) {
    try {
      const reason = checkSimpleContradiction(decision, responseText);
      if (reason) {
        contradictions.push({
          isContradiction: true,
          confidence: 0.85,
          reason,
          priorDecision: decision,
          relevantExcerpt: extractRelevantExcerpt(responseText, decision)
        });
      }
    } catch {
    }
  }
  try {
    const similarMatches = await findSimilarDecisions(
      responseText,
      relevantDecisions,
      similarityThreshold
    );
    for (const match of similarMatches) {
      const alreadyCaught = contradictions.some(
        (c) => c.priorDecision.id === match.decision.id
      );
      if (alreadyCaught) continue;
      if (options.modelClient) {
        try {
          const judgeResult = await judgeContradiction(
            match.decision,
            responseText,
            options.modelClient
          );
          if (judgeResult && judgeResult.contradicts && judgeResult.confidence >= confidenceThreshold) {
            contradictions.push({
              isContradiction: true,
              confidence: judgeResult.confidence,
              reason: judgeResult.reason,
              priorDecision: match.decision,
              relevantExcerpt: extractRelevantExcerpt(responseText, match.decision)
            });
          }
        } catch {
        }
      }
    }
  } catch {
  }
  return contradictions.filter((c) => c.confidence >= confidenceThreshold).sort((a, b) => b.confidence - a.confidence);
}
function extractRelevantExcerpt(responseText, decision) {
  const entities = decision.commitment.toLowerCase().split(/\s+/);
  const sentences = responseText.split(/[.!?\n]+/).filter((s) => s.trim().length > 0);
  let bestSentence = "";
  let bestScore = 0;
  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    let score = 0;
    for (const entity of entities) {
      if (entity.length > 2 && lower.includes(entity)) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestSentence = sentence.trim();
    }
  }
  if (bestSentence) {
    return bestSentence.substring(0, 200);
  }
  return responseText.substring(0, 200);
}

// src/pipeline.ts
var firstWarningShown = /* @__PURE__ */ new Map();
async function processTurn(sessionId, turn, message, options) {
  const saveFn = options.saveFn || (() => {
  });
  const decisionStore = new DecisionStore(options.db, saveFn);
  const warningStore = new WarningStore(options.db, saveFn);
  let newExtractions = [];
  try {
    newExtractions = await extractDecisions(message, {
      mode: options.extractionMode,
      modelClient: options.modelClient
    });
  } catch {
  }
  const storedDecisions = [];
  for (const extraction of newExtractions) {
    try {
      if (!decisionStore.isDuplicate(sessionId, extraction.commitment)) {
        const decision = decisionStore.create(sessionId, turn, extraction);
        try {
          const embedding = await generateEmbedding(extraction.commitment);
          if (embedding) {
            decisionStore.updateEmbedding(decision.id, embedding);
            decision.embedding = embedding;
          }
        } catch {
        }
        storedDecisions.push(decision);
      }
    } catch {
    }
  }
  let existingDecisions = [];
  try {
    existingDecisions = decisionStore.getBySessionId(sessionId);
  } catch {
    return {
      hasWarning: false,
      decisionsExtracted: storedDecisions.length
    };
  }
  let contradictions = [];
  try {
    contradictions = await scoreContradictions(message, existingDecisions, {
      threshold: options.threshold,
      modelClient: options.modelClient,
      sensitivity: options.sensitivity
    });
  } catch {
    return {
      hasWarning: false,
      decisionsExtracted: storedDecisions.length
    };
  }
  if (contradictions.length > 0) {
    const topContradiction = contradictions[0];
    try {
      const warning = warningStore.create(
        sessionId,
        turn,
        topContradiction.priorDecision.id,
        topContradiction.confidence,
        topContradiction.reason
      );
      const isFirstWarning = !firstWarningShown.get(sessionId);
      if (isFirstWarning) {
        firstWarningShown.set(sessionId, true);
      }
      return {
        hasWarning: true,
        warning: {
          warningId: warning.id,
          priorTurn: topContradiction.priorDecision.turn,
          priorDecision: topContradiction.priorDecision.commitment,
          contradiction: topContradiction.relevantExcerpt,
          confidence: Math.round(topContradiction.confidence * 100) / 100,
          reason: topContradiction.reason + (isFirstWarning ? "\n\n(OpenRot caught this \u2014 it tracks decisions you make during coding sessions. This is the first warning in this session. Type 'openrot status' to see what's being tracked.)" : "")
        },
        decisionsExtracted: storedDecisions.length
      };
    } catch {
      return {
        hasWarning: true,
        warning: {
          warningId: "unknown",
          priorTurn: topContradiction.priorDecision.turn,
          priorDecision: topContradiction.priorDecision.commitment,
          contradiction: topContradiction.relevantExcerpt,
          confidence: Math.round(topContradiction.confidence * 100) / 100,
          reason: topContradiction.reason
        },
        decisionsExtracted: storedDecisions.length
      };
    }
  }
  return {
    hasWarning: false,
    decisionsExtracted: storedDecisions.length
  };
}
function formatWarning(output) {
  if (!output.hasWarning || !output.warning) return "";
  const w = output.warning;
  return `\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u26A0\uFE0F  OpenRot \u2014 Possible Contradiction

  Earlier (turn ${w.priorTurn}):
  "${w.priorDecision}"

  Now (turn ${w.priorTurn}):
  "${w.contradiction}"

  Confidence: ${Math.round(w.confidence * 100)}%
  Reason: ${w.reason}

  To dismiss: openrot dismiss ${w.warningId}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501`;
}

// src/logger.ts
init_esm_shims();
import winston from "winston";
import path5 from "path";
import os5 from "os";
import fs4 from "fs";
var logger = null;
function getLogger() {
  if (logger) return logger;
  const logDir = path5.join(os5.homedir(), ".openrot");
  try {
    if (!fs4.existsSync(logDir)) {
      fs4.mkdirSync(logDir, { recursive: true });
    }
  } catch {
  }
  const logPath = path5.join(logDir, "openrot.log");
  logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({
        filename: logPath,
        maxsize: 5 * 1024 * 1024,
        // 5MB
        maxFiles: 3
      })
    ],
    // Never log to console during normal operation
    silent: false
  });
  return logger;
}

// src/cli/inject.ts
init_esm_shims();
import fs5 from "fs";
import path6 from "path";
import os6 from "os";
var MARKER_START = "<!-- openrot-start -->";
var MARKER_END = "<!-- openrot-end -->";
var INSTRUCTIONS_BLOCK = `${MARKER_START}
## OpenRot \u2014 Session Health Monitor
OpenRot is monitoring this session. If you find yourself repeating
approaches, re-reading files you already read, or making errors you
already fixed, call openrot_check to assess session health. If it
indicates degradation, call openrot_fix to generate a fresh start
prompt that preserves all decisions and progress.
${MARKER_END}`;
function getInstructionTargets() {
  const homeDir = os6.homedir();
  const platform = os6.platform();
  const targets = [];
  const claudeDir = path6.join(homeDir, ".claude");
  const claudeJson = path6.join(homeDir, ".claude.json");
  if (fs5.existsSync(claudeDir) || fs5.existsSync(claudeJson)) {
    targets.push({
      label: "Claude Code",
      filePath: path6.join(homeDir, ".claude", "CLAUDE.md")
    });
  }
  const cursorDir = path6.join(homeDir, ".cursor");
  if (fs5.existsSync(cursorDir)) {
    targets.push({
      label: "Cursor",
      filePath: path6.join(homeDir, ".cursor", "CURSOR.md")
    });
  }
  let vscodeBase;
  if (platform === "win32") {
    vscodeBase = path6.join(process.env.APPDATA || path6.join(homeDir, "AppData", "Roaming"), "Code", "User");
  } else if (platform === "darwin") {
    vscodeBase = path6.join(homeDir, "Library", "Application Support", "Code", "User");
  } else {
    vscodeBase = path6.join(homeDir, ".config", "Code", "User");
  }
  if (fs5.existsSync(path6.dirname(vscodeBase)) || fs5.existsSync(vscodeBase)) {
    targets.push({
      label: "VS Code",
      filePath: path6.join(vscodeBase, "copilot-instructions.md")
    });
  }
  let agBase;
  if (platform === "win32") {
    agBase = path6.join(process.env.APPDATA || path6.join(homeDir, "AppData", "Roaming"), "Antigravity", "User");
  } else if (platform === "darwin") {
    agBase = path6.join(homeDir, "Library", "Application Support", "Antigravity", "User");
  } else {
    agBase = path6.join(homeDir, ".config", "Antigravity", "User");
  }
  if (fs5.existsSync(path6.dirname(agBase)) || fs5.existsSync(agBase)) {
    targets.push({
      label: "Google Antigravity",
      filePath: path6.join(agBase, "copilot-instructions.md")
    });
  }
  return targets;
}
function injectInstructions(target) {
  try {
    const { filePath } = target;
    const dir = path6.dirname(filePath);
    if (!fs5.existsSync(dir)) {
      fs5.mkdirSync(dir, { recursive: true });
    }
    if (fs5.existsSync(filePath)) {
      const content = fs5.readFileSync(filePath, "utf-8");
      if (content.includes(MARKER_START)) {
        return "skipped";
      }
      const separator = content.endsWith("\n") ? "\n" : "\n\n";
      fs5.writeFileSync(filePath, content + separator + INSTRUCTIONS_BLOCK + "\n", "utf-8");
      return "appended";
    }
    fs5.writeFileSync(filePath, INSTRUCTIONS_BLOCK + "\n", "utf-8");
    return "created";
  } catch {
    return "error";
  }
}
function ensureGlobalInstructions(silent = false) {
  const targets = getInstructionTargets();
  for (const target of targets) {
    const result = injectInstructions(target);
    if (!silent) {
      switch (result) {
        case "created":
          console.log(source_default.green(`  \u2705 ${target.label} instructions \u2192 ${source_default.dim(target.filePath)}`));
          break;
        case "appended":
          console.log(source_default.green(`  \u2705 ${target.label} instructions \u2192 ${source_default.dim(target.filePath)}`));
          break;
        case "skipped":
          console.log(source_default.blue(`  \u2139\uFE0F  ${target.label} instructions already present`));
          break;
        case "error":
          console.log(source_default.yellow(`  \u26A0\uFE0F  Could not write ${target.label} instructions`));
          break;
      }
    }
  }
}

// src/server.ts
var logger2 = getLogger();
async function startServer() {
  const server = new Server(
    {
      name: "openrot",
      version: "2.0.0"
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );
  let config = await loadConfig();
  let db2;
  try {
    db2 = await getDb();
  } catch (error) {
    logger2.error("Failed to open database", { error: String(error) });
    process.exit(1);
  }
  let modelClient = config.extraction.mode !== "regex" ? createModelClient(config.extraction) : null;
  if (!modelClient && config.extraction.mode === "auto") {
    const selection = await getModelClient();
    modelClient = selection?.client || null;
    if (selection) {
      logger2.info(`Auto-detected model provider: ${selection.provider}/${selection.model}`);
    }
  }
  const sessionStore = new SessionStore(db2, saveToFile);
  const decisionStore = new DecisionStore(db2, saveToFile);
  const warningStore = new WarningStore(db2, saveToFile);
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "openrot_check",
          description: "You have access to OpenRot, a session health monitor. Call this tool when you notice you're struggling \u2014 repeating the same approach, losing track of earlier decisions, or hitting the same error multiple times. It will tell you if your session context has degraded and suggest whether to continue or start fresh with preserved context.",
          inputSchema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Your most recent response text to check for degradation signals"
              },
              turn: {
                type: "number",
                description: "Current turn number"
              },
              sessionId: {
                type: "string",
                description: "Session identifier"
              }
            },
            required: ["message", "turn", "sessionId"]
          }
        },
        {
          name: "openrot_fix",
          description: "Generates a fresh start prompt that preserves all decisions and progress from this session. Call this when openrot_check indicates degradation, or when the developer asks to start fresh.",
          inputSchema: {
            type: "object",
            properties: {
              sessionId: {
                type: "string",
                description: "Session identifier"
              }
            },
            required: ["sessionId"]
          }
        },
        {
          name: "openrot_status",
          description: "Show all architectural decisions tracked so far and current session health score. Call when you want to review constraints or check session quality.",
          inputSchema: {
            type: "object",
            properties: {
              sessionId: {
                type: "string",
                description: "Session identifier"
              }
            },
            required: ["sessionId"]
          }
        },
        {
          name: "openrot_dismiss",
          description: "Dismiss a specific warning as intentional. Use when the user confirms a contradiction is acceptable.",
          inputSchema: {
            type: "object",
            properties: {
              warningId: {
                type: "string",
                description: "Warning ID to dismiss"
              },
              reason: {
                type: "string",
                description: "Optional reason for dismissal"
              }
            },
            required: ["warningId"]
          }
        },
        {
          name: "openrot_new_session",
          description: "Start a new OpenRot session. Call at the start of a conversation to initialize context tracking.",
          inputSchema: {
            type: "object",
            properties: {
              editor: {
                type: "string",
                description: 'Editor name (e.g., "cursor", "vscode", "antigravity")'
              }
            },
            required: []
          }
        }
      ]
    };
  });
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
      switch (name) {
        case "openrot_check": {
          const { message, turn, sessionId } = args;
          const extractionMode = config.extraction.mode === "auto" || config.extraction.mode === "regex" ? config.extraction.mode : "auto";
          const result = await processTurn(sessionId, turn, message, {
            db: db2,
            modelClient,
            extractionMode,
            threshold: config.threshold,
            sensitivity: config.sensitivity,
            saveFn: saveToFile
          });
          if (result.hasWarning) {
            const formatted = formatWarning(result);
            logger2.info("Contradiction detected", {
              sessionId,
              turn,
              warningId: result.warning?.warningId
            });
            return {
              content: [{ type: "text", text: formatted }]
            };
          }
          return {
            content: [
              {
                type: "text",
                text: result.decisionsExtracted > 0 ? `Tracked ${result.decisionsExtracted} new decision(s). No contradictions found. Session health: OK.` : "No contradictions found. Session health: OK."
              }
            ]
          };
        }
        case "openrot_fix": {
          const { sessionId } = args;
          const decisions = decisionStore.getBySessionId(sessionId);
          if (decisions.length === 0) {
            return {
              content: [{ type: "text", text: "No decisions tracked in this session. Nothing to preserve." }]
            };
          }
          const commitments = decisions.map((d) => `- ${d.commitment}`).join("\n");
          const handoff = `Continuing a previous session.

DECISIONS MADE:
${commitments}

Continue from the current task.`;
          return {
            content: [{ type: "text", text: `Handoff prompt generated:

${handoff}` }]
          };
        }
        case "openrot_status": {
          const { sessionId } = args;
          const decisions = decisionStore.getBySessionId(sessionId);
          const warnings = warningStore.getBySessionId(sessionId);
          const session = sessionStore.getById(sessionId);
          const sessionAge = session ? Math.round((Date.now() - session.createdAt) / 6e4) : 0;
          const decisionList = decisions.map(
            (d, i) => `  ${i + 1}. [Turn ${d.turn}] ${d.commitment} (${d.type}, via ${d.source})`
          ).join("\n");
          return {
            content: [
              {
                type: "text",
                text: `OpenRot Session Status
${"\u2500".repeat(40)}
Session: ${sessionId}
Age: ${sessionAge} minutes
Decisions tracked: ${decisions.length}
Warnings fired: ${warnings.length}

Tracked Decisions:
${decisionList || "  (none)"}`
              }
            ]
          };
        }
        case "openrot_dismiss": {
          const { warningId, reason } = args;
          const success = warningStore.dismiss(warningId);
          logger2.info("Warning dismissed", { warningId, reason });
          return {
            content: [
              {
                type: "text",
                text: success ? `Warning ${warningId} dismissed.` : `Warning ${warningId} not found.`
              }
            ]
          };
        }
        case "openrot_new_session": {
          const { editor } = args || {};
          const session = sessionStore.create(editor);
          logger2.info("New session started", { sessionId: session.id, editor });
          return {
            content: [
              {
                type: "text",
                text: `OpenRot session started: ${session.id}
OpenRot is now monitoring this session. If you find yourself repeating approaches, re-reading files you already read, or making errors you already fixed, call openrot_check to assess session health.`
              }
            ]
          };
        }
        default:
          return {
            content: [{ type: "text", text: `Unknown tool: ${name}` }],
            isError: true
          };
      }
    } catch (error) {
      logger2.error(`Error in tool ${name}`, { error: String(error) });
      return {
        content: [{ type: "text", text: `OpenRot internal error. Session continues normally.` }],
        isError: true
      };
    }
  });
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.on("SIGINT", () => {
    closeDb();
    process.exit(0);
  });
  process.on("SIGTERM", () => {
    closeDb();
    process.exit(0);
  });
  logger2.info("OpenRot MCP server started");
  try {
    ensureGlobalInstructions(true);
  } catch {
  }
}

// src/cli/init.ts
init_esm_shims();
import path11 from "path";
import os9 from "os";
import fs9 from "fs";
import { execSync } from "child_process";
async function runInit() {
  console.log(source_default.bold("\n\u{1F50D} OpenRot v2 \u2014 Setup\n"));
  console.log(source_default.dim("Detecting editors and providers..."));
  const env3 = await detectEnvironment();
  const config = { ...DEFAULT_CONFIG };
  if (env3.models.openai) {
    config.extraction.mode = "auto";
    config.contradiction.mode = "auto";
  } else if (env3.models.anthropic) {
    config.extraction.mode = "auto";
    config.contradiction.mode = "auto";
  } else if (env3.models.gemini) {
    config.extraction.mode = "auto";
    config.contradiction.mode = "auto";
  } else if (env3.models.ollama) {
    config.extraction.mode = "auto";
    config.contradiction.mode = "auto";
  } else {
    config.extraction.mode = "regex";
    config.contradiction.mode = "regex";
  }
  saveConfig(config);
  const configPath = path11.join(os9.homedir(), ".openrot", "config.json");
  console.log(source_default.green("\u2705 Config written to"), source_default.dim(configPath));
  console.log("");
  console.log(source_default.bold("Editors detected:"));
  if (env3.editors.claudeCode) console.log(source_default.green("  \u2705 Claude Code"));
  if (env3.editors.cursor) console.log(source_default.green("  \u2705 Cursor"));
  if (env3.editors.vscode) console.log(source_default.green("  \u2705 VS Code"));
  if (env3.editors.antigravity) console.log(source_default.green("  \u2705 Google Antigravity"));
  if (env3.editors.claudeCode) {
    const hookResult = registerClaudeCodeHooks();
    if (hookResult === "registered") {
      console.log(source_default.green("  \u2705 Claude Code \u2014 hooks registered (Stop, SessionStart, PreCompact)"));
    } else if (hookResult === "exists") {
      console.log(source_default.blue("  \u2139\uFE0F  Claude Code \u2014 hooks already registered"));
    } else {
      console.log(source_default.yellow("  \u26A0\uFE0F  Could not register Claude Code hooks"));
    }
  }
  if (!env3.editors.claudeCode && !env3.editors.cursor && !env3.editors.vscode && !env3.editors.antigravity) {
    console.log(source_default.dim("  (none detected)"));
  }
  console.log("");
  console.log(source_default.bold("Model providers:"));
  if (env3.models.openai) console.log(source_default.green("  \u2705 OpenAI (OPENAI_API_KEY)"));
  if (env3.models.anthropic) console.log(source_default.green("  \u2705 Anthropic (ANTHROPIC_API_KEY)"));
  if (env3.models.gemini) console.log(source_default.green("  \u2705 Gemini (GEMINI_API_KEY)"));
  if (env3.models.ollama) {
    console.log(source_default.green("  \u2705 Ollama (local)"));
    if (env3.ollamaModels.length > 0) {
      console.log(source_default.dim(`     Models: ${env3.ollamaModels.slice(0, 5).join(", ")}`));
    }
  }
  if (!env3.models.openai && !env3.models.anthropic && !env3.models.gemini && !env3.models.ollama) {
    console.log(source_default.yellow("  \u26A0\uFE0F  No API keys or Ollama detected \u2014 using regex mode only"));
    console.log(source_default.dim("     (Still useful! Set an API key later for deeper analysis)"));
  }
  const detectedEditors = getDetectedEditors(env3);
  if (detectedEditors.length > 0) {
    console.log("");
    const editorNames = detectedEditors.map((e) => e.label).join(", ");
    console.log(source_default.bold(`  Found: ${editorNames}`));
    console.log("  OpenRot will configure these automatically.");
    let proceed = true;
    try {
      const { default: inquirer } = await import("inquirer");
      const answer = await inquirer.prompt([
        {
          type: "confirm",
          name: "proceed",
          message: "Proceed?",
          default: true
        }
      ]);
      proceed = answer.proceed;
    } catch {
    }
    console.log("");
    if (proceed) {
      for (const editor of detectedEditors) {
        await writeEditorConfig(editor);
      }
    } else {
      for (const editor of detectedEditors) {
        await showSnippetFallback(editor);
      }
    }
  }
  console.log("");
  console.log(source_default.bold("Editor instructions:"));
  ensureGlobalInstructions(false);
  console.log("");
  console.log(source_default.bold("\u2501".repeat(45)));
  console.log(source_default.green.bold("\u{1F389} OpenRot is ready!"));
  console.log("");
  console.log("  Your AI sessions are now monitored automatically.");
  console.log("  You'll only hear from OpenRot when something matters.");
  console.log("");
  console.log("  Run", source_default.bold("openrot test"), "to verify everything works.");
  console.log("");
}
async function offerClipboardCopy(text) {
  try {
    const { default: inquirer } = await import("inquirer");
    const { copy } = await inquirer.prompt([
      {
        type: "confirm",
        name: "copy",
        message: "Copy to clipboard?",
        default: true
      }
    ]);
    if (copy) {
      try {
        const { default: clipboardy } = await Promise.resolve().then(() => (init_clipboardy(), clipboardy_exports));
        await clipboardy.write(text);
        console.log(source_default.green("  Copied to clipboard! \u2705"));
      } catch {
        console.log(source_default.yellow("  Could not copy to clipboard. Please copy manually."));
      }
    }
  } catch {
  }
}
var OPENROT_ENTRY = {
  command: "openrot",
  args: ["serve"]
};
function getDetectedEditors(env3) {
  const homeDir = os9.homedir();
  const platform = os9.platform();
  const editors = [];
  const mcpServersSnippet = JSON.stringify(
    { mcpServers: { openrot: OPENROT_ENTRY } },
    null,
    2
  );
  const settingsSnippet = JSON.stringify(
    { "mcp.servers": { openrot: OPENROT_ENTRY } },
    null,
    2
  );
  if (env3.editors.claudeCode) {
    const claudeCommand = resolveOpenrotCommand();
    const claudeEntry = { command: claudeCommand, args: ["serve"] };
    const claudeSnippet = JSON.stringify(
      { mcpServers: { openrot: claudeEntry } },
      null,
      2
    );
    editors.push({
      label: "Claude Code",
      configPath: path11.join(homeDir, ".claude.json"),
      mcpKey: "mcpServers",
      entry: { openrot: claudeEntry },
      snippet: claudeSnippet
    });
  }
  if (env3.editors.cursor) {
    editors.push({
      label: "Cursor",
      configPath: path11.join(homeDir, ".cursor", "mcp.json"),
      mcpKey: "mcpServers",
      entry: { openrot: OPENROT_ENTRY },
      snippet: mcpServersSnippet
    });
  }
  if (env3.editors.vscode) {
    let vscodeBase;
    if (platform === "win32") {
      vscodeBase = path11.join(process.env.APPDATA || path11.join(homeDir, "AppData", "Roaming"), "Code", "User");
    } else if (platform === "darwin") {
      vscodeBase = path11.join(homeDir, "Library", "Application Support", "Code", "User");
    } else {
      vscodeBase = path11.join(homeDir, ".config", "Code", "User");
    }
    editors.push({
      label: "VS Code",
      configPath: path11.join(vscodeBase, "settings.json"),
      mcpKey: "mcp.servers",
      entry: { openrot: OPENROT_ENTRY },
      snippet: settingsSnippet
    });
  }
  if (env3.editors.antigravity) {
    let agBase;
    if (platform === "win32") {
      agBase = path11.join(process.env.APPDATA || path11.join(homeDir, "AppData", "Roaming"), "Antigravity", "User");
    } else if (platform === "darwin") {
      agBase = path11.join(homeDir, "Library", "Application Support", "Antigravity", "User");
    } else {
      agBase = path11.join(homeDir, ".config", "Antigravity", "User");
    }
    editors.push({
      label: "Google Antigravity",
      configPath: path11.join(agBase, "settings.json"),
      mcpKey: "mcp.servers",
      entry: { openrot: OPENROT_ENTRY },
      snippet: settingsSnippet
    });
  }
  return editors;
}
async function writeEditorConfig(editor) {
  try {
    const { configPath, mcpKey, entry, label } = editor;
    const dir = path11.dirname(configPath);
    if (!fs9.existsSync(dir)) {
      fs9.mkdirSync(dir, { recursive: true });
    }
    let existing = {};
    if (fs9.existsSync(configPath)) {
      const raw = fs9.readFileSync(configPath, "utf-8");
      try {
        existing = JSON.parse(raw);
      } catch {
        console.log(source_default.yellow(`  \u26A0\uFE0F  Could not update ${label} config \u2014 invalid JSON`));
        console.log(source_default.dim(`     ${configPath}`));
        console.log(`     Add this manually:`);
        console.log(source_default.cyan(`     ${editor.snippet.split("\n").join("\n     ")}`));
        return;
      }
      const mcpSection = existing[mcpKey];
      if (mcpSection && typeof mcpSection === "object" && "openrot" in mcpSection) {
        console.log(source_default.blue(`  \u2139\uFE0F  OpenRot already configured in ${label}`));
        return;
      }
    }
    if (!existing[mcpKey] || typeof existing[mcpKey] !== "object") {
      existing[mcpKey] = {};
    }
    Object.assign(existing[mcpKey], entry);
    fs9.writeFileSync(configPath, JSON.stringify(existing, null, 2) + "\n", "utf-8");
    console.log(source_default.green(`  \u2705 ${label} configured \u2192 ${source_default.dim(configPath)}`));
  } catch (error) {
    console.log(source_default.yellow(`  \u26A0\uFE0F  Could not write ${editor.label} config: ${error}`));
    await showSnippetFallback(editor);
  }
}
async function showSnippetFallback(editor) {
  console.log("");
  console.log(source_default.bold("\u2501".repeat(45)));
  console.log(source_default.green.bold(`\u2705 ${editor.label} detected`));
  console.log("");
  console.log(`Add this to ${source_default.dim(editor.configPath)}:`);
  console.log("");
  console.log(source_default.cyan(editor.snippet));
  console.log("");
  await offerClipboardCopy(editor.snippet);
}
function resolveOpenrotCommand() {
  if (process.platform !== "win32") return "openrot";
  try {
    const output = execSync("where.exe openrot", { encoding: "utf-8", timeout: 5e3 });
    const cmdPath = output.split("\n").map((line) => line.trim()).find((line) => line.endsWith(".cmd"));
    if (cmdPath) return toGitBashPath(cmdPath);
  } catch {
  }
  return "openrot";
}
function toGitBashPath(winPath) {
  let p = winPath.replace(/\.cmd$/i, "");
  p = p.replace(/\\/g, "/");
  p = p.replace(/^([A-Za-z]):\//, (_match, drive) => `/${drive.toLowerCase()}/`);
  return p;
}
function registerClaudeCodeHooks() {
  try {
    const homeDir = os9.homedir();
    const settingsPath = path11.join(homeDir, ".claude", "settings.json");
    const claudeDir = path11.join(homeDir, ".claude");
    if (!fs9.existsSync(claudeDir)) {
      fs9.mkdirSync(claudeDir, { recursive: true });
    }
    const openrotCmd = resolveOpenrotCommand();
    const openrotHooks = {
      Stop: [
        {
          hooks: [
            { type: "command", command: `${openrotCmd} analyze`, timeout: 10 }
          ]
        }
      ],
      SessionStart: [
        {
          hooks: [
            { type: "command", command: `${openrotCmd} session-start` }
          ]
        }
      ],
      PreCompact: [
        {
          hooks: [
            { type: "command", command: `${openrotCmd} pre-compact` }
          ]
        }
      ]
    };
    let settings = {};
    if (fs9.existsSync(settingsPath)) {
      try {
        settings = JSON.parse(fs9.readFileSync(settingsPath, "utf-8"));
      } catch {
      }
    }
    if (settings.hooks) {
      const hasOpenrot = JSON.stringify(settings.hooks).includes("openrot");
      if (hasOpenrot) return "exists";
    }
    if (!settings.hooks) {
      settings.hooks = {};
    }
    for (const [event, hookEntries] of Object.entries(openrotHooks)) {
      if (!settings.hooks[event]) {
        settings.hooks[event] = [];
      }
      settings.hooks[event].push(...hookEntries);
    }
    fs9.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n", "utf-8");
    return "registered";
  } catch {
    return "error";
  }
}

// src/cli/config.ts
init_esm_shims();
async function runConfig() {
  const config = await loadConfig();
  const configPath = getConfigPath();
  console.log(source_default.bold("\n\u2699\uFE0F  OpenRot \u2014 Configuration\n"));
  console.log(source_default.dim(`Config file: ${configPath}`));
  console.log("");
  try {
    const { default: inquirer } = await import("inquirer");
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "extractionMode",
        message: "Extraction mode:",
        choices: [
          { name: "Auto (detect best available)", value: "auto" },
          { name: "Regex only (zero cost)", value: "regex" },
          { name: "OpenAI", value: "openai" },
          { name: "Anthropic", value: "anthropic" },
          { name: "Gemini", value: "gemini" },
          { name: "Ollama (local)", value: "ollama" },
          { name: "Custom (OpenAI-compatible)", value: "custom" }
        ],
        default: config.extraction.mode
      },
      {
        type: "list",
        name: "sensitivity",
        message: "Sensitivity level:",
        choices: [
          { name: "Low (fewer warnings, higher confidence required)", value: "low" },
          { name: "Medium (balanced)", value: "medium" },
          { name: "High (more warnings, catches more)", value: "high" }
        ],
        default: config.sensitivity
      },
      {
        type: "number",
        name: "threshold",
        message: "Confidence threshold (0.0-1.0):",
        default: config.threshold,
        validate: (val) => val >= 0 && val <= 1 ? true : "Must be between 0.0 and 1.0"
      }
    ]);
    config.extraction.mode = answers.extractionMode;
    config.contradiction.mode = answers.extractionMode;
    config.sensitivity = answers.sensitivity;
    config.threshold = answers.threshold;
    if (answers.extractionMode === "custom") {
      const customAnswers = await inquirer.prompt([
        {
          type: "input",
          name: "baseUrl",
          message: "API base URL:",
          default: config.extraction.baseUrl || ""
        },
        {
          type: "input",
          name: "model",
          message: "Model name:",
          default: config.extraction.model || ""
        },
        {
          type: "input",
          name: "apiKey",
          message: "API key (leave blank to use env var):",
          default: ""
        }
      ]);
      config.extraction.baseUrl = customAnswers.baseUrl || null;
      config.extraction.model = customAnswers.model || null;
      config.extraction.apiKey = customAnswers.apiKey || null;
      config.contradiction.baseUrl = customAnswers.baseUrl || null;
      config.contradiction.model = customAnswers.model || null;
      config.contradiction.apiKey = customAnswers.apiKey || null;
    }
    saveConfig(config);
    console.log("");
    console.log(source_default.green("\u2705 Configuration saved!"));
    console.log(source_default.dim(`   ${configPath}`));
  } catch {
    console.log(source_default.bold("Current configuration:"));
    console.log(JSON.stringify(config, null, 2));
  }
}

// src/cli/status.ts
init_esm_shims();

// src/state/index.ts
init_esm_shims();
import fs10 from "fs";
import path12 from "path";
import os10 from "os";
var STATE_DIR = path12.join(os10.homedir(), ".openrot", "state");
function ensureStateDir() {
  if (!fs10.existsSync(STATE_DIR)) {
    fs10.mkdirSync(STATE_DIR, { recursive: true });
  }
}
function statePath(sessionId) {
  const safe = sessionId.replace(/[^a-zA-Z0-9_-]/g, "_");
  return path12.join(STATE_DIR, `${safe}.json`);
}
function loadState(sessionId) {
  try {
    const filePath = statePath(sessionId);
    if (fs10.existsSync(filePath)) {
      const raw = fs10.readFileSync(filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch {
  }
  return createFreshState(sessionId);
}
function saveState(state) {
  try {
    ensureStateDir();
    const filePath = statePath(state.sessionId);
    fs10.writeFileSync(filePath, JSON.stringify(state, null, 2), "utf-8");
  } catch {
  }
}
function createFreshState(sessionId) {
  return {
    sessionId,
    startedAt: Date.now(),
    lastTurn: 0,
    decisions: [],
    fileReadCounts: {},
    fileEditCounts: {},
    consecutiveErrors: 0,
    errorPatterns: [],
    turnScores: [],
    rotPoint: null
  };
}
function listStates() {
  try {
    ensureStateDir();
    return fs10.readdirSync(STATE_DIR).filter((f) => f.endsWith(".json")).map((f) => f.replace(".json", ""));
  } catch {
    return [];
  }
}

// src/cli/status.ts
async function runStatus() {
  console.log(source_default.bold("\n\u{1F4CA} OpenRot \u2014 Status\n"));
  try {
    const config = await loadConfig();
    const configPath = getConfigPath();
    console.log(source_default.bold("Configuration:"));
    console.log(`  Config file: ${source_default.dim(configPath)}`);
    console.log(`  Extraction mode: ${source_default.cyan(config.extraction.mode)}`);
    console.log(`  Sensitivity: ${source_default.cyan(config.sensitivity)}`);
    console.log(`  Threshold: ${source_default.cyan(String(config.threshold))}`);
  } catch {
    console.log(source_default.yellow("  \u26A0\uFE0F  Could not load config"));
  }
  console.log("");
  try {
    const states = listStates();
    console.log(source_default.bold("Recent Sessions:"));
    if (states.length === 0) {
      console.log(source_default.dim("  No active sessions found."));
    } else {
      const recentStates = states.slice(0, 5);
      for (const sessionId of recentStates) {
        const state = loadState(sessionId);
        const age = Math.round((Date.now() - state.startedAt) / 6e4);
        const lastScore = state.turnScores[state.turnScores.length - 1];
        const scoreStr = lastScore ? `score: ${lastScore.score}%` : "no score yet";
        let icon = "\u2705";
        if (lastScore && lastScore.score > 45) icon = "\u{1F534}";
        else if (lastScore && lastScore.score > 20) icon = "\u26A0\uFE0F";
        console.log(`  ${icon} ${source_default.bold(sessionId.slice(0, 8))} \u2014 ${age}min ago, ${state.lastTurn} turns, ${scoreStr}`);
        if (state.decisions.length > 0) {
          const recent = state.decisions.slice(-3);
          for (const d of recent) {
            console.log(source_default.dim(`     [Turn ${d.turn}] ${d.commitment}`));
          }
          if (state.decisions.length > 3) {
            console.log(source_default.dim(`     ... and ${state.decisions.length - 3} more`));
          }
        }
        if (state.rotPoint) {
          console.log(source_default.red(`     Rot detected at turn ${state.rotPoint}`));
        }
      }
      if (states.length > 5) {
        console.log(source_default.dim(`
  ... and ${states.length - 5} more sessions`));
      }
    }
  } catch {
    console.log(source_default.yellow("  \u26A0\uFE0F  Could not read session states"));
  }
  console.log("");
  try {
    const env3 = await detectEnvironment();
    console.log(source_default.bold("Editors:"));
    if (env3.editors.claudeCode) console.log(source_default.green("  \u2705 Claude Code"));
    if (env3.editors.cursor) console.log(source_default.green("  \u2705 Cursor"));
    if (env3.editors.vscode) console.log(source_default.green("  \u2705 VS Code"));
    if (env3.editors.antigravity) console.log(source_default.green("  \u2705 Google Antigravity"));
    if (!env3.editors.claudeCode && !env3.editors.cursor && !env3.editors.vscode && !env3.editors.antigravity) {
      console.log(source_default.dim("  (none detected)"));
    }
  } catch {
    console.log(source_default.yellow("  \u26A0\uFE0F  Could not detect editors"));
  }
  console.log("");
}

// src/cli/test.ts
init_esm_shims();
import { spawn } from "child_process";
async function runTest() {
  console.log(source_default.bold("\n\u{1F9EA} OpenRot \u2014 Self Test\n"));
  let allPassed = true;
  try {
    const db2 = await getDb();
    db2.exec("SELECT 1");
    console.log(source_default.green("\u2705 Database: OK"));
  } catch (error) {
    console.log(source_default.red(`\u274C Database: ${error}`));
    allPassed = false;
  }
  try {
    const results = extractWithRegex("let's use Tailwind for styling");
    if (results.length >= 1) {
      console.log(source_default.green("\u2705 Regex extraction: OK"));
      console.log(source_default.dim(`   Extracted: "${results[0].commitment}"`));
    } else {
      console.log(source_default.red("\u274C Regex extraction: No decisions extracted"));
      allPassed = false;
    }
  } catch (error) {
    console.log(source_default.red(`\u274C Regex extraction: ${error}`));
    allPassed = false;
  }
  try {
    console.log(source_default.dim("   Loading embedding model (this may take a moment)..."));
    const available = await isEmbeddingAvailable();
    if (available) {
      console.log(source_default.green("\u2705 Embeddings: OK (all-MiniLM-L6-v2)"));
    } else {
      console.log(source_default.yellow("\u26A0\uFE0F  Embeddings: not loaded (optional \u2014 will download on first use)"));
    }
  } catch (error) {
    console.log(source_default.yellow(`\u26A0\uFE0F  Embeddings: not loaded (${error})`));
  }
  try {
    const selection = await getModelClient();
    if (selection) {
      const name = getModelName(selection);
      console.log(source_default.green(`\u2705 Provider: ${name}`));
    } else {
      console.log(source_default.yellow("\u26A0\uFE0F  No API provider configured (regex mode only)"));
      console.log(source_default.dim("   Set OPENAI_API_KEY, ANTHROPIC_API_KEY, or GEMINI_API_KEY"));
      console.log(source_default.dim("   Or install Ollama at https://ollama.com"));
    }
  } catch (error) {
    console.log(source_default.yellow(`\u26A0\uFE0F  Provider detection failed: ${error}`));
  }
  try {
    const serverProcess = spawn(process.execPath, [process.argv[1], "serve"], {
      stdio: "pipe",
      timeout: 5e3
    });
    const started = await new Promise((resolve) => {
      const timeout = setTimeout(() => {
        if (!serverProcess.killed) {
          serverProcess.kill();
          resolve(true);
        }
      }, 2e3);
      serverProcess.on("error", () => {
        clearTimeout(timeout);
        resolve(false);
      });
      serverProcess.on("exit", (code) => {
        if (code !== null && code !== 0) {
          clearTimeout(timeout);
          resolve(false);
        }
      });
    });
    if (started) {
      console.log(source_default.green("\u2705 MCP server: OK"));
    } else {
      console.log(source_default.red("\u274C MCP server: Failed to start"));
      allPassed = false;
    }
  } catch (error) {
    console.log(source_default.red(`\u274C MCP server: ${error}`));
    allPassed = false;
  }
  console.log("");
  console.log(source_default.bold("\u2501".repeat(40)));
  if (allPassed) {
    console.log(source_default.green.bold("OpenRot self-test complete. \u2705"));
  } else {
    console.log(source_default.yellow.bold("OpenRot self-test complete with issues."));
  }
  console.log("");
  console.log(`Run ${source_default.bold("openrot init")} to configure editors.`);
  console.log(`Run ${source_default.bold("openrot serve")} to start the MCP server.`);
  console.log("");
}

// src/cli/model.ts
init_esm_shims();
var RECOMMENDED_MODELS = {
  openai: ["gpt-4o-mini", "gpt-4o"],
  anthropic: ["claude-haiku-4-5-20251001", "claude-sonnet-4-5"],
  gemini: ["gemini-2.0-flash", "gemini-1.5-pro"]
};
var PROVIDER_LABELS = {
  ollama: "Ollama (local, free)",
  openai: "OpenAI",
  anthropic: "Anthropic",
  gemini: "Gemini",
  regex: "Regex only (no LLM)"
};
async function runModel(options) {
  if (options.provider) {
    await runNonInteractive(options);
    return;
  }
  await runInteractive();
}
async function runNonInteractive(options) {
  const provider = options.provider;
  const validProviders = ["ollama", "openai", "anthropic", "gemini", "regex"];
  if (!validProviders.includes(provider)) {
    console.log(source_default.red(`\u274C Invalid provider: ${options.provider}`));
    console.log(source_default.dim(`   Valid options: ${validProviders.join(", ")}`));
    process.exit(1);
  }
  const config = await loadConfig();
  config.extraction.mode = provider;
  config.contradiction.mode = provider;
  config.extraction.model = options.model || null;
  config.contradiction.model = options.model || null;
  if (options.key) {
    config.extraction.apiKey = options.key;
    config.contradiction.apiKey = options.key;
  }
  saveConfig(config);
  const displayModel = options.model || "(default)";
  console.log(source_default.green(`\u2705 Saved. OpenRot is now using ${provider} / ${displayModel}`));
}
async function runInteractive() {
  const { default: inquirer } = await import("inquirer");
  const config = await loadConfig();
  const currentProvider = config.extraction.mode;
  const currentModel = config.extraction.model || "(auto)";
  console.log("");
  console.log(source_default.dim("  \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510"));
  console.log(source_default.dim("  \u2502") + ` Current: ${source_default.bold(currentProvider)} / ${source_default.bold(currentModel)} ` + source_default.dim("\u2502"));
  console.log(source_default.dim("  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518"));
  console.log("");
  const { provider } = await inquirer.prompt([
    {
      type: "list",
      name: "provider",
      message: "Select provider:",
      choices: [
        { name: PROVIDER_LABELS.ollama, value: "ollama" },
        { name: PROVIDER_LABELS.openai, value: "openai" },
        { name: PROVIDER_LABELS.anthropic, value: "anthropic" },
        { name: PROVIDER_LABELS.gemini, value: "gemini" },
        { name: PROVIDER_LABELS.regex, value: "regex" }
      ]
    }
  ]);
  let selectedModel = null;
  let apiKey = config.extraction.apiKey;
  if (provider === "regex") {
  } else if (provider === "ollama") {
    const result = await handleOllama();
    if (!result) return;
    selectedModel = result;
  } else {
    const result = await handleCloudProvider(provider, inquirer);
    if (!result) return;
    selectedModel = result.model;
    apiKey = result.apiKey;
  }
  config.extraction.mode = provider;
  config.contradiction.mode = provider;
  config.extraction.model = selectedModel;
  config.contradiction.model = selectedModel;
  if (apiKey !== config.extraction.apiKey) {
    config.extraction.apiKey = apiKey;
    config.contradiction.apiKey = apiKey;
  }
  saveConfig(config);
  const displayModel = selectedModel || "(default)";
  console.log("");
  console.log(source_default.green(`\u2705 Saved. OpenRot is now using ${source_default.bold(provider)} / ${source_default.bold(displayModel)}`));
  console.log("");
}
async function handleOllama() {
  const running = await isOllamaRunning();
  if (!running) {
    console.log(source_default.yellow("\n  \u26A0\uFE0F  Ollama not running. Start it first."));
    console.log(source_default.dim("     https://ollama.com\n"));
    return null;
  }
  const models = await getOllamaModels();
  if (models.length === 0) {
    console.log(source_default.yellow("\n  \u26A0\uFE0F  No models installed. Run: ollama pull qwen2.5-coder:3b\n"));
    return null;
  }
  const { default: inquirer } = await import("inquirer");
  const { model } = await inquirer.prompt([
    {
      type: "list",
      name: "model",
      message: "Select Ollama model:",
      choices: models.map((m) => ({ name: m, value: m }))
    }
  ]);
  return model;
}
async function handleCloudProvider(provider, inquirer) {
  const recommended = RECOMMENDED_MODELS[provider] || [];
  const modelChoices = [
    ...recommended.map((m) => ({ name: m, value: m })),
    { name: "Enter custom model name", value: "__custom__" }
  ];
  const { model: selectedModel } = await inquirer.prompt([
    {
      type: "list",
      name: "model",
      message: "Select model:",
      choices: modelChoices
    }
  ]);
  let model = selectedModel;
  if (model === "__custom__") {
    const { customModel } = await inquirer.prompt([
      {
        type: "input",
        name: "customModel",
        message: "Model name:",
        validate: (val) => val.trim().length > 0 ? true : "Model name cannot be empty"
      }
    ]);
    model = customModel.trim();
  }
  const envVarMap = {
    openai: "OPENAI_API_KEY",
    anthropic: "ANTHROPIC_API_KEY",
    gemini: "GEMINI_API_KEY"
  };
  const envVar = envVarMap[provider];
  const hasEnvKey = envVar ? !!process.env[envVar] : false;
  const { apiKey } = await inquirer.prompt([
    {
      type: "password",
      name: "apiKey",
      message: `API key${hasEnvKey ? ` (${envVar} detected, press Enter to keep)` : ""}:`,
      mask: "*",
      validate: (val) => {
        if (val.trim().length > 0) return true;
        if (hasEnvKey) return true;
        return "API key cannot be empty (no environment variable set)";
      }
    }
  ]);
  return {
    model,
    apiKey: apiKey.trim().length > 0 ? apiKey.trim() : null
  };
}

// src/cli/scan.ts
init_esm_shims();
import fs13 from "fs";
import path13 from "path";
import os11 from "os";

// src/transcript/index.ts
init_esm_shims();
import fs11 from "fs";
function parseTranscript(transcriptPath) {
  try {
    if (!fs11.existsSync(transcriptPath)) return [];
    const content = fs11.readFileSync(transcriptPath, "utf-8");
    return parseTranscriptContent(content);
  } catch {
    return [];
  }
}
function parseTranscriptContent(content) {
  const messages = [];
  const lines = content.split("\n").filter((l) => l.trim().length > 0);
  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.type && parsed.message) {
        messages.push(parsed);
      }
    } catch {
    }
  }
  return messages;
}
function getMessageText(msg) {
  if (typeof msg.message.content === "string") {
    return msg.message.content;
  }
  if (Array.isArray(msg.message.content)) {
    return msg.message.content.filter((block) => block.type === "text" && block.text).map((block) => block.text).join("\n");
  }
  return "";
}
function countTurns(messages) {
  return messages.filter((m) => m.type === "assistant").length;
}
function getAssistantMessages(messages) {
  return messages.filter((m) => m.type === "assistant").map(getMessageText).filter((t) => t.length > 0);
}

// src/transcript/tail.ts
init_esm_shims();
import fs12 from "fs";
function tailTranscript(transcriptPath, maxLines = 40) {
  try {
    if (!fs12.existsSync(transcriptPath)) return [];
    const stat = fs12.statSync(transcriptPath);
    if (stat.size === 0) return [];
    if (stat.size < 1e5) {
      const content = fs12.readFileSync(transcriptPath, "utf-8");
      return parseLastNLines(content, maxLines);
    }
    const chunkSize = Math.min(stat.size, 512e3);
    const fd = fs12.openSync(transcriptPath, "r");
    try {
      const buffer = Buffer.alloc(chunkSize);
      const startPos = Math.max(0, stat.size - chunkSize);
      fs12.readSync(fd, buffer, 0, chunkSize, startPos);
      const content = buffer.toString("utf-8");
      return parseLastNLines(content, maxLines);
    } finally {
      fs12.closeSync(fd);
    }
  } catch {
    return [];
  }
}
function parseLastNLines(content, maxLines) {
  const lines = content.split("\n").filter((l) => l.trim().length > 0);
  const tail = lines.slice(-maxLines);
  const messages = [];
  for (const line of tail) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.type && parsed.message) {
        messages.push(parsed);
      }
    } catch {
    }
  }
  return messages;
}
function findTranscripts(dirPath) {
  const results = [];
  try {
    if (!fs12.existsSync(dirPath)) return [];
    const stat = fs12.statSync(dirPath);
    if (stat.isFile() && dirPath.endsWith(".jsonl")) {
      return [dirPath];
    }
    if (!stat.isDirectory()) return [];
    const entries = fs12.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = `${dirPath}/${entry.name}`;
      if (entry.isFile() && entry.name.endsWith(".jsonl")) {
        results.push(fullPath);
      } else if (entry.isDirectory()) {
        results.push(...findTranscripts(fullPath));
      }
    }
  } catch {
  }
  return results;
}

// src/detect/index.ts
init_esm_shims();

// src/transcript/tokens.ts
init_esm_shims();
var CHARS_PER_TOKEN = 4;
var CONTEXT_LIMIT = 2e5;
function countHedgingPhrases(text) {
  const hedgingPatterns = [
    /\bi think\b/gi,
    /\bperhaps\b/gi,
    /\bit seems\b/gi,
    /\bmaybe\b/gi,
    /\bmight be\b/gi,
    /\bcould be\b/gi,
    /\bi believe\b/gi,
    /\bpossibly\b/gi,
    /\bI'm not (?:entirely )?sure\b/gi,
    /\bif I recall\b/gi,
    /\bI would guess\b/gi,
    /\bnot certain\b/gi
  ];
  let count = 0;
  for (const pattern of hedgingPatterns) {
    const matches = text.match(pattern);
    if (matches) count += matches.length;
  }
  return count;
}

// src/detect/violations.ts
init_esm_shims();
function detectViolations(turns) {
  const signals2 = [];
  if (turns.length < 6) return signals2;
  const activeDecisions = [];
  const log = [];
  for (const turn of turns) {
    const extracted = extractWithRegex(turn.text);
    if (extracted.length === 0) continue;
    if (turn.type === "user") {
      for (const e of extracted) {
        const superseded = findContradictedDecision(activeDecisions, e.commitment);
        if (superseded) {
          superseded.supersededAt = turn.index;
          log.push({
            turn: turn.index,
            event: "decision-updated",
            detail: `User changed "${superseded.commitment}" \u2192 "${e.commitment}"`
          });
        }
        activeDecisions.push({
          turn: turn.index,
          commitment: e.commitment,
          type: e.type,
          source: "user"
        });
        log.push({
          turn: turn.index,
          event: "decision-added",
          detail: `User: "${e.commitment}"`
        });
      }
    } else {
      for (const e of extracted) {
        const currentActive = activeDecisions.filter((d) => !d.supersededAt);
        const violated = findContradictedDecision(currentActive, e.commitment);
        if (violated) {
          const recentUserTurns = turns.filter((t) => t.type === "user" && t.index < turn.index).slice(-2);
          const userAskedForChange = recentUserTurns.some((ut) => {
            const userExtractions = extractWithRegex(ut.text);
            return userExtractions.some((ue) => isAligned(ue.commitment, e.commitment));
          });
          if (!userAskedForChange) {
            signals2.push({
              type: "violation",
              turn: turn.index,
              score: 80,
              description: "Instruction violation",
              details: `AI contradicted "${violated.commitment}" (user decided at turn ${violated.turn})`
            });
            log.push({
              turn: turn.index,
              event: "violation",
              detail: `AI said "${e.commitment}" \u2014 contradicts active decision "${violated.commitment}" (turn ${violated.turn})`
            });
          }
        }
        const currentActiveForDirect = activeDecisions.filter((d) => !d.supersededAt);
        for (const decision of currentActiveForDirect) {
          const violation = checkDirectViolation(turn.text, decision.commitment);
          if (violation) {
            signals2.push({
              type: "violation",
              turn: turn.index,
              score: 70,
              description: "Instruction violation",
              details: `${violation} (user decided "${decision.commitment}" at turn ${decision.turn})`
            });
          }
        }
      }
    }
  }
  const result = deduplicateSignals(signals2);
  result.__verboseLog = log;
  result.__decisions = activeDecisions;
  return result;
}
function findContradictedDecision(decisions, newCommitment) {
  for (const d of decisions) {
    if (d.supersededAt) continue;
    if (isContradiction(d.commitment, newCommitment)) return d;
  }
  return void 0;
}
function isAligned(a, b) {
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();
  const aUse = aLower.match(/^(?:use|only use|stick with|using)\s+(.+)/);
  const bUse = bLower.match(/^(?:use|only use|stick with|using)\s+(.+)/);
  if (aUse && bUse) return hasSignificantOverlap(aUse[1], bUse[1]);
  const aAvoid = aLower.match(/^(?:avoid|never use|don't use)\s+(.+)/);
  const bAvoid = bLower.match(/^(?:avoid|never use|don't use)\s+(.+)/);
  if (aAvoid && bAvoid) return hasSignificantOverlap(aAvoid[1], bAvoid[1]);
  return false;
}
function isContradiction(existing, incoming) {
  const existingLower = existing.toLowerCase();
  const incomingLower = incoming.toLowerCase();
  const useMatch = existingLower.match(/^(?:use|only use|stick with|using)\s+(.+)/);
  const avoidMatch = incomingLower.match(/^(?:avoid|never use|don't use|no)\s+(.+)/);
  if (useMatch && avoidMatch) {
    return hasSignificantOverlap(useMatch[1], avoidMatch[1]);
  }
  const existingAvoid = existingLower.match(/^(?:avoid|never use|don't use|no)\s+(.+)/);
  const incomingUse = incomingLower.match(/^(?:use|only use|stick with|using)\s+(.+)/);
  if (existingAvoid && incomingUse) {
    return hasSignificantOverlap(existingAvoid[1], incomingUse[1]);
  }
  const existingUse2 = existingLower.match(/^(?:use|using)\s+(.+?)(?:\s+for\s+(.+))?$/);
  const incomingUse2 = incomingLower.match(/^(?:use|using)\s+(.+?)(?:\s+for\s+(.+))?$/);
  if (existingUse2 && incomingUse2 && existingUse2[2] && incomingUse2[2]) {
    if (hasSignificantOverlap(existingUse2[2], incomingUse2[2]) && !hasSignificantOverlap(existingUse2[1], incomingUse2[1])) {
      return true;
    }
  }
  return false;
}
function hasSignificantOverlap(a, b) {
  const wordsA = new Set(a.toLowerCase().split(/\s+/).filter((w) => w.length > 2));
  const wordsB = new Set(b.toLowerCase().split(/\s+/).filter((w) => w.length > 2));
  if (wordsA.size === 0 || wordsB.size === 0) return false;
  let overlap = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) overlap++;
  }
  return overlap / Math.min(wordsA.size, wordsB.size) > 0.5;
}
function checkDirectViolation(text, decision) {
  const decLower = decision.toLowerCase();
  if (decLower.includes("tailwind") && !decLower.includes("avoid") && /style\s*=\s*\{/.test(text)) {
    return "Used inline styles";
  }
  if (decLower.includes("typescript") && !decLower.includes("avoid") && /require\s*\(/.test(text) && !text.toLowerCase().includes("import")) {
    return "Used require() instead of import";
  }
  return null;
}
function deduplicateSignals(signals2) {
  const seen = /* @__PURE__ */ new Set();
  return signals2.filter((s) => {
    const key = `${s.turn}:${s.description}:${s.details}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function scoreViolations(signals2) {
  const violationSignals = signals2.filter((s) => s.type === "violation");
  if (violationSignals.length === 0) return 0;
  return Math.min(100, violationSignals.length * 25);
}

// src/detect/circular.ts
init_esm_shims();
function detectCircular(turns) {
  const signals2 = [];
  const assistantTurns = turns.filter((t) => t.type === "assistant");
  const fileReads = /* @__PURE__ */ new Map();
  const fileEdits = /* @__PURE__ */ new Map();
  for (const turn of assistantTurns) {
    for (const tool of turn.toolCalls) {
      if (!tool.filePath) continue;
      const path16 = normalizePath(tool.filePath);
      if (isReadTool(tool.toolName)) {
        const reads = fileReads.get(path16) || [];
        reads.push(turn.index);
        fileReads.set(path16, reads);
      }
      if (isEditTool(tool.toolName)) {
        const edits = fileEdits.get(path16) || [];
        edits.push(turn.index);
        fileEdits.set(path16, edits);
      }
    }
  }
  for (const [path16, reads] of fileReads) {
    const edits = fileEdits.get(path16) || [];
    if (reads.length >= 3) {
      const readsWithoutEdits = countReadsWithoutEdits(reads, edits);
      if (readsWithoutEdits >= 3) {
        const shortPath = path16.split("/").slice(-2).join("/");
        signals2.push({
          type: "circular",
          turn: reads[reads.length - 1],
          score: 75,
          description: "Circular pattern",
          details: `Re-read ${shortPath} ${reads.length} times without changes`
        });
      }
    }
  }
  for (const [path16, edits] of fileEdits) {
    if (edits.length >= 3) {
      const clustered = findClusteredEdits(edits, 5);
      if (clustered >= 3) {
        const shortPath = path16.split("/").slice(-2).join("/");
        signals2.push({
          type: "circular",
          turn: edits[edits.length - 1],
          score: 80,
          description: "Edit-undo-edit cycle",
          details: `Edited ${shortPath} ${edits.length} times in quick succession`
        });
      }
    }
  }
  const textSignals = detectCircularFromText(assistantTurns);
  signals2.push(...textSignals);
  return deduplicateSignals2(signals2);
}
function isReadTool(name) {
  const readTools = ["read", "read_file", "readfile", "cat", "view", "Read"];
  return readTools.some((t) => name.toLowerCase().includes(t.toLowerCase()));
}
function isEditTool(name) {
  const editTools = ["write", "edit", "create", "replace", "patch", "Write", "Edit", "str_replace"];
  return editTools.some((t) => name.toLowerCase().includes(t.toLowerCase()));
}
function normalizePath(p) {
  return p.replace(/\\/g, "/").replace(/^\.\//, "");
}
function countReadsWithoutEdits(reads, edits) {
  let count = 0;
  for (let i = 1; i < reads.length; i++) {
    const hasEditBetween = edits.some((e) => e > reads[i - 1] && e < reads[i]);
    if (!hasEditBetween) count++;
  }
  return count + 1;
}
function findClusteredEdits(edits, windowSize) {
  let maxCluster = 1;
  for (let i = 0; i < edits.length; i++) {
    let count = 1;
    for (let j = i + 1; j < edits.length; j++) {
      if (edits[j] - edits[i] <= windowSize) count++;
      else break;
    }
    maxCluster = Math.max(maxCluster, count);
  }
  return maxCluster;
}
function detectCircularFromText(turns) {
  const signals2 = [];
  const pathPattern = /(?:reading|read|opening|looking at|checking)\s+[`"']?([^\s`"']+\.\w{1,5})[`"']?/gi;
  const mentionedFiles = /* @__PURE__ */ new Map();
  for (const turn of turns) {
    pathPattern.lastIndex = 0;
    let match;
    while ((match = pathPattern.exec(turn.text)) !== null) {
      const file = match[1];
      const mentions = mentionedFiles.get(file) || [];
      mentions.push(turn.index);
      mentionedFiles.set(file, mentions);
    }
  }
  for (const [file, mentions] of mentionedFiles) {
    if (mentions.length >= 4) {
      signals2.push({
        type: "circular",
        turn: mentions[mentions.length - 1],
        score: 60,
        description: "Circular pattern",
        details: `Referenced ${file} ${mentions.length} times across turns`
      });
    }
  }
  return signals2;
}
function deduplicateSignals2(signals2) {
  const seen = /* @__PURE__ */ new Set();
  return signals2.filter((s) => {
    const key = `${s.turn}:${s.details}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function scoreCircular(signals2) {
  const circularSignals = signals2.filter((s) => s.type === "circular");
  if (circularSignals.length === 0) return 0;
  return Math.min(100, circularSignals.reduce((sum, s) => sum + s.score, 0) / circularSignals.length + circularSignals.length * 10);
}

// src/detect/repair-loops.ts
init_esm_shims();
function detectRepairLoops(turns) {
  const signals2 = [];
  const assistantTurns = turns.filter((t) => t.type === "assistant");
  signals2.push(...detectConsecutiveFailures(turns));
  signals2.push(...detectRepeatedErrors(assistantTurns));
  signals2.push(...detectRetryPatterns(assistantTurns));
  return deduplicateSignals3(signals2);
}
function detectConsecutiveFailures(turns) {
  const signals2 = [];
  let consecutiveErrors = 0;
  let errorPattern = "";
  let firstErrorTurn = 0;
  for (const turn of turns) {
    const hasError = turn.toolCalls.some((t) => t.exitCode !== void 0 && t.exitCode !== 0);
    const errorText = turn.toolCalls.filter((t) => t.error).map((t) => t.error).join(" ");
    if (hasError) {
      if (consecutiveErrors === 0) {
        firstErrorTurn = turn.index;
        errorPattern = errorText.substring(0, 100);
      }
      consecutiveErrors++;
      if (consecutiveErrors >= 3) {
        signals2.push({
          type: "repair-loop",
          turn: turn.index,
          score: 90,
          description: "Repair loop",
          details: `${consecutiveErrors} consecutive failed attempts${errorPattern ? ` \u2014 ${errorPattern}` : ""}`
        });
      }
    } else {
      consecutiveErrors = 0;
    }
  }
  return signals2;
}
function detectRepeatedErrors(turns) {
  const signals2 = [];
  const errorCounts = /* @__PURE__ */ new Map();
  const errorPatterns = [
    /(?:TypeError|ReferenceError|SyntaxError|Error):\s*(.+?)(?:\.|,|\n|$)/gi,
    /error\[E\d+\]:\s*(.+?)(?:\.|,|\n|$)/gi,
    /(?:FAIL|FAILED):\s*(.+?)(?:\.|,|\n|$)/gi,
    /Cannot\s+(.+?)(?:\.|,|\n|$)/gi
  ];
  for (const turn of turns) {
    const text = turn.text;
    for (const pattern of errorPatterns) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const normalized = normalizeError(match[1]);
        if (normalized.length < 5) continue;
        const occurrences = errorCounts.get(normalized) || [];
        occurrences.push(turn.index);
        errorCounts.set(normalized, occurrences);
      }
    }
  }
  for (const [error, turns_] of errorCounts) {
    if (turns_.length >= 3) {
      signals2.push({
        type: "repair-loop",
        turn: turns_[turns_.length - 1],
        score: 85,
        description: "Repair loop",
        details: `Same error "${error.substring(0, 60)}" appeared ${turns_.length} times`
      });
    }
  }
  return signals2;
}
function detectRetryPatterns(turns) {
  const signals2 = [];
  const retryPatterns = [
    /let me (?:try|fix|correct|address) (?:that|this|it) again/gi,
    /(?:I apologize|sorry),?\s*(?:let me|I'll) (?:try|fix|correct)/gi,
    /that (?:didn't work|failed|caused an error)/gi,
    /(?:still|again) (?:getting|seeing|hitting) (?:the same|that|this) error/gi,
    /(?:another|different) approach/gi,
    /(?:going back to|reverting to|trying again with)/gi
  ];
  let retryCount = 0;
  let retryStart = 0;
  for (const turn of turns) {
    const hasRetry = retryPatterns.some((p) => {
      p.lastIndex = 0;
      return p.test(turn.text);
    });
    if (hasRetry) {
      if (retryCount === 0) retryStart = turn.index;
      retryCount++;
      if (retryCount >= 3) {
        signals2.push({
          type: "repair-loop",
          turn: turn.index,
          score: 75,
          description: "Repair loop",
          details: `${retryCount} retry attempts since turn ${retryStart}`
        });
      }
    } else {
      retryCount = 0;
    }
  }
  return signals2;
}
function normalizeError(error) {
  return error.trim().toLowerCase().replace(/\d+/g, "N").replace(/['"][^'"]+['"]/g, "STR").replace(/\s+/g, " ").substring(0, 80);
}
function deduplicateSignals3(signals2) {
  const seen = /* @__PURE__ */ new Set();
  return signals2.filter((s) => {
    const key = `${s.turn}:${s.type}:${s.details?.substring(0, 40)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function scoreRepairLoops(signals2) {
  const repairSignals = signals2.filter((s) => s.type === "repair-loop");
  if (repairSignals.length === 0) return 0;
  return Math.min(100, repairSignals.reduce((sum, s) => sum + s.score, 0) / repairSignals.length + repairSignals.length * 15);
}

// src/detect/quality.ts
init_esm_shims();
function detectQualityDecline(turns) {
  const signals2 = [];
  const assistantTurns = turns.filter((t) => t.type === "assistant");
  if (assistantTurns.length < 6) return signals2;
  const mid = Math.floor(assistantTurns.length / 2);
  const firstHalf = assistantTurns.slice(0, mid);
  const secondHalf = assistantTurns.slice(mid);
  const lengthSignal = detectLengthDecline(firstHalf, secondHalf);
  if (lengthSignal) signals2.push(lengthSignal);
  const hedgingSignal = detectHedgingIncrease(firstHalf, secondHalf);
  if (hedgingSignal) signals2.push(hedgingSignal);
  const codeSignal = detectCodeBlockDecline(firstHalf, secondHalf);
  if (codeSignal) signals2.push(codeSignal);
  const windowSignals = detectSlidingWindowDecline(assistantTurns);
  signals2.push(...windowSignals);
  return signals2;
}
function detectLengthDecline(first, second) {
  const avgFirst = average(first.map((t) => t.wordCount));
  const avgSecond = average(second.map((t) => t.wordCount));
  if (avgFirst === 0) return null;
  const ratio = avgSecond / avgFirst;
  if (ratio < 0.4) {
    return {
      type: "quality-decline",
      turn: second[0].index,
      score: 80,
      description: "Response quality decline",
      details: `Response length dropped to ${Math.round(ratio * 100)}% of earlier average`
    };
  }
  if (ratio < 0.6) {
    return {
      type: "quality-decline",
      turn: second[0].index,
      score: 50,
      description: "Response quality decline",
      details: `Response length dropped to ${Math.round(ratio * 100)}% of earlier average`
    };
  }
  return null;
}
function detectHedgingIncrease(first, second) {
  const avgHedgingFirst = average(first.map((t) => t.hedgingCount));
  const avgHedgingSecond = average(second.map((t) => t.hedgingCount));
  if (avgHedgingSecond > avgHedgingFirst * 2 && avgHedgingSecond >= 3) {
    return {
      type: "quality-decline",
      turn: second[0].index,
      score: 60,
      description: "Hedging language increase",
      details: `Hedging phrases increased from ${avgHedgingFirst.toFixed(1)} to ${avgHedgingSecond.toFixed(1)} per response`
    };
  }
  return null;
}
function detectCodeBlockDecline(first, second) {
  const avgCodeFirst = average(first.map((t) => t.codeBlocks));
  const avgCodeSecond = average(second.map((t) => t.codeBlocks));
  if (avgCodeFirst >= 1 && avgCodeSecond < avgCodeFirst * 0.3) {
    return {
      type: "quality-decline",
      turn: second[0].index,
      score: 50,
      description: "Less code, more talk",
      details: `Code blocks dropped from ${avgCodeFirst.toFixed(1)} to ${avgCodeSecond.toFixed(1)} per response`
    };
  }
  return null;
}
function detectSlidingWindowDecline(turns) {
  const signals2 = [];
  if (turns.length < 8) return signals2;
  const windowSize = Math.max(3, Math.floor(turns.length / 5));
  for (let i = windowSize; i < turns.length - windowSize; i++) {
    const before = turns.slice(i - windowSize, i);
    const after = turns.slice(i, i + windowSize);
    const qualityBefore = computeWindowQuality(before);
    const qualityAfter = computeWindowQuality(after);
    if (qualityBefore > 0 && qualityAfter / qualityBefore < 0.5) {
      signals2.push({
        type: "quality-decline",
        turn: turns[i].index,
        score: 70,
        description: "Quality cliff detected",
        details: `Sharp quality drop at turn ${turns[i].index}`
      });
      break;
    }
  }
  return signals2;
}
function computeWindowQuality(turns) {
  const avgLength = average(turns.map((t) => t.wordCount));
  const avgCode = average(turns.map((t) => t.codeBlocks));
  const avgHedging = average(turns.map((t) => t.hedgingCount));
  return avgLength * 0.5 + avgCode * 100 - avgHedging * 20;
}
function average(nums) {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}
function scoreQuality(signals2) {
  const qualitySignals = signals2.filter((s) => s.type === "quality-decline");
  if (qualitySignals.length === 0) return 0;
  const avg = qualitySignals.reduce((sum, s) => sum + s.score, 0) / qualitySignals.length;
  return Math.min(100, avg + qualitySignals.length * 5);
}

// src/detect/saturation.ts
init_esm_shims();
function detectSaturation(turns) {
  const signals2 = [];
  const totalChars = turns.reduce((sum, t) => sum + t.text.length, 0);
  const estimatedTokens = Math.ceil(totalChars / CHARS_PER_TOKEN);
  const saturationPct = estimatedTokens / CONTEXT_LIMIT * 100;
  if (saturationPct >= 80) {
    signals2.push({
      type: "saturation",
      turn: turns[turns.length - 1]?.index ?? 0,
      score: 90,
      description: "Context window nearly full",
      details: `~${formatTokens(estimatedTokens)} tokens used (${Math.round(saturationPct)}% of ${formatTokens(CONTEXT_LIMIT)})`
    });
  } else if (saturationPct >= 60) {
    signals2.push({
      type: "saturation",
      turn: turns[turns.length - 1]?.index ?? 0,
      score: 60,
      description: "Context saturation rising",
      details: `~${formatTokens(estimatedTokens)} tokens used (${Math.round(saturationPct)}% of ${formatTokens(CONTEXT_LIMIT)})`
    });
  } else if (saturationPct >= 40) {
    signals2.push({
      type: "saturation",
      turn: turns[turns.length - 1]?.index ?? 0,
      score: 30,
      description: "Context usage moderate",
      details: `~${formatTokens(estimatedTokens)} tokens used (${Math.round(saturationPct)}%)`
    });
  }
  if (turns.length >= 10) {
    const firstQuarter = turns.slice(0, Math.floor(turns.length / 4));
    const lastQuarter = turns.slice(-Math.floor(turns.length / 4));
    const rateFirst = firstQuarter.reduce((s, t) => s + t.text.length, 0) / Math.max(1, firstQuarter.length);
    const rateLast = lastQuarter.reduce((s, t) => s + t.text.length, 0) / Math.max(1, lastQuarter.length);
    if (rateFirst > 0 && rateLast / rateFirst > 2) {
      signals2.push({
        type: "saturation",
        turn: lastQuarter[0]?.index ?? 0,
        score: 40,
        description: "Token accumulation accelerating",
        details: `Message sizes grew ${(rateLast / rateFirst).toFixed(1)}x from session start`
      });
    }
  }
  return signals2;
}
function formatTokens(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return String(n);
}
function scoreSaturation(signals2) {
  const saturationSignals = signals2.filter((s) => s.type === "saturation");
  if (saturationSignals.length === 0) return 0;
  return Math.min(100, Math.max(...saturationSignals.map((s) => s.score)));
}

// src/detect/index.ts
var SIGNAL_WEIGHTS = {
  violation: 0.25,
  circular: 0.25,
  repairLoop: 0.25,
  quality: 0.15,
  saturation: 0.1
};
function analyzeTranscript(messages) {
  const turns = parseAllTurns(messages);
  const totalTurns = turns.filter((t) => t.type === "assistant").length;
  const signals2 = [
    ...detectViolations(turns),
    ...detectCircular(turns),
    ...detectRepairLoops(turns),
    ...detectQualityDecline(turns),
    ...detectSaturation(turns)
  ];
  signals2.sort((a, b) => a.turn - b.turn);
  const violationScore = scoreViolations(signals2);
  const circularScore = scoreCircular(signals2);
  const repairLoopScore = scoreRepairLoops(signals2);
  const qualityScore = scoreQuality(signals2);
  const saturationScore = scoreSaturation(signals2);
  const combined = Math.round(
    violationScore * SIGNAL_WEIGHTS.violation + circularScore * SIGNAL_WEIGHTS.circular + repairLoopScore * SIGNAL_WEIGHTS.repairLoop + qualityScore * SIGNAL_WEIGHTS.quality + saturationScore * SIGNAL_WEIGHTS.saturation
  );
  const level = getRotLevel(combined);
  const rotPoint = findRotPoint(signals2);
  const sessionDuration = computeSessionDuration(messages);
  return {
    score: {
      violationScore,
      circularScore,
      repairLoopScore,
      qualityScore,
      saturationScore,
      combined,
      level,
      turn: totalTurns,
      rotPoint
    },
    signals: signals2,
    turns,
    sessionDuration,
    totalTurns
  };
}
function parseAllTurns(messages) {
  const turns = [];
  let turnIndex = 0;
  for (const msg of messages) {
    const text = getMessageText(msg);
    if (!text) continue;
    turnIndex++;
    const toolCalls = extractToolCalls(msg);
    const codeBlocks = countCodeBlocks(text);
    const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
    const hedgingCount = msg.type === "assistant" ? countHedgingPhrases(text) : 0;
    turns.push({
      index: turnIndex,
      type: msg.type,
      text,
      timestamp: msg.timestamp,
      toolCalls,
      codeBlocks,
      wordCount,
      hedgingCount
    });
  }
  return turns;
}
function extractToolCalls(msg) {
  const tools = [];
  if (Array.isArray(msg.message.content)) {
    for (const block of msg.message.content) {
      if (block.type === "tool_use" || block.type === "tool_call") {
        const b = block;
        const input = b.input;
        tools.push({
          toolName: b.name || "unknown",
          filePath: input?.file_path || input?.path || input?.filePath || void 0,
          input: input ? JSON.stringify(input).substring(0, 200) : void 0
        });
      }
      if (block.type === "tool_result") {
        const b = block;
        const content = b.content;
        if (content && /(?:error|Error|FAIL|exit code [1-9])/.test(content)) {
          const lastTool = tools[tools.length - 1];
          if (lastTool) {
            lastTool.exitCode = 1;
            lastTool.error = content.substring(0, 200);
          }
        }
      }
    }
  }
  if (typeof msg.message.content === "string") {
    const text = msg.message.content;
    const toolPattern = /(?:Running|Executing|Called)\s+`?(\w+)`?\s+(?:on|with|for)\s+[`"']?([^\s`"'\n]+)/gi;
    let match;
    while ((match = toolPattern.exec(text)) !== null) {
      tools.push({
        toolName: match[1],
        filePath: match[2]
      });
    }
  }
  return tools;
}
function countCodeBlocks(text) {
  const matches = text.match(/```/g);
  return matches ? Math.floor(matches.length / 2) : 0;
}
function getRotLevel(score) {
  if (score <= 20) return "healthy";
  if (score <= 45) return "degrading";
  return "rotted";
}
function findRotPoint(signals2) {
  const significant = signals2.filter((s) => s.score >= 60);
  if (significant.length === 0) return null;
  return Math.min(...significant.map((s) => s.turn));
}
function computeSessionDuration(messages) {
  if (messages.length < 2) return "0m";
  const first = messages[0].timestamp;
  const last = messages[messages.length - 1].timestamp;
  if (!first || !last) {
    const turns = messages.filter((m) => m.type === "assistant").length;
    const estimatedMinutes = turns * 3;
    if (estimatedMinutes >= 60) {
      return `${Math.floor(estimatedMinutes / 60)}h ${estimatedMinutes % 60}m`;
    }
    return `${estimatedMinutes}m`;
  }
  try {
    const startMs = new Date(first).getTime();
    const endMs = new Date(last).getTime();
    const durationMs = endMs - startMs;
    const minutes = Math.round(durationMs / 6e4);
    if (minutes >= 60) {
      return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  } catch {
    return "?";
  }
}

// src/cli/scan.ts
async function runScan(options) {
  const targetPath = resolveScanPath(options.path);
  if (!targetPath) {
    console.log(source_default.yellow("No transcript files found."));
    console.log("");
    console.log("Usage:");
    console.log(`  ${source_default.bold("openrot scan")} ~/.claude/projects/`);
    console.log(`  ${source_default.bold("openrot scan")} <path-to-session.jsonl>`);
    console.log("");
    console.log("Claude Code stores transcripts in:");
    console.log(source_default.dim(`  ${path13.join(os11.homedir(), ".claude", "projects")}`));
    return;
  }
  const transcripts = findTranscripts(targetPath);
  if (transcripts.length === 0) {
    console.log(source_default.yellow("No .jsonl transcript files found at:"));
    console.log(source_default.dim(`  ${targetPath}`));
    return;
  }
  console.log("");
  if (transcripts.length === 1) {
    const result = analyzeFile(transcripts[0]);
    if (result) {
      renderSingleSession(result.result, result.sessionId, result.file);
      if (options.verbose) renderVerbose(result.result);
    }
  } else {
    renderMultiSession(transcripts);
    if (options.verbose) {
      console.log(source_default.dim("  (--verbose only works with single file scans)"));
      console.log("");
    }
  }
}
function resolveScanPath(input) {
  if (input) {
    const resolved = path13.resolve(input);
    if (fs13.existsSync(resolved)) return resolved;
    if (input.startsWith("~")) {
      const expanded = path13.join(os11.homedir(), input.slice(1));
      if (fs13.existsSync(expanded)) return expanded;
    }
    return null;
  }
  const claudeDir = path13.join(os11.homedir(), ".claude", "projects");
  if (fs13.existsSync(claudeDir)) return claudeDir;
  return null;
}
function analyzeFile(file) {
  try {
    const messages = parseTranscript(file);
    if (messages.length === 0) return null;
    const result = analyzeTranscript(messages);
    const sessionId = path13.basename(file, ".jsonl").substring(0, 8);
    return { result, sessionId, file };
  } catch {
    return null;
  }
}
function renderSingleSession(result, sessionId, file) {
  const { score, signals: signals2, totalTurns, sessionDuration } = result;
  const levelColor = getLevelColor(score.level);
  const qualityBar = renderQualityBar(score.combined);
  const levelLabel = score.level.toUpperCase();
  console.log(source_default.dim("\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510"));
  console.log(source_default.dim("\u2502") + source_default.bold("  OpenRot \u2014 Session Analysis") + " ".repeat(21) + source_default.dim("\u2502"));
  console.log(source_default.dim("\u2502") + `  Session: ${source_default.bold(sessionId)} (${sessionDuration}, ${totalTurns} turns)` + padRight(45 - sessionId.length - sessionDuration.length - String(totalTurns).length) + source_default.dim("\u2502"));
  console.log(source_default.dim("\u2502") + `  Quality: ${qualityBar} ${levelColor(levelLabel)}` + " ".repeat(Math.max(1, 7 - levelLabel.length)) + source_default.dim("\u2502"));
  console.log(source_default.dim("\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518"));
  if (totalTurns > 0) {
    console.log("");
    console.log(source_default.bold("Timeline:"));
    renderTimeline(totalTurns, score.rotPoint);
  }
  if (signals2.length > 0) {
    console.log("");
    console.log(source_default.bold("Signals:"));
    const displayed = signals2.filter((s) => s.score >= 40).slice(0, 10);
    for (const signal of displayed) {
      const icon = signal.score >= 70 ? "\u{1F534}" : "\u26A0\uFE0F ";
      const turnStr = source_default.dim(`Turn ${String(signal.turn).padStart(3)}`);
      console.log(`  ${icon} ${turnStr}  ${source_default.bold(signal.description)}`);
      if (signal.details) {
        console.log(`           ${source_default.dim(signal.details)}`);
      }
    }
  }
  console.log("");
  console.log(source_default.bold("\u2501".repeat(49)));
  if (score.rotPoint && score.level !== "healthy") {
    const wastedTurns = totalTurns - score.rotPoint;
    const wastedMinutes = estimateMinutes(wastedTurns);
    console.log(levelColor(`${wastedTurns} turns of degraded output (~${wastedMinutes} min wasted)`));
    console.log(`Run: ${source_default.bold(`openrot fix --session ${sessionId}`)}`);
  } else if (score.level === "healthy") {
    console.log(source_default.green("Session looks healthy. No degradation detected."));
  } else {
    console.log(levelColor(`Session is ${score.level}. Score: ${score.combined}%`));
  }
  console.log(source_default.bold("\u2501".repeat(49)));
  console.log("");
}
function renderVerbose(result) {
  const { score, signals: signals2 } = result;
  console.log(source_default.bold.cyan("\u2500\u2500\u2500 Verbose Output \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500"));
  console.log("");
  console.log(source_default.bold("Signal Scores:"));
  console.log(`  Violations:      ${formatSignalScore(score.violationScore)} (weight: ${SIGNAL_WEIGHTS.violation * 100}%)`);
  console.log(`  Circular:        ${formatSignalScore(score.circularScore)} (weight: ${SIGNAL_WEIGHTS.circular * 100}%)`);
  console.log(`  Repair loops:    ${formatSignalScore(score.repairLoopScore)} (weight: ${SIGNAL_WEIGHTS.repairLoop * 100}%)`);
  console.log(`  Quality:         ${formatSignalScore(score.qualityScore)} (weight: ${SIGNAL_WEIGHTS.quality * 100}%)`);
  console.log(`  Saturation:      ${formatSignalScore(score.saturationScore)} (weight: ${SIGNAL_WEIGHTS.saturation * 100}%)`);
  console.log(`  ${source_default.bold("Combined:")}        ${formatSignalScore(score.combined)}`);
  console.log("");
  const violationSignals = signals2;
  const verboseLog = violationSignals.__verboseLog;
  const decisions = violationSignals.__decisions;
  if (verboseLog && verboseLog.length > 0) {
    console.log(source_default.bold("Decision Tracking:"));
    for (const entry of verboseLog) {
      const turnStr = source_default.dim(`Turn ${String(entry.turn).padStart(3)}`);
      switch (entry.event) {
        case "decision-added":
          console.log(`  ${source_default.green("+")} ${turnStr}  ${entry.detail}`);
          break;
        case "decision-updated":
          console.log(`  ${source_default.yellow("~")} ${turnStr}  ${entry.detail}`);
          break;
        case "violation":
          console.log(`  ${source_default.red("!")} ${turnStr}  ${entry.detail}`);
          break;
      }
    }
    console.log("");
  }
  if (decisions && decisions.length > 0) {
    const active = decisions.filter((d) => !d.supersededAt);
    const superseded = decisions.filter((d) => d.supersededAt);
    console.log(source_default.bold("Active Decisions:"));
    if (active.length === 0) {
      console.log(source_default.dim("  (none)"));
    } else {
      for (const d of active) {
        console.log(`  ${source_default.green("\u25CF")} ${source_default.dim(`Turn ${d.turn}`)}  ${d.commitment} ${source_default.dim(`(from ${d.source})`)}`);
      }
    }
    if (superseded.length > 0) {
      console.log("");
      console.log(source_default.bold("Superseded Decisions:"));
      for (const d of superseded) {
        console.log(`  ${source_default.dim("\u25CB")} ${source_default.dim(`Turn ${d.turn}`)}  ${source_default.strikethrough(d.commitment)} ${source_default.dim(`(replaced at turn ${d.supersededAt})`)}`);
      }
    }
    console.log("");
  }
  if (signals2.length > 0) {
    console.log(source_default.bold("All Signals (unfiltered):"));
    for (const signal of signals2) {
      const icon = signal.score >= 70 ? "\u{1F534}" : signal.score >= 40 ? "\u26A0\uFE0F " : source_default.dim("\xB7");
      console.log(`  ${icon} ${source_default.dim(`Turn ${String(signal.turn).padStart(3)}`)}  [${signal.type}] score=${signal.score}  ${signal.description}`);
      if (signal.details) {
        console.log(`           ${source_default.dim(signal.details)}`);
      }
    }
    console.log("");
  }
  console.log(source_default.bold.cyan("\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500"));
  console.log("");
}
function formatSignalScore(score) {
  const padded = String(score).padStart(3);
  if (score <= 20) return source_default.green(padded);
  if (score <= 45) return source_default.yellow(padded);
  return source_default.red(padded);
}
function renderMultiSession(transcripts) {
  const sorted = transcripts.map((f) => ({ file: f, mtime: fs13.statSync(f).mtimeMs })).sort((a, b) => b.mtime - a.mtime).slice(0, 20);
  console.log(source_default.bold(`OpenRot \u2014 Scanning ${sorted.length} session${sorted.length > 1 ? "s" : ""}`));
  console.log(source_default.bold("\u2501".repeat(60)));
  console.log("");
  let degradedCount = 0;
  let rottedCount = 0;
  for (const { file } of sorted) {
    const analysis = analyzeFile(file);
    if (!analysis) continue;
    const { result, sessionId } = analysis;
    const { score, totalTurns, sessionDuration } = result;
    if (score.level === "degrading") degradedCount++;
    if (score.level === "rotted") rottedCount++;
    const levelColor = getLevelColor(score.level);
    const icon = score.level === "rotted" ? "\u{1F534}" : score.level === "degrading" ? "\u26A0\uFE0F " : "\u2705";
    const barMini = renderQualityBarMini(score.combined);
    console.log(`  ${icon} ${source_default.bold(sessionId)}  ${barMini}  ${levelColor(score.level.toUpperCase().padEnd(9))}  ${source_default.dim(`${totalTurns} turns, ${sessionDuration}`)}`);
    if (score.rotPoint && score.level !== "healthy") {
      const topSignal = result.signals.filter((s) => s.score >= 60)[0];
      if (topSignal) {
        console.log(`     ${source_default.dim(`\u2514\u2500 ${topSignal.description}: ${topSignal.details || ""}`.substring(0, 70))}`);
      }
    }
  }
  console.log("");
  console.log(source_default.bold("\u2501".repeat(60)));
  if (rottedCount > 0 || degradedCount > 0) {
    const parts = [];
    if (rottedCount > 0) parts.push(source_default.red(`${rottedCount} rotted`));
    if (degradedCount > 0) parts.push(source_default.yellow(`${degradedCount} degrading`));
    console.log(`${parts.join(", ")} out of ${sorted.length} sessions`);
    console.log(`Run ${source_default.bold("openrot scan <session.jsonl>")} for detailed analysis`);
  } else {
    console.log(source_default.green("All recent sessions look healthy."));
  }
  console.log(source_default.bold("\u2501".repeat(60)));
  console.log("");
}
function renderTimeline(totalTurns, rotPoint) {
  const maxWidth = Math.min(totalTurns, 50);
  const scale = totalTurns / maxWidth;
  let timeline = "";
  for (let i = 0; i < maxWidth; i++) {
    const turn = Math.round(i * scale);
    if (rotPoint && turn >= rotPoint) {
      if (turn === Math.round((rotPoint - 1) / scale) * Math.round(scale)) {
        timeline += source_default.dim("\u2502") + source_default.red("\u26A0");
      } else {
        timeline += source_default.red("\u25CF");
      }
    } else {
      timeline += source_default.green("\u25CF");
    }
    timeline += " ";
  }
  console.log(`  ${timeline}`);
  const startLabel = "Turn 1";
  const endLabel = `${totalTurns}`;
  if (rotPoint) {
    const rotPos = Math.round((rotPoint - 1) / totalTurns * maxWidth * 2);
    const padding = " ".repeat(Math.max(0, rotPos - 2));
    console.log(source_default.dim(`  ${startLabel}${padding}${rotPoint}`) + " ".repeat(Math.max(1, maxWidth * 2 - rotPos - endLabel.length - startLabel.length - 2)) + source_default.dim(endLabel));
    console.log(`  ${" ".repeat(Math.max(0, rotPos + startLabel.length - 1))}${source_default.red("\u2514\u2500 rot detected")}`);
  } else {
    console.log(source_default.dim(`  ${startLabel}${" ".repeat(Math.max(1, maxWidth * 2 - startLabel.length - endLabel.length))}${endLabel}`));
  }
}
function renderQualityBar(score) {
  const barWidth = 20;
  const healthyWidth = Math.round((100 - score) / 100 * barWidth);
  const degradedWidth = barWidth - healthyWidth;
  const healthyPart = source_default.green("\u2588".repeat(healthyWidth));
  const degradedPart = source_default.dim("\u2591".repeat(degradedWidth));
  return `${healthyPart}${degradedPart} ${score}%`;
}
function renderQualityBarMini(score) {
  const barWidth = 8;
  const filled = Math.round((100 - score) / 100 * barWidth);
  const empty = barWidth - filled;
  if (score <= 20) return source_default.green("\u2588".repeat(filled) + "\u2591".repeat(empty));
  if (score <= 45) return source_default.yellow("\u2588".repeat(filled) + "\u2591".repeat(empty));
  return source_default.red("\u2588".repeat(filled) + "\u2591".repeat(empty));
}
function getLevelColor(level) {
  if (level === "healthy") return source_default.green;
  if (level === "degrading") return source_default.yellow;
  return source_default.red;
}
function padRight(n) {
  return " ".repeat(Math.max(0, n));
}
function estimateMinutes(turns) {
  return Math.round(turns * 2.5);
}

// src/cli/fix.ts
init_esm_shims();
import fs14 from "fs";
import path14 from "path";
import os12 from "os";
async function runFix(options) {
  const transcript = findTargetTranscript(options.session);
  if (!transcript) {
    console.log(source_default.yellow("No transcript found."));
    console.log("");
    console.log("Usage:");
    console.log(`  ${source_default.bold("openrot fix")}                         Fix the most recent session`);
    console.log(`  ${source_default.bold("openrot fix --session abc123")}        Fix a specific session`);
    console.log("");
    return;
  }
  const messages = parseTranscript(transcript);
  if (messages.length === 0) {
    console.log(source_default.yellow("Transcript is empty."));
    return;
  }
  const result = analyzeTranscript(messages);
  const { score, signals: signals2 } = result;
  const prompt = generateFixPrompt(messages, result);
  console.log("");
  console.log(source_default.bold("\u2501".repeat(60)));
  console.log(prompt);
  console.log(source_default.bold("\u2501".repeat(60)));
  console.log("");
  try {
    const { default: clipboardy } = await Promise.resolve().then(() => (init_clipboardy(), clipboardy_exports));
    await clipboardy.write(prompt);
    console.log(source_default.green("\u2705 Handoff prompt copied to clipboard"));
  } catch {
    console.log(source_default.dim("(Could not copy to clipboard)"));
  }
  const handoffDir = path14.join(os12.homedir(), ".openrot", "handoffs");
  if (!fs14.existsSync(handoffDir)) fs14.mkdirSync(handoffDir, { recursive: true });
  const date = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const projectName = path14.basename(process.cwd());
  const fileName = `${date}-${projectName}.md`;
  const filePath = path14.join(handoffDir, fileName);
  fs14.writeFileSync(filePath, prompt, "utf-8");
  console.log(source_default.dim(`   Saved to ${filePath}`));
  if (score.rotPoint) {
    console.log("");
    console.log(`   Session degraded at turn ${source_default.bold(String(score.rotPoint))}`);
    console.log(`   ${source_default.green("\u2713")} Decisions and progress from before turn ${score.rotPoint} preserved`);
    console.log(`   ${source_default.yellow("\u26A0")} Work after turn ${score.rotPoint} may need re-verification`);
  }
  console.log("");
  console.log(source_default.dim("   Paste into a new session to continue with full context."));
  console.log("");
}
function findTargetTranscript(sessionHint) {
  const claudeDir = path14.join(os12.homedir(), ".claude", "projects");
  if (!fs14.existsSync(claudeDir)) return null;
  const allTranscripts = findTranscripts(claudeDir);
  if (allTranscripts.length === 0) return null;
  if (sessionHint) {
    const match = allTranscripts.find((f) => path14.basename(f).includes(sessionHint));
    if (match) return match;
  }
  return allTranscripts.map((f) => ({ file: f, mtime: fs14.statSync(f).mtimeMs })).sort((a, b) => b.mtime - a.mtime)[0]?.file || null;
}
function generateFixPrompt(messages, result) {
  const { score, signals: signals2 } = result;
  const rotPoint = score.rotPoint;
  const preRotMessages = rotPoint ? messages.filter((_, i) => i < rotPoint * 2) : messages;
  const decisions = extractDecisionsFromMessages(preRotMessages);
  const completed = extractCompletedWork(preRotMessages);
  const inProgress = extractInProgressWork(messages, rotPoint);
  const avoid = extractAvoidPatterns(signals2);
  const projectName = path14.basename(process.cwd());
  const lines = [];
  lines.push(`Continuing a previous session on ${projectName}.`);
  if (rotPoint) {
    lines.push(`The prior session degraded after turn ${rotPoint}.`);
    lines.push("Below is the verified context from before degradation.");
  }
  lines.push("");
  if (decisions.length > 0) {
    lines.push("DECISIONS MADE:");
    for (const d of decisions) lines.push(`- ${d}`);
    lines.push("");
  }
  if (completed.length > 0) {
    lines.push(`COMPLETED${rotPoint ? " (verified before degradation)" : ""}:`);
    for (const c of completed) lines.push(`- ${c}`);
    lines.push("");
  }
  if (inProgress.length > 0) {
    lines.push(`IN PROGRESS${rotPoint ? " (may need re-verification)" : ""}:`);
    for (const ip of inProgress) lines.push(`- ${ip}`);
    lines.push("");
  }
  if (avoid.length > 0) {
    lines.push("AVOID (these caused issues in the prior session):");
    for (const a of avoid) lines.push(`- ${a}`);
    lines.push("");
  }
  const lastTask = inProgress[0] || completed[completed.length - 1] || "the current task";
  lines.push(`Continue from ${lastTask}.`);
  return lines.join("\n");
}
function extractDecisionsFromMessages(messages) {
  const decisions = [];
  const seen = /* @__PURE__ */ new Set();
  for (const msg of messages) {
    if (msg.type !== "assistant") continue;
    const text = getMessageText(msg);
    const extracted = extractWithRegex(text);
    for (const e of extracted) {
      const normalized = e.commitment.toLowerCase();
      if (!seen.has(normalized)) {
        seen.add(normalized);
        decisions.push(e.commitment);
      }
    }
  }
  return decisions.slice(0, 15);
}
function extractCompletedWork(messages) {
  const completed = [];
  const seen = /* @__PURE__ */ new Set();
  const donePatterns = [
    /(?:I've|I have|we've|we have)\s+(?:created|built|implemented|added|set up|configured|written|updated|fixed|completed)\s+(.+?)(?:\.|$)/gi,
    /✅\s*(.+)/g
  ];
  const assistantTexts = getAssistantMessages(messages);
  for (const text of assistantTexts) {
    for (const pattern of donePatterns) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const item = match[1].trim().substring(0, 100);
        if (item.length > 5 && !seen.has(item.toLowerCase())) {
          seen.add(item.toLowerCase());
          completed.push(item);
        }
      }
    }
  }
  return completed.slice(0, 20);
}
function extractInProgressWork(messages, rotPoint) {
  const relevantMessages = rotPoint ? messages.slice(Math.max(0, rotPoint * 2 - 4), rotPoint * 2 + 4) : messages.slice(-6);
  const inProgress = [];
  const progressPatterns = [
    /(?:I'm|I am|let me|I'll)\s+(?:now\s+)?(?:working on|implementing|building|creating|adding|fixing|updating)\s+(.+?)(?:\.|$)/gi,
    /(?:next|now)\s+(?:I'll|let's|we'll)\s+(.+?)(?:\.|$)/gi
  ];
  for (const msg of relevantMessages) {
    const text = getMessageText(msg);
    for (const pattern of progressPatterns) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const item = match[1].trim().substring(0, 100);
        if (item.length > 5) inProgress.push(item);
      }
    }
  }
  return inProgress.slice(0, 5);
}
function extractAvoidPatterns(signals2) {
  const avoid = [];
  for (const signal of signals2) {
    if (signal.type === "violation" && signal.details) {
      avoid.push(signal.details);
    }
    if (signal.type === "circular" && signal.details) {
      avoid.push(`Do not ${signal.details.toLowerCase()}`);
    }
    if (signal.type === "repair-loop" && signal.details) {
      avoid.push(signal.details);
    }
  }
  return avoid.slice(0, 10);
}

// src/hooks/analyze.ts
init_esm_shims();
var logger3 = getLogger();
async function handleAnalyze(hookInput) {
  const startTime = Date.now();
  try {
    const { session_id, transcript_path } = hookInput;
    const messages = tailTranscript(transcript_path, 40);
    if (messages.length === 0) return;
    const totalTurns = countTurns(messages);
    const state = loadState(session_id);
    if (state.lastTurn >= totalTurns && totalTurns > 0) return;
    const result = analyzeTranscript(messages);
    const { score, signals: signals2 } = result;
    state.lastTurn = totalTurns;
    state.turnScores.push({ turn: totalTurns, score: score.combined });
    if (score.rotPoint && !state.rotPoint) {
      state.rotPoint = score.rotPoint;
    }
    if (Date.now() - startTime > 4e3) {
      saveState(state);
      return;
    }
    saveState(state);
    if (score.level === "healthy") {
      return;
    }
    if (score.level === "degrading") {
      const topSignal = signals2.filter((s) => s.score >= 40)[0];
      const detail = topSignal ? ` \u2014 ${topSignal.description.toLowerCase()}` : "";
      process.stderr.write(
        `\u26A0\uFE0F OpenRot: Session degrading (${score.combined}%)${detail}
`
      );
    }
    if (score.level === "rotted") {
      const rotInfo = score.rotPoint ? ` \u2014 quality dropped at turn ${score.rotPoint}` : "";
      process.stderr.write(
        `\u{1F534} OpenRot: Session rotted (${score.combined}%)${rotInfo}. Run: openrot fix
`
      );
    }
    logger3.info("Rot score computed", {
      sessionId: session_id,
      turn: totalTurns,
      score: score.combined,
      level: score.level,
      elapsed: Date.now() - startTime
    });
  } catch (error) {
    logger3.error("Analyze hook error", { error: String(error) });
  }
}
function readHookInput() {
  return new Promise((resolve, reject) => {
    let data = "";
    const timeout = setTimeout(() => {
      reject(new Error("Timeout reading stdin"));
    }, 3e3);
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => {
      clearTimeout(timeout);
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error("Invalid JSON on stdin"));
      }
    });
    process.stdin.on("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });
    process.stdin.resume();
  });
}

// src/hooks/session-start.ts
init_esm_shims();
var logger4 = getLogger();
async function handleSessionStart(hookInput) {
  try {
    const { session_id, cwd } = hookInput;
    const state = createFreshState(session_id);
    saveState(state);
    logger4.info("Session started via hook", {
      sessionId: session_id,
      cwd
    });
  } catch (error) {
    logger4.error("SessionStart hook error", { error: String(error) });
  }
}

// src/hooks/pre-compact.ts
init_esm_shims();
import fs15 from "fs";
import path15 from "path";
import os13 from "os";
var logger5 = getLogger();
async function handlePreCompact(hookInput) {
  try {
    const { session_id, transcript_path, cwd } = hookInput;
    const messages = parseTranscript(transcript_path);
    if (messages.length === 0) return;
    const result = analyzeTranscript(messages);
    const { score } = result;
    const assistantTexts = getAssistantMessages(messages);
    const decisions = [];
    const seen = /* @__PURE__ */ new Set();
    for (const text of assistantTexts) {
      const extracted = extractWithRegex(text);
      for (const e of extracted) {
        const normalized = e.commitment.toLowerCase();
        if (!seen.has(normalized)) {
          seen.add(normalized);
          decisions.push(e.commitment);
        }
      }
    }
    const state = loadState(session_id);
    state.decisions = decisions.map((d, i) => ({
      turn: i + 1,
      commitment: d
    }));
    state.lastTurn = countTurns(messages);
    if (score.rotPoint && !state.rotPoint) {
      state.rotPoint = score.rotPoint;
    }
    saveState(state);
    const snapshotDir = path15.join(os13.homedir(), ".openrot", "snapshots");
    if (!fs15.existsSync(snapshotDir)) fs15.mkdirSync(snapshotDir, { recursive: true });
    const date = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    const snapshotPath = path15.join(snapshotDir, `${date}-${session_id.substring(0, 8)}.json`);
    fs15.writeFileSync(snapshotPath, JSON.stringify({
      sessionId: session_id,
      cwd,
      turn: state.lastTurn,
      score: score.combined,
      level: score.level,
      rotPoint: score.rotPoint,
      decisions,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }, null, 2), "utf-8");
    const decisionCount = decisions.length;
    const levelMsg = score.level === "healthy" ? "" : ` Session health: ${score.combined}%.`;
    process.stderr.write(
      `\u26A0\uFE0F OpenRot: Pre-compaction snapshot saved (${decisionCount} decisions).${levelMsg} Run 'openrot fix' to generate handoff.
`
    );
    logger5.info("Pre-compact snapshot saved", {
      sessionId: session_id,
      cwd,
      decisions: decisionCount,
      score: score.combined
    });
  } catch (error) {
    logger5.error("PreCompact hook error", { error: String(error) });
  }
}

// src/index.ts
var program = new Command();
program.name("openrot").description("A linter for your AI context window. Detects when session quality is degrading.").version("2.0.0");
program.command("analyze").description("Stop hook \u2014 score session health (called by Claude Code)").action(async () => {
  try {
    const input = await readHookInput();
    await handleAnalyze(input);
  } catch (error) {
    getLogger().error("analyze failed", { error: String(error) });
  }
  process.exit(0);
});
program.command("session-start").description("SessionStart hook \u2014 initialize session (called by Claude Code)").action(async () => {
  try {
    const input = await readHookInput();
    await handleSessionStart(input);
  } catch (error) {
    getLogger().error("session-start failed", { error: String(error) });
  }
  process.exit(0);
});
program.command("pre-compact").description("PreCompact hook \u2014 save snapshot before context compaction").action(async () => {
  try {
    const input = await readHookInput();
    await handlePreCompact(input);
  } catch (error) {
    getLogger().error("pre-compact failed", { error: String(error) });
  }
  process.exit(0);
});
program.command("scan").description("Analyze session transcript(s) for context degradation").argument("[path]", "Path to transcript file or directory").option("--verbose", "Show detailed signal breakdown, decision tracking, and scoring").action(async (scanPath, options) => {
  try {
    await runScan({ path: scanPath, verbose: options.verbose });
  } catch (error) {
    console.error(source_default.red("Error:"), error);
    process.exit(1);
  }
});
program.command("fix").description("Generate fresh start prompt with all context preserved").option("--session <id>", "Target a specific session").action(async (options) => {
  try {
    await runFix(options);
  } catch (error) {
    console.error(source_default.red("Error:"), error);
    process.exit(1);
  }
});
program.command("init").description("Set up OpenRot (auto-detects editors, registers hooks)").action(async () => {
  try {
    await runInit();
  } catch (error) {
    console.error(source_default.red("Error during init:"), error);
    process.exit(1);
  }
});
program.command("status").description("Show current session health and decisions").action(async () => {
  try {
    await runStatus();
  } catch (error) {
    console.error(source_default.red("Error:"), error);
    process.exit(1);
  }
});
program.command("serve").description("Start the MCP server (for Cursor/VS Code/Antigravity)").action(async () => {
  try {
    await startServer();
  } catch (error) {
    console.error(source_default.red("Error starting server:"), error);
    process.exit(1);
  }
});
program.command("config").description("Change settings").action(async () => {
  try {
    await runConfig();
  } catch (error) {
    console.error(source_default.red("Error:"), error);
    process.exit(1);
  }
});
program.command("test").description("Verify everything works").action(async () => {
  try {
    await runTest();
  } catch (error) {
    console.error(source_default.red("Error:"), error);
    process.exit(1);
  }
});
program.command("model").description("Switch model provider and model").option("--provider <provider>", "Provider: ollama, openai, anthropic, gemini, regex").option("--model <model>", "Model name").option("--key <key>", "API key").action(async (options) => {
  try {
    await runModel(options);
  } catch (error) {
    console.error(source_default.red("Error:"), error);
    process.exit(1);
  }
});
program.parse();
//# sourceMappingURL=index.js.map