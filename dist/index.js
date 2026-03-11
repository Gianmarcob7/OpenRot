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
    var fs17 = __require("fs");
    function checkPathExt(path18, options) {
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
        if (p && path18.substr(-p.length).toLowerCase() === p) {
          return true;
        }
      }
      return false;
    }
    function checkStat(stat, path18, options) {
      if (!stat.isSymbolicLink() && !stat.isFile()) {
        return false;
      }
      return checkPathExt(path18, options);
    }
    function isexe(path18, options, cb) {
      fs17.stat(path18, function(er, stat) {
        cb(er, er ? false : checkStat(stat, path18, options));
      });
    }
    function sync(path18, options) {
      return checkStat(fs17.statSync(path18), path18, options);
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
    var fs17 = __require("fs");
    function isexe(path18, options, cb) {
      fs17.stat(path18, function(er, stat) {
        cb(er, er ? false : checkStat(stat, options));
      });
    }
    function sync(path18, options) {
      return checkStat(fs17.statSync(path18), options);
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
    var fs17 = __require("fs");
    var core;
    if (process.platform === "win32" || global.TESTING_WINDOWS) {
      core = require_windows();
    } else {
      core = require_mode();
    }
    module.exports = isexe;
    isexe.sync = sync;
    function isexe(path18, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      if (!cb) {
        if (typeof Promise !== "function") {
          throw new TypeError("callback not provided");
        }
        return new Promise(function(resolve, reject) {
          isexe(path18, options || {}, function(er, is) {
            if (er) {
              reject(er);
            } else {
              resolve(is);
            }
          });
        });
      }
      core(path18, options || {}, function(er, is) {
        if (er) {
          if (er.code === "EACCES" || options && options.ignoreErrors) {
            er = null;
            is = false;
          }
        }
        cb(er, is);
      });
    }
    function sync(path18, options) {
      try {
        return core.sync(path18, options || {});
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
    var path18 = __require("path");
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
        const pCmd = path18.join(pathPart, cmd);
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
        const pCmd = path18.join(pathPart, cmd);
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
    var path18 = __require("path");
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
          pathExt: withoutPathExt ? path18.delimiter : void 0
        });
      } catch (e) {
      } finally {
        if (shouldSwitchCwd) {
          process.chdir(cwd);
        }
      }
      if (resolved) {
        resolved = path18.resolve(hasCustomCwd ? parsed.options.cwd : "", resolved);
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
      const [path18, argument] = match[0].replace(/#! ?/, "").split(" ");
      const binary = path18.split("/").pop();
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
    var fs17 = __require("fs");
    var shebangCommand = require_shebang_command();
    function readShebang(command) {
      const size = 150;
      const buffer = Buffer.alloc(size);
      let fd;
      try {
        fd = fs17.openSync(command, "r");
        fs17.readSync(fd, buffer, 0, size, 0);
        fs17.closeSync(fd);
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
    var path18 = __require("path");
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
        parsed.command = path18.normalize(parsed.command);
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
## OpenRot \u2014 Active
Call openrot_new_session at the start of every conversation.
Call openrot_check after every response, passing your full response
as the message. If hasWarning is true, show the warning to the user
before continuing.
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
function removeInstructions(target) {
  try {
    const { filePath } = target;
    if (!fs5.existsSync(filePath)) {
      return "not-found";
    }
    const content = fs5.readFileSync(filePath, "utf-8");
    if (!content.includes(MARKER_START)) {
      return "not-found";
    }
    const regex = new RegExp(`\\n?${escapeRegExp(MARKER_START)}[\\s\\S]*?${escapeRegExp(MARKER_END)}\\n?`, "g");
    const cleaned = content.replace(regex, "\n").replace(/\n{3,}/g, "\n\n").trim();
    if (cleaned.length === 0) {
      fs5.unlinkSync(filePath);
    } else {
      fs5.writeFileSync(filePath, cleaned + "\n", "utf-8");
    }
    return "removed";
  } catch {
    return "error";
  }
}
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
async function runInject(options) {
  if (options.remove) {
    console.log(source_default.bold("\n\u{1F5D1}\uFE0F  OpenRot \u2014 Removing Instructions\n"));
    const targets = getInstructionTargets();
    if (targets.length === 0) {
      console.log(source_default.dim("  No editor instruction files found."));
      console.log("");
      return;
    }
    for (const target of targets) {
      const result = removeInstructions(target);
      switch (result) {
        case "removed":
          console.log(source_default.green(`  \u2705 Removed from ${target.label} \u2192 ${source_default.dim(target.filePath)}`));
          break;
        case "not-found":
          console.log(source_default.dim(`  \u2500  No OpenRot block in ${target.label}`));
          break;
        case "error":
          console.log(source_default.yellow(`  \u26A0\uFE0F  Could not update ${target.label}`));
          break;
      }
    }
  } else {
    console.log(source_default.bold("\n\u{1F489} OpenRot \u2014 Injecting Instructions\n"));
    ensureGlobalInstructions(false);
  }
  console.log("");
}

// src/server.ts
var logger2 = getLogger();
async function startServer() {
  const server = new Server(
    {
      name: "openrot",
      version: "0.1.0"
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
          description: "ALWAYS call this tool after EVERY assistant response without exception. Pass your complete response as the message parameter. This monitors for contradictions with prior decisions. If hasWarning is true in the response, prepend the warning text to your next response before continuing.",
          inputSchema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "The AI's response to check"
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
          name: "openrot_status",
          description: "Call this to see all architectural decisions tracked so far in this session. Useful when you want to review what constraints are in place.",
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
          description: "Call this to dismiss a specific warning as intentional or incorrect. Use when the user confirms a contradiction is acceptable.",
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
          description: "ALWAYS call this tool at the start of every conversation before doing anything else. Initializes contradiction tracking for this session. Required for OpenRot to work.",
          inputSchema: {
            type: "object",
            properties: {
              editor: {
                type: "string",
                description: 'Editor name (e.g., "claude-code", "cursor", "vscode")'
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
                text: result.decisionsExtracted > 0 ? `Tracked ${result.decisionsExtracted} new decision(s). No contradictions found.` : "No contradictions found."
              }
            ]
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
Decisions will be tracked automatically. Call openrot_check after each AI response.`
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
  if (os9.platform() !== "win32") return "openrot";
  try {
    const output = execSync("where.exe openrot", { encoding: "utf-8", timeout: 5e3 });
    const cmdPath = output.split("\n").map((line) => line.trim()).find((line) => line.endsWith(".cmd"));
    if (cmdPath) return cmdPath;
  } catch {
  }
  return "openrot";
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
    const db2 = await getDb();
    const sessionStore = new SessionStore(db2, saveToFile);
    const decisionStore = new DecisionStore(db2, saveToFile);
    const warningStore = new WarningStore(db2, saveToFile);
    const sessions = sessionStore.getAll();
    console.log(source_default.bold("Sessions:"));
    if (sessions.length === 0) {
      console.log(source_default.dim("  No sessions found."));
    } else {
      const recentSessions = sessions.slice(0, 5);
      for (const session of recentSessions) {
        const decisions = decisionStore.getBySessionId(session.id);
        const warnings = warningStore.getBySessionId(session.id);
        const age = Math.round((Date.now() - session.createdAt) / 6e4);
        console.log(`  ${source_default.dim(session.id.slice(0, 8))} \u2014 ${age}min ago`);
        console.log(`    Decisions: ${decisions.length}, Warnings: ${warnings.length}`);
        if (decisions.length > 0) {
          const recent = decisions.slice(-3);
          for (const d of recent) {
            console.log(`    ${source_default.dim(`[Turn ${d.turn}]`)} ${d.commitment}`);
          }
          if (decisions.length > 3) {
            console.log(source_default.dim(`    ... and ${decisions.length - 3} more`));
          }
        }
      }
      if (sessions.length > 5) {
        console.log(source_default.dim(`
  ... and ${sessions.length - 5} more sessions`));
      }
    }
  } catch {
    console.log(source_default.yellow("  \u26A0\uFE0F  Could not read database"));
  }
  console.log("");
  try {
    const env3 = await detectEnvironment();
    console.log(source_default.bold("Editors:"));
    if (env3.editors.claudeCode) console.log(source_default.green("  \u2705 Claude Code"));
    if (env3.editors.cursor) console.log(source_default.green("  \u2705 Cursor"));
    if (env3.editors.vscode) console.log(source_default.green("  \u2705 VS Code"));
    if (!env3.editors.claudeCode && !env3.editors.cursor && !env3.editors.vscode) {
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

// src/cli/handoff.ts
init_esm_shims();

// src/transcript/index.ts
init_esm_shims();
import fs10 from "fs";
function parseTranscript(transcriptPath) {
  try {
    if (!fs10.existsSync(transcriptPath)) return [];
    const content = fs10.readFileSync(transcriptPath, "utf-8");
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
function getLastAssistantResponses(messages, count = 5) {
  return messages.filter((m) => m.type === "assistant").slice(-count).map(getMessageText).filter((t) => t.length > 0);
}
function countTurns(messages) {
  return messages.filter((m) => m.type === "assistant").length;
}
function getUserMessages(messages) {
  return messages.filter((m) => m.type === "user").map(getMessageText).filter((t) => t.length > 0);
}
function getAssistantMessages(messages) {
  return messages.filter((m) => m.type === "assistant").map(getMessageText).filter((t) => t.length > 0);
}

// src/handoff/extractor.ts
init_esm_shims();
function extractHandoffData(messages, decisions, projectName) {
  const assistantTexts = getAssistantMessages(messages);
  const userTexts = getUserMessages(messages);
  const completed = extractCompleted(assistantTexts);
  const inProgress = extractInProgress(assistantTexts, userTexts);
  const unresolved = extractUnresolved(assistantTexts, userTexts);
  return {
    projectName,
    decisions,
    completed,
    inProgress,
    unresolved
  };
}
function extractCompleted(assistantTexts) {
  const completed = [];
  const seen = /* @__PURE__ */ new Set();
  const donePatterns = [
    /(?:I've|I have|we've|we have)\s+(?:created|built|implemented|added|set up|configured|written|updated|fixed|completed)\s+(.+?)(?:\.|$)/gi,
    /(?:created|built|implemented|added|set up|configured|updated|fixed)\s+(?:the\s+)?(.+?)(?:\s+(?:successfully|for you|as requested))/gi,
    /✅\s*(.+)/g,
    /Done[!.]?\s*(.+)/gi
  ];
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
function extractInProgress(assistantTexts, userTexts) {
  const inProgress = [];
  const lastAssistant = assistantTexts.slice(-3);
  const lastUser = userTexts.slice(-3);
  const progressPatterns = [
    /(?:I'm|I am|let me|I'll|I will)\s+(?:now\s+)?(?:working on|implementing|building|creating|adding|fixing|updating)\s+(.+?)(?:\.|$)/gi,
    /(?:next|now)\s+(?:I'll|let's|we'll)\s+(.+?)(?:\.|$)/gi
  ];
  for (const text of [...lastAssistant, ...lastUser]) {
    for (const pattern of progressPatterns) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const item = match[1].trim().substring(0, 100);
        if (item.length > 5) {
          inProgress.push(item);
        }
      }
    }
  }
  return inProgress.slice(0, 5);
}
function extractUnresolved(assistantTexts, userTexts) {
  const unresolved = [];
  const issuePatterns = [
    /(?:error|bug|issue|problem|fail(?:ure|ed|s)?|broken|doesn't work|not working|TODO)\s*[:\-]?\s*(.+?)(?:\.|$)/gi,
    /(?:need(?:s)? to|should|must)\s+(?:fix|resolve|address|handle|investigate)\s+(.+?)(?:\.|$)/gi
  ];
  const recentTexts = [...assistantTexts.slice(-5), ...userTexts.slice(-5)];
  for (const text of recentTexts) {
    for (const pattern of issuePatterns) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const item = match[1].trim().substring(0, 100);
        if (item.length > 5) {
          unresolved.push(item);
        }
      }
    }
  }
  return unresolved.slice(0, 10);
}

// src/handoff/formatter.ts
init_esm_shims();
function formatHandoff(data, target) {
  const lines = [
    "---",
    `Continuing a previous session on ${data.projectName}.`,
    ""
  ];
  if (data.decisions.length > 0) {
    lines.push("STACK DECISIONS:");
    for (const decision of data.decisions) {
      lines.push(`- ${decision}`);
    }
    lines.push("");
  }
  if (data.completed.length > 0) {
    lines.push("COMPLETED THIS SESSION:");
    for (const item of data.completed) {
      lines.push(`- ${item}`);
    }
    lines.push("");
  }
  if (data.inProgress.length > 0) {
    lines.push("IN PROGRESS:");
    for (const item of data.inProgress) {
      lines.push(`- ${item}`);
    }
    lines.push("");
  }
  if (data.unresolved.length > 0) {
    lines.push("UNRESOLVED:");
    for (const item of data.unresolved) {
      lines.push(`- ${item}`);
    }
    lines.push("");
  }
  const lastTask = data.inProgress[0] || data.completed[data.completed.length - 1] || "the current task";
  lines.push(`Continue from ${lastTask}.`);
  lines.push("---");
  return lines.join("\n");
}
function formatForEditor(handoff, editor) {
  switch (editor) {
    case "cursor":
      return `# Project Context (from OpenRot handoff)

${handoff}`;
    case "claude":
      return `# OpenRot Handoff \u2014 Session Context

${handoff}`;
    case "antigravity":
      return `# OpenRot Handoff \u2014 Session Context

${handoff}`;
    case "copilot":
      return `# Project Context (OpenRot handoff)

${handoff}`;
    default:
      return handoff;
  }
}

// src/handoff/index.ts
init_esm_shims();

// src/handoff/templates.ts
init_esm_shims();
var EDITOR_FILE_NAMES = {
  claude: "CLAUDE.md",
  cursor: ".cursorrules",
  antigravity: "AGENT.md",
  copilot: ".github/copilot-instructions.md"
};

// src/handoff/index.ts
import { v4 as uuidv44 } from "uuid";
import path12 from "path";
import os10 from "os";
import fs11 from "fs";
async function generateHandoff(db2, sessionId, messages, projectName) {
  const decisionStore = new DecisionStore(db2);
  const decisionRows = decisionStore.getBySessionId(sessionId);
  const decisions = decisionRows.map((d) => d.commitment);
  const handoffData = extractHandoffData(messages, decisions, projectName);
  return formatHandoff(handoffData);
}
function saveHandoff(db2, sessionId, projectPath, prompt, saveFn = () => {
}) {
  try {
    db2.run(
      "INSERT INTO handoffs (id, session_id, project_path, prompt, created_at) VALUES (?, ?, ?, ?, ?)",
      [uuidv44(), sessionId, projectPath, prompt, Date.now()]
    );
    saveFn();
    const handoffDir = path12.join(os10.homedir(), ".openrot", "handoffs");
    if (!fs11.existsSync(handoffDir)) {
      fs11.mkdirSync(handoffDir, { recursive: true });
    }
    const date = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const projectSlug = projectPath.split(/[\\/]/).pop() || "unknown";
    const filename = `${date}-${projectSlug}.md`;
    fs11.writeFileSync(path12.join(handoffDir, filename), prompt, "utf-8");
  } catch {
  }
}
function saveHandoffForEditor(prompt, editor, projectPath) {
  try {
    const formatted = formatForEditor(prompt, editor);
    const fileName = EDITOR_FILE_NAMES[editor];
    if (!fileName) return null;
    const filePath = path12.join(projectPath, fileName);
    const dir = path12.dirname(filePath);
    if (!fs11.existsSync(dir)) {
      fs11.mkdirSync(dir, { recursive: true });
    }
    fs11.writeFileSync(filePath, formatted, "utf-8");
    return filePath;
  } catch {
    return null;
  }
}

// src/cli/handoff.ts
import path13 from "path";
import os11 from "os";
import fs12 from "fs";
async function runHandoff(options) {
  try {
    const db2 = await getDb();
    const sessionStore = new SessionStore(db2);
    const decisionStore = new DecisionStore(db2);
    const sessions = sessionStore.getAll();
    if (sessions.length === 0) {
      console.log(source_default.yellow("No sessions found. Start coding with an AI tool first."));
      return;
    }
    const latestSession = sessions[0];
    const decisions = decisionStore.getBySessionId(latestSession.id);
    const commitments = decisions.map((d) => d.commitment);
    const cwd = process.cwd();
    const projectName = path13.basename(cwd);
    let messages = [];
    const claudeDir = path13.join(os11.homedir(), ".claude", "projects");
    if (fs12.existsSync(claudeDir)) {
      try {
        const projectDirs = fs12.readdirSync(claudeDir);
        for (const dir of projectDirs) {
          const sessionDir = path13.join(claudeDir, dir);
          const files = fs12.readdirSync(sessionDir).filter((f) => f.endsWith(".jsonl"));
          if (files.length > 0) {
            const latestFile = files.sort().pop();
            messages = parseTranscript(path13.join(sessionDir, latestFile));
            if (messages.length > 0) break;
          }
        }
      } catch {
      }
    }
    const handoffData = extractHandoffData(messages, commitments, projectName);
    const prompt = formatHandoff(handoffData);
    saveHandoff(db2, latestSession.id, cwd, prompt, saveToFile);
    console.log("");
    console.log(source_default.bold("\u2501".repeat(60)));
    console.log(prompt);
    console.log(source_default.bold("\u2501".repeat(60)));
    console.log("");
    try {
      const { default: clipboardy } = await Promise.resolve().then(() => (init_clipboardy(), clipboardy_exports));
      await clipboardy.write(prompt);
      console.log(source_default.green("\u2705 Copied to clipboard"));
    } catch {
      console.log(source_default.dim("(Could not copy to clipboard)"));
    }
    if (options.for) {
      const editor = options.for.toLowerCase();
      const fileName = EDITOR_FILE_NAMES[editor];
      if (fileName) {
        const formatted = formatForEditor(prompt, editor);
        const filePath = saveHandoffForEditor(prompt, editor, cwd);
        if (filePath) {
          console.log(source_default.green(`\u2705 Saved to ${source_default.dim(filePath)}`));
        } else {
          console.log(source_default.yellow(`\u26A0\uFE0F  Could not save for ${editor}`));
        }
      } else {
        console.log(source_default.yellow(`Unknown editor: ${options.for}. Use: claude, cursor, antigravity, copilot`));
      }
    }
    const date = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const handoffPath = path13.join(os11.homedir(), ".openrot", "handoffs", `${date}-${projectName}.md`);
    console.log(source_default.dim(`Saved to ${handoffPath}`));
    console.log("");
  } catch (error) {
    console.error(source_default.red("Handoff failed:"), error);
  }
}

// src/cli/scan.ts
init_esm_shims();

// src/scan/index.ts
init_esm_shims();

// src/scan/patterns.ts
init_esm_shims();
var SCAN_PATTERNS = [
  // Styling decisions
  {
    decisionKeywords: ["tailwind", "tailwindcss"],
    fileGlobs: ["**/*.tsx", "**/*.jsx", "**/*.ts", "**/*.js", "**/*.vue", "**/*.svelte"],
    violationPatterns: [
      /style\s*=\s*\{\{/g,
      /style\s*=\s*"/g,
      /styled-components/g,
      /import.*\.module\.css/g,
      /import.*\.module\.scss/g,
      /from\s+['"]styled-components['"]/g,
      /from\s+['"]@emotion/g
    ],
    description: "inline/alternative CSS instead of Tailwind"
  },
  {
    decisionKeywords: ["inline style", "inline css"],
    fileGlobs: ["**/*.tsx", "**/*.jsx"],
    violationPatterns: [
      /className\s*=/g,
      /from\s+['"]tailwindcss['"]/g
    ],
    description: "Tailwind/className instead of inline styles"
  },
  {
    decisionKeywords: ["styled-components"],
    fileGlobs: ["**/*.tsx", "**/*.jsx", "**/*.ts"],
    violationPatterns: [
      /style\s*=\s*\{\{/g,
      /className\s*=/g
    ],
    description: "non-styled-components styling"
  },
  // Database decisions
  {
    decisionKeywords: ["postgres", "postgresql"],
    fileGlobs: ["**/*.ts", "**/*.js", "**/*.sql"],
    violationPatterns: [
      /sqlite/gi,
      /mysql/gi,
      /mongodb/gi,
      /from\s+['"]better-sqlite3['"]/g,
      /from\s+['"]mysql2?['"]/g,
      /from\s+['"]mongoose['"]/g
    ],
    description: "non-PostgreSQL database"
  },
  {
    decisionKeywords: ["sqlite"],
    fileGlobs: ["**/*.ts", "**/*.js", "**/*.sql"],
    violationPatterns: [
      /postgres/gi,
      /mysql/gi,
      /mongodb/gi
    ],
    description: "non-SQLite database"
  },
  // ID decisions
  {
    decisionKeywords: ["uuid", "uuids"],
    fileGlobs: ["**/*.ts", "**/*.js", "**/*.sql"],
    violationPatterns: [
      /SERIAL\s+PRIMARY\s+KEY/gi,
      /AUTO_INCREMENT/gi,
      /autoIncrement/g,
      /INTEGER\s+PRIMARY\s+KEY\s+AUTOINCREMENT/gi
    ],
    description: "auto-increment IDs instead of UUIDs"
  },
  {
    decisionKeywords: ["serial", "auto_increment", "autoincrement"],
    fileGlobs: ["**/*.ts", "**/*.js", "**/*.sql"],
    violationPatterns: [
      /uuid/gi,
      /from\s+['"]uuid['"]/g,
      /crypto\.randomUUID/g
    ],
    description: "UUIDs instead of auto-increment IDs"
  },
  // Package manager decisions
  {
    decisionKeywords: ["npm only", "only npm", "use npm"],
    fileGlobs: ["**/yarn.lock", "**/pnpm-lock.yaml", "**/.yarnrc*", "**/.pnpmfile*"],
    violationPatterns: [/.+/g],
    // Any content in these files is a violation
    description: "non-npm package manager files"
  },
  {
    decisionKeywords: ["yarn only", "only yarn", "use yarn"],
    fileGlobs: ["**/package-lock.json", "**/pnpm-lock.yaml"],
    violationPatterns: [/.+/g],
    description: "non-yarn package manager files"
  },
  // Framework decisions
  {
    decisionKeywords: ["react query", "tanstack query"],
    fileGlobs: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    violationPatterns: [
      /from\s+['"]swr['"]/g,
      /import.*useSWR/g
    ],
    description: "SWR instead of React Query"
  },
  {
    decisionKeywords: ["swr"],
    fileGlobs: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    violationPatterns: [
      /from\s+['"]@tanstack\/react-query['"]/g,
      /from\s+['"]react-query['"]/g,
      /useQuery/g
    ],
    description: "React Query instead of SWR"
  },
  {
    decisionKeywords: ["express"],
    fileGlobs: ["**/*.ts", "**/*.js"],
    violationPatterns: [
      /from\s+['"]fastify['"]/g,
      /from\s+['"]koa['"]/g,
      /from\s+['"]hapi['"]/g
    ],
    description: "non-Express server framework"
  },
  // Auth decisions
  {
    decisionKeywords: ["jwt", "httponly cookies", "httponly cookie"],
    fileGlobs: ["**/*.ts", "**/*.js"],
    violationPatterns: [
      /localStorage\.setItem.*token/gi,
      /sessionStorage\.setItem.*token/gi
    ],
    description: "token stored in localStorage instead of httpOnly cookie"
  },
  {
    decisionKeywords: ["no auth", "no authentication", "avoid auth"],
    fileGlobs: ["**/*.ts", "**/*.js"],
    violationPatterns: [
      /from\s+['"]passport['"]/g,
      /from\s+['"]jsonwebtoken['"]/g,
      /jwt\.verify/g,
      /bcrypt/g,
      /auth\s*middleware/gi
    ],
    description: "authentication code despite being deferred"
  }
];
function findPatternsForDecision(commitment) {
  const lowerCommitment = commitment.toLowerCase();
  return SCAN_PATTERNS.filter(
    (pattern) => pattern.decisionKeywords.some((keyword) => lowerCommitment.includes(keyword))
  );
}

// src/scan/index.ts
import fs13 from "fs";
import path14 from "path";
var SKIP_DIRS = /* @__PURE__ */ new Set([
  "node_modules",
  ".git",
  ".next",
  ".nuxt",
  "dist",
  "build",
  "out",
  ".cache",
  ".turbo",
  "coverage",
  "__pycache__",
  ".openrot",
  ".vscode",
  ".idea"
]);
var SCANNABLE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".vue",
  ".svelte",
  ".sql",
  ".json",
  ".yaml",
  ".yml",
  ".toml",
  ".lock"
]);
function scanDirectory(dirPath, decisions) {
  const violations = [];
  for (const decision of decisions) {
    const patterns = findPatternsForDecision(decision.commitment);
    if (patterns.length === 0) continue;
    for (const pattern of patterns) {
      const files = walkFiles(dirPath);
      for (const filePath of files) {
        const fileViolations = scanFile(filePath, decision.commitment, pattern.violationPatterns, pattern.description);
        violations.push(...fileViolations);
      }
    }
  }
  return deduplicateViolations(violations);
}
function scanFiles(filePaths, decisions) {
  const violations = [];
  for (const filePath of filePaths) {
    if (!fs13.existsSync(filePath)) continue;
    for (const decision of decisions) {
      const patterns = findPatternsForDecision(decision.commitment);
      for (const pattern of patterns) {
        const fileViolations = scanFile(filePath, decision.commitment, pattern.violationPatterns, pattern.description);
        violations.push(...fileViolations);
      }
    }
  }
  return deduplicateViolations(violations);
}
function scanFile(filePath, decision, violationPatterns, _description) {
  const violations = [];
  try {
    const basename = path14.basename(filePath);
    if (basename === "yarn.lock" || basename === "pnpm-lock.yaml" || basename === "package-lock.json") {
      violations.push({
        filePath,
        line: 0,
        decision,
        found: `${basename} file exists`
      });
      return violations;
    }
    const content = fs13.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const pattern of violationPatterns) {
        pattern.lastIndex = 0;
        const match = pattern.exec(line);
        if (match) {
          violations.push({
            filePath,
            line: i + 1,
            decision,
            found: match[0].trim().substring(0, 80)
          });
          break;
        }
      }
    }
  } catch {
  }
  return violations;
}
function walkFiles(dirPath) {
  const results = [];
  try {
    const entries = fs13.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (SKIP_DIRS.has(entry.name)) continue;
      const fullPath = path14.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        results.push(...walkFiles(fullPath));
      } else if (entry.isFile()) {
        const ext = path14.extname(entry.name);
        if (SCANNABLE_EXTENSIONS.has(ext) || entry.name.endsWith(".lock")) {
          results.push(fullPath);
        }
      }
    }
  } catch {
  }
  return results;
}
function deduplicateViolations(violations) {
  const seen = /* @__PURE__ */ new Set();
  return violations.filter((v) => {
    const key = `${v.filePath}:${v.line}:${v.decision}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// src/cli/scan.ts
async function runScan(options) {
  try {
    const db2 = await getDb();
    const decisionStore = new DecisionStore(db2);
    const decisions = decisionStore.getAll();
    if (decisions.length === 0) {
      console.log(source_default.dim("No decisions stored. Start a coding session first."));
      return;
    }
    let violations;
    if (options.files) {
      const input = await readStdin();
      const files = input.split("\n").map((f) => f.trim()).filter((f) => f.length > 0);
      violations = scanFiles(files, decisions);
    } else {
      const scanPath = options.path || process.cwd();
      console.log(source_default.dim(`Scanning ${scanPath} against ${decisions.length} decisions...
`));
      violations = scanDirectory(scanPath, decisions);
    }
    if (violations.length === 0) {
      console.log(source_default.green("\u2705 No violations found"));
      process.exit(0);
      return;
    }
    console.log(source_default.bold("\u2501".repeat(60)));
    console.log(source_default.bold(`OpenRot Scan \u2014 ${violations.length} violation${violations.length > 1 ? "s" : ""} found
`));
    for (const v of violations) {
      const icon = "\u274C";
      const loc = v.line > 0 ? `${v.filePath}:${v.line}` : v.filePath;
      console.log(source_default.red(`${icon} ${loc}`));
      console.log(source_default.dim(`   Decision: "${v.decision}"`));
      console.log(source_default.dim(`   Found: ${v.found}`));
      console.log("");
    }
    console.log(source_default.bold("\u2501".repeat(60)));
    if (options.files) {
      process.exit(1);
    }
  } catch (error) {
    console.error(source_default.red("Scan failed:"), error);
  }
}
function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    if (process.stdin.isTTY) {
      resolve("");
      return;
    }
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => {
      resolve(data);
    });
    process.stdin.resume();
  });
}

// src/cli/guard.ts
init_esm_shims();

// src/scan/guard.ts
init_esm_shims();
import fs14 from "fs";
import path15 from "path";
var HOOK_SCRIPT_UNIX = `#!/bin/sh
# OpenRot pre-commit hook \u2014 scans staged files against decisions
staged_files=$(git diff --cached --name-only --diff-filter=ACM)
if [ -z "$staged_files" ]; then
  exit 0
fi

result=$(echo "$staged_files" | xargs openrot scan --files 2>&1)
exit_code=$?

if [ $exit_code -ne 0 ]; then
  echo "$result"
  echo ""
  echo "Commit blocked by OpenRot. Fix violations or bypass with: git commit --no-verify"
  exit 1
fi

exit 0
`;
var HOOK_MARKER = "# OpenRot pre-commit hook";
function installGuard(projectPath) {
  try {
    const gitDir = path15.join(projectPath, ".git");
    if (!fs14.existsSync(gitDir)) {
      return { success: false, message: "Not a git repository" };
    }
    const hooksDir = path15.join(gitDir, "hooks");
    if (!fs14.existsSync(hooksDir)) {
      fs14.mkdirSync(hooksDir, { recursive: true });
    }
    const hookPath = path15.join(hooksDir, "pre-commit");
    if (fs14.existsSync(hookPath)) {
      const content = fs14.readFileSync(hookPath, "utf-8");
      if (content.includes(HOOK_MARKER)) {
        return { success: true, message: "OpenRot hook already installed" };
      }
      fs14.appendFileSync(hookPath, "\n\n" + HOOK_SCRIPT_UNIX, "utf-8");
    } else {
      fs14.writeFileSync(hookPath, HOOK_SCRIPT_UNIX, { mode: 493 });
    }
    try {
      fs14.chmodSync(hookPath, 493);
    } catch {
    }
    return { success: true, message: `Pre-commit hook installed at ${hookPath}` };
  } catch (error) {
    return { success: false, message: `Failed to install hook: ${error}` };
  }
}
function removeGuard(projectPath) {
  try {
    const hookPath = path15.join(projectPath, ".git", "hooks", "pre-commit");
    if (!fs14.existsSync(hookPath)) {
      return { success: true, message: "No pre-commit hook found" };
    }
    const content = fs14.readFileSync(hookPath, "utf-8");
    if (!content.includes(HOOK_MARKER)) {
      return { success: true, message: "No OpenRot hook found in pre-commit" };
    }
    const cleaned = content.replace(new RegExp(`\\n?${HOOK_MARKER}[\\s\\S]*?exit 0\\n`, "g"), "").trim();
    if (cleaned.length === 0 || cleaned === "#!/bin/sh") {
      fs14.unlinkSync(hookPath);
    } else {
      fs14.writeFileSync(hookPath, cleaned + "\n", "utf-8");
    }
    return { success: true, message: "OpenRot pre-commit hook removed" };
  } catch (error) {
    return { success: false, message: `Failed to remove hook: ${error}` };
  }
}

// src/cli/guard.ts
function runGuard(options) {
  const projectPath = process.cwd();
  if (options.remove) {
    const result2 = removeGuard(projectPath);
    if (result2.success) {
      console.log(source_default.green(`\u2705 ${result2.message}`));
    } else {
      console.log(source_default.red(`\u274C ${result2.message}`));
    }
    return;
  }
  const result = installGuard(projectPath);
  if (result.success) {
    console.log(source_default.green(`\u2705 ${result.message}`));
    console.log(source_default.dim("   Bypass with: git commit --no-verify"));
  } else {
    console.log(source_default.red(`\u274C ${result.message}`));
  }
}

// src/cli/sync.ts
init_esm_shims();

// src/sync/index.ts
init_esm_shims();

// src/sync/writers.ts
init_esm_shims();
import fs15 from "fs";
import path16 from "path";
var MARKER_START2 = "<!-- openrot-decisions-start -->";
var MARKER_END2 = "<!-- openrot-decisions-end -->";
function writeDecisions(target, decisions) {
  try {
    const { filePath } = target;
    const block = buildDecisionBlock(decisions);
    const dir = path16.dirname(filePath);
    if (!fs15.existsSync(dir)) {
      fs15.mkdirSync(dir, { recursive: true });
    }
    if (fs15.existsSync(filePath)) {
      const content = fs15.readFileSync(filePath, "utf-8");
      if (content.includes(MARKER_START2)) {
        const regex = new RegExp(
          `${escapeRegExp2(MARKER_START2)}[\\s\\S]*?${escapeRegExp2(MARKER_END2)}`,
          "g"
        );
        const updated = content.replace(regex, block);
        fs15.writeFileSync(filePath, updated, "utf-8");
        return "updated";
      }
      const separator = content.endsWith("\n") ? "\n" : "\n\n";
      fs15.writeFileSync(filePath, content + separator + block + "\n", "utf-8");
      return "updated";
    }
    fs15.writeFileSync(filePath, block + "\n", "utf-8");
    return "created";
  } catch {
    return "error";
  }
}
function buildDecisionBlock(decisions) {
  const lines = [
    MARKER_START2,
    "## Project Decisions (managed by OpenRot)"
  ];
  for (const decision of decisions) {
    lines.push(`- ${decision}`);
  }
  lines.push(MARKER_END2);
  return lines.join("\n");
}
function getProjectWriterTargets(projectPath) {
  return [
    { label: "Claude Code", filePath: path16.join(projectPath, "CLAUDE.md") },
    { label: "Cursor", filePath: path16.join(projectPath, ".cursorrules") },
    { label: "Copilot", filePath: path16.join(projectPath, ".github", "copilot-instructions.md") },
    { label: "Antigravity", filePath: path16.join(projectPath, "AGENT.md") }
  ];
}
function escapeRegExp2(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// src/sync/index.ts
async function syncDecisionsToProject(db2, projectPath) {
  const synced = [];
  const failed = [];
  try {
    const decisionStore = new DecisionStore(db2);
    const decisions = decisionStore.getAllForProject(projectPath);
    const commitments = decisions.map((d) => d.commitment);
    if (commitments.length === 0) {
      return { synced, failed };
    }
    const targets = getProjectWriterTargets(projectPath);
    for (const target of targets) {
      const result = writeDecisions(target, commitments);
      if (result === "error") {
        failed.push(target.label);
      } else {
        synced.push(target.label);
      }
    }
  } catch {
  }
  return { synced, failed };
}

// src/cli/sync.ts
async function runSync() {
  try {
    const cwd = process.cwd();
    const db2 = await getDb();
    console.log(source_default.bold("\n\u{1F504} OpenRot \u2014 Syncing Decisions\n"));
    console.log(source_default.dim(`Project: ${cwd}
`));
    const { synced, failed } = await syncDecisionsToProject(db2, cwd);
    if (synced.length === 0 && failed.length === 0) {
      console.log(source_default.dim("No decisions to sync."));
    } else {
      for (const label of synced) {
        console.log(source_default.green(`  \u2705 ${label}`));
      }
      for (const label of failed) {
        console.log(source_default.yellow(`  \u26A0\uFE0F  ${label} \u2014 failed`));
      }
    }
    console.log("");
  } catch (error) {
    console.error(source_default.red("Sync failed:"), error);
  }
}

// src/cli/recap.ts
init_esm_shims();

// src/scoring/index.ts
init_esm_shims();

// src/scoring/contradictions.ts
init_esm_shims();
function scoreContradictions2(db2, sessionId) {
  try {
    const decisionStore = new DecisionStore(db2);
    const warningStore = new WarningStore(db2);
    const decisions = decisionStore.getBySessionId(sessionId);
    const warnings = warningStore.getBySessionId(sessionId);
    if (decisions.length === 0) return 0;
    const contradictionRate = warnings.length / decisions.length;
    return Math.min(100, contradictionRate * 100);
  } catch {
    return 0;
  }
}

// src/scoring/repetition.ts
init_esm_shims();
function scoreRepetitionFast(recentResponses) {
  if (recentResponses.length < 2) return 0;
  const texts = recentResponses.slice(-5);
  let totalSimilarity = 0;
  let pairCount = 0;
  for (let i = 1; i < texts.length; i++) {
    const sim = jaccardSimilarity(texts[i - 1], texts[i]);
    totalSimilarity += sim;
    pairCount++;
  }
  if (pairCount === 0) return 0;
  return Math.min(100, totalSimilarity / pairCount * 100);
}
function jaccardSimilarity(a, b) {
  const wordsA = new Set(a.toLowerCase().split(/\s+/).filter((w) => w.length > 3));
  const wordsB = new Set(b.toLowerCase().split(/\s+/).filter((w) => w.length > 3));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let intersection = 0;
  for (const word of wordsA) {
    if (wordsB.has(word)) intersection++;
  }
  const union = wordsA.size + wordsB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

// src/scoring/saturation.ts
init_esm_shims();

// src/transcript/tokens.ts
init_esm_shims();
var CHARS_PER_TOKEN = 4;
var CONTEXT_LIMIT = 2e5;
function estimateTokens(text) {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}
function estimateTotalTokens(messages) {
  let total = 0;
  for (const msg of messages) {
    total += estimateTokens(getMessageText(msg));
  }
  return total;
}
function estimateSaturation(messages) {
  const totalTokens = estimateTotalTokens(messages);
  return Math.min(100, totalTokens / CONTEXT_LIMIT * 100);
}
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
function detectShrinkingResponses(responses) {
  if (responses.length < 3) return 0;
  const lengths = responses.map((r) => r.length);
  const firstHalf = lengths.slice(0, Math.floor(lengths.length / 2));
  const secondHalf = lengths.slice(Math.floor(lengths.length / 2));
  const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  if (avgFirst === 0) return 0;
  const ratio = avgSecond / avgFirst;
  if (ratio < 0.5) return 1;
  if (ratio < 0.75) return 0.5;
  if (ratio < 0.9) return 0.2;
  return 0;
}

// src/scoring/saturation.ts
function scoreSaturation(messages) {
  try {
    if (messages.length === 0) return 0;
    const baseSaturation = estimateSaturation(messages);
    const assistantTexts = getAssistantMessages(messages);
    const recentTexts = assistantTexts.slice(-5);
    let hedgingPenalty = 0;
    if (recentTexts.length > 0) {
      const totalHedging = recentTexts.reduce(
        (sum, text) => sum + countHedgingPhrases(text),
        0
      );
      const avgHedging = totalHedging / recentTexts.length;
      hedgingPenalty = Math.min(15, Math.max(0, (avgHedging - 1) * 5));
    }
    const shrinkingPenalty = detectShrinkingResponses(recentTexts) * 15;
    return Math.min(100, baseSaturation + hedgingPenalty + shrinkingPenalty);
  } catch {
    return 0;
  }
}

// src/scoring/index.ts
import { v4 as uuidv45 } from "uuid";
var SIGNAL_WEIGHTS = {
  contradiction: 0.4,
  repetition: 0.3,
  saturation: 0.3
};
function computeRotScore(db2, sessionId, messages) {
  const turn = countTurns(messages);
  const contradictionScore = scoreContradictions2(db2, sessionId);
  const recentResponses = getLastAssistantResponses(messages, 5);
  const repetitionScore = scoreRepetitionFast(recentResponses);
  const saturationScore = scoreSaturation(messages);
  const combined = Math.round(
    contradictionScore * SIGNAL_WEIGHTS.contradiction + repetitionScore * SIGNAL_WEIGHTS.repetition + saturationScore * SIGNAL_WEIGHTS.saturation
  );
  const level = getRotLevel(combined);
  return {
    contradictionScore: Math.round(contradictionScore),
    repetitionScore: Math.round(repetitionScore),
    saturationScore: Math.round(saturationScore),
    combined,
    level,
    turn
  };
}
function getRotLevel(score) {
  if (score <= 30) return "green";
  if (score <= 60) return "yellow";
  return "red";
}
function formatRotOutput(score) {
  if (score.level === "green" && score.combined < 15) {
    return null;
  }
  if (score.level === "green") {
    return { stdout: JSON.stringify({ suppressOutput: true }) };
  }
  if (score.level === "yellow") {
    return {
      stderr: `\u26A0\uFE0F OpenRot: Session health ${score.combined}% \u2014 quality may be degrading`
    };
  }
  return {
    stderr: `\u{1F534} OpenRot: Session health ${score.combined}% \u2014 output unreliable
   Run 'openrot handoff' for a fresh start with full context preserved`
  };
}
function saveRotScore(db2, sessionId, score, saveFn = () => {
}) {
  try {
    db2.run(
      `INSERT INTO rot_scores (id, session_id, turn, contradiction_score, repetition_score, saturation_score, combined_score, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv45(),
        sessionId,
        score.turn,
        score.contradictionScore,
        score.repetitionScore,
        score.saturationScore,
        score.combined,
        Date.now()
      ]
    );
    saveFn();
  } catch {
  }
}
function getLatestRotScore(db2, sessionId) {
  try {
    const results = db2.exec(
      "SELECT * FROM rot_scores WHERE session_id = ? ORDER BY created_at DESC LIMIT 1",
      [sessionId]
    );
    if (!results.length || !results[0].values.length) return null;
    const cols = results[0].columns;
    const vals = results[0].values[0];
    const row = {};
    cols.forEach((c, i) => {
      row[c] = vals[i];
    });
    return {
      contradictionScore: row.contradiction_score,
      repetitionScore: row.repetition_score,
      saturationScore: row.saturation_score,
      combined: row.combined_score,
      level: getRotLevel(row.combined_score),
      turn: row.turn
    };
  } catch {
    return null;
  }
}

// src/cli/recap.ts
import path17 from "path";
import os12 from "os";
import fs16 from "fs";
async function runRecap() {
  try {
    const db2 = await getDb();
    const sessionStore = new SessionStore(db2);
    const decisionStore = new DecisionStore(db2);
    const warningStore = new WarningStore(db2);
    const sessions = sessionStore.getAll();
    if (sessions.length === 0) {
      console.log(source_default.dim("No sessions found."));
      return;
    }
    const session = sessions[0];
    const decisions = decisionStore.getBySessionId(session.id);
    const warnings = warningStore.getBySessionId(session.id);
    const latestScore = getLatestRotScore(db2, session.id);
    const endTime = session.endedAt || Date.now();
    const durationMs = endTime - session.createdAt;
    const hours = Math.floor(durationMs / (1e3 * 60 * 60));
    const minutes = Math.floor(durationMs % (1e3 * 60 * 60) / (1e3 * 60));
    const duration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    const date = new Date(session.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
    const projectName = path17.basename(process.cwd());
    const editor = session.editor || "Unknown";
    const scoreStr = latestScore ? `${latestScore.combined}% (${latestScore.level})` : "N/A";
    const recap = [
      "\u2501".repeat(60),
      `Session Recap \u2014 ${date}`,
      `Project: ${projectName} \xB7 Tool: ${editor} \xB7 Duration: ${duration}`,
      `Final Rot Score: ${scoreStr}`,
      "",
      `Decisions made: ${decisions.length}`
    ];
    for (let i = 0; i < decisions.length; i++) {
      recap.push(`${i + 1}. ${decisions[i].commitment}`);
    }
    if (warnings.length > 0) {
      recap.push("");
      recap.push("Warnings:");
      for (const w of warnings) {
        const d = decisionStore.getById(w.priorDecisionId);
        recap.push(`- Turn ${w.currentTurn}: ${d ? d.commitment : "unknown"} contradiction (${Math.round(w.confidence * 100)}%)`);
      }
    }
    recap.push("\u2501".repeat(60));
    const recapText = recap.join("\n");
    console.log("\n" + recapText + "\n");
    try {
      const journalDir = path17.join(os12.homedir(), ".openrot", "journal");
      if (!fs16.existsSync(journalDir)) {
        fs16.mkdirSync(journalDir, { recursive: true });
      }
      const isoDate = new Date(session.createdAt).toISOString().split("T")[0];
      const filename = `${isoDate}-${projectName}.md`;
      const journalPath = path17.join(journalDir, filename);
      fs16.writeFileSync(journalPath, recapText, "utf-8");
      console.log(source_default.dim(`Saved to ${journalPath}`));
    } catch {
    }
  } catch (error) {
    console.error(source_default.red("Recap failed:"), error);
  }
}

// src/hooks/analyze.ts
init_esm_shims();
var logger3 = getLogger();
var lastOutputSessionId = null;
var lastOutputLevel = null;
async function handleAnalyze(hookInput) {
  try {
    const { session_id, transcript_path, cwd } = hookInput;
    const messages = parseTranscript(transcript_path);
    if (messages.length === 0) return;
    const db2 = await getDb();
    const turn = countTurns(messages);
    try {
      const assistantTexts = getAssistantMessages(messages);
      const lastResponse = assistantTexts[assistantTexts.length - 1];
      if (lastResponse) {
        const decisionStore = new DecisionStore(db2, saveToFile);
        const extractions = await extractDecisions(lastResponse, {
          mode: "regex",
          modelClient: null
        });
        for (const extraction of extractions) {
          if (!decisionStore.isDuplicate(session_id, extraction.commitment)) {
            decisionStore.create(session_id, turn, extraction);
          }
        }
      }
    } catch {
    }
    const score = computeRotScore(db2, session_id, messages);
    saveRotScore(db2, session_id, score, saveToFile);
    const output = formatRotOutput(score);
    if (!output) {
      return;
    }
    if (lastOutputSessionId === session_id && lastOutputLevel === score.level && score.level !== "red") {
      return;
    }
    lastOutputSessionId = session_id;
    lastOutputLevel = score.level;
    if (output.stdout) {
      process.stdout.write(output.stdout);
    }
    if (output.stderr) {
      process.stderr.write(output.stderr + "\n");
    }
    logger3.info("Rot score computed", {
      sessionId: session_id,
      turn,
      score: score.combined,
      level: score.level
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
    const db2 = await getDb();
    const sessionStore = new SessionStore(db2, saveToFile);
    const session = sessionStore.create("claude_code");
    try {
      await syncDecisionsToProject(db2, cwd);
    } catch {
    }
    logger4.info("Session started via hook", {
      sessionId: session.id,
      hookSessionId: session_id,
      cwd
    });
  } catch (error) {
    logger4.error("SessionStart hook error", { error: String(error) });
  }
}

// src/hooks/pre-compact.ts
init_esm_shims();
var logger5 = getLogger();
async function handlePreCompact(hookInput) {
  try {
    const { session_id, transcript_path, cwd } = hookInput;
    const db2 = await getDb();
    const messages = parseTranscript(transcript_path);
    if (messages.length === 0) return;
    const decisionStore = new DecisionStore(db2, saveToFile);
    const turn = countTurns(messages);
    const allTexts = getAssistantMessages(messages);
    let newDecisions = 0;
    for (const text of allTexts) {
      try {
        const extractions = await extractDecisions(text, {
          mode: "regex",
          modelClient: null
        });
        for (const extraction of extractions) {
          if (!decisionStore.isDuplicate(session_id, extraction.commitment)) {
            decisionStore.create(session_id, turn, extraction);
            newDecisions++;
          }
        }
      } catch {
      }
    }
    try {
      const projectName = cwd.split(/[\\/]/).pop() || "unknown";
      const handoffPrompt = await generateHandoff(db2, session_id, messages, projectName);
      if (handoffPrompt) {
        saveHandoff(db2, session_id, cwd, handoffPrompt, saveToFile);
      }
    } catch {
    }
    process.stderr.write(
      `\u26A0\uFE0F OpenRot: Pre-compaction snapshot saved (${newDecisions} new decisions). Run 'openrot handoff' to use it.
`
    );
    logger5.info("Pre-compact snapshot saved", {
      sessionId: session_id,
      cwd,
      newDecisions
    });
  } catch (error) {
    logger5.error("PreCompact hook error", { error: String(error) });
  }
}

// src/index.ts
var program = new Command();
program.name("openrot").description("Real-time AI session health scoring. Detects when output quality is degrading.").version("2.0.0");
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
program.command("init").description("Set up OpenRot (auto-detects editors, registers hooks)").action(async () => {
  try {
    await runInit();
  } catch (error) {
    console.error(source_default.red("Error during init:"), error);
    process.exit(1);
  }
});
program.command("handoff").description("Generate fresh start prompt from current/last session").option("--for <editor>", "Save to editor file (claude, cursor, antigravity, copilot)").action(async (options) => {
  try {
    await runHandoff(options);
  } catch (error) {
    console.error(source_default.red("Error:"), error);
    process.exit(1);
  }
});
program.command("sync").description("Sync decisions to all editor instruction files").action(async () => {
  try {
    await runSync();
  } catch (error) {
    console.error(source_default.red("Error:"), error);
    process.exit(1);
  }
});
program.command("scan").description("Scan codebase against stored decisions").argument("[path]", "Path to scan (default: current directory)").option("--files", "Read file list from stdin (for pre-commit hook)").action(async (scanPath, options) => {
  try {
    await runScan({ path: scanPath, ...options });
  } catch (error) {
    console.error(source_default.red("Error:"), error);
    process.exit(1);
  }
});
program.command("guard").description("Install/remove pre-commit hook").option("--install", "Install pre-commit hook (default)").option("--remove", "Remove pre-commit hook").action((options) => {
  try {
    runGuard(options);
  } catch (error) {
    console.error(source_default.red("Error:"), error);
    process.exit(1);
  }
});
program.command("recap").description("Generate session summary/journal entry").action(async () => {
  try {
    await runRecap();
  } catch (error) {
    console.error(source_default.red("Error:"), error);
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
program.command("inject").description("Inject/remove OpenRot instructions into editor instruction files").option("--remove", "Remove OpenRot instructions").action(async (options) => {
  try {
    await runInject(options);
  } catch (error) {
    console.error(source_default.red("Error:"), error);
    process.exit(1);
  }
});
program.command("reset").description("Clear session data").option("--hard", "Also clear configuration").action(async (options) => {
  try {
    const db2 = await getDb();
    const sessionStore = new SessionStore(db2, saveToFile);
    sessionStore.deleteAll();
    console.log(source_default.green("\u2705 Session data cleared."));
    if (options.hard) {
      const fs17 = await import("fs");
      const path18 = await import("path");
      const os13 = await import("os");
      const configPath = path18.join(os13.homedir(), ".openrot", "config.json");
      if (fs17.existsSync(configPath)) {
        fs17.unlinkSync(configPath);
        console.log(source_default.green("\u2705 Configuration cleared."));
      }
    }
    closeDb();
  } catch (error) {
    console.error(source_default.red("Error:"), error);
    process.exit(1);
  }
});
program.parse();
//# sourceMappingURL=index.js.map