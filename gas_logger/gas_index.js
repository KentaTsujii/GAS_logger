var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var build = {};

var PathUtils = {};

Object.defineProperty(PathUtils, "__esModule", {
  value: true
});
PathUtils.get_filename_from_path = PathUtils.get_directory_name_from_path = void 0;
/**
 * ファイルパスからフォルダ名を取得します
 * @param path
 * @returns
 */
function get_directory_name_from_path(path) {
  return path.split('/').slice(0, -1).join('/');
}
PathUtils.get_directory_name_from_path = get_directory_name_from_path;
/**
 * ファイルパスからファイル名を取得します
 * @param path
 * @returns
 */
function get_filename_from_path(path) {
  return path.split('/').slice(-1)[0];
}
PathUtils.get_filename_from_path = get_filename_from_path;

var FolderUtils = {};

Object.defineProperty(FolderUtils, "__esModule", {
  value: true
});
FolderUtils.delete_dir = FolderUtils.create_dir = FolderUtils.get_or_create_dir = FolderUtils.get_dir = void 0;
/**
 * フォルダを取得します。
 * @param path ファイルパス（/区切り）
 * @returns Folder フォルダを返します。
 */
function get_dir(path) {
  var split_path = path.split("/");
  var root_drive = DriveApp.getRootFolder();
  var ret = root_drive;
  for (var _i = 0, split_path_1 = split_path; _i < split_path_1.length; _i++) {
    var d = split_path_1[_i];
    var tmp_d = ret.getFoldersByName(d);
    if (tmp_d.hasNext()) {
      ret = tmp_d.next();
    } else {
      return null;
    }
  }
  return ret;
}
FolderUtils.get_dir = get_dir;
/**
 * フォルダを取得または作成します。
 * @param path ファイルパス（/区切り）
 * @returns Folder フォルダを返します。
 */
function get_or_create_dir(path) {
  var split_path = path.split("/");
  var root_drive = DriveApp.getRootFolder();
  var ret = root_drive;
  for (var _i = 0, split_path_2 = split_path; _i < split_path_2.length; _i++) {
    var d = split_path_2[_i];
    var tmp_d = ret.getFoldersByName(d);
    if (tmp_d.hasNext()) {
      ret = tmp_d.next();
    } else {
      ret = ret.createFolder(d);
    }
  }
  return ret;
}
FolderUtils.get_or_create_dir = get_or_create_dir;
/**
 * フォルダを取得または作成します。すでに存在する場合はエラーを出します
 * @param path ファイルパス（/区切り）
 * @returns Folder フォルダを返します。
 */
function create_dir(path) {
  if (get_dir(path)) {
    throw "すでにフォルダが存在しています。";
  } else {
    return get_or_create_dir(path);
  }
}
FolderUtils.create_dir = create_dir;
/**
 * フォルダを削除します。
 * @param path
 */
function delete_dir(path) {
  var dir = get_dir(path);
  if (dir) {
    dir.setTrashed(true);
  } else {
    throw "\u6307\u5B9A\u3055\u308C\u305F\u30D5\u30A9\u30EB\u30C0\u306F\u5B58\u5728\u3057\u307E\u305B\u3093\u3002".concat(path);
  }
}
FolderUtils.delete_dir = delete_dir;

var FileUtils = {};

Object.defineProperty(FileUtils, "__esModule", {
  value: true
});
FileUtils.delete_file = FileUtils.create_file = FileUtils.get_or_create_file = FileUtils.get_file = void 0;
var FolderUtils_1 = FolderUtils;
var PathUtils_1 = PathUtils;
/**
 * ファイルを取得します
 * @param path ファイルのフルパス(絶対パスのみ有効。また、ルートディレクトリは/で指定しない)
 * @param document_cls ドキュメント取得オブジェクト。openByIdメソッドが必要で、file id を渡してオブジェクトが返せるクラス
 * @returns document_clsにより取得したファイルオブジェクトを返します
 */
function get_file(path, document_cls) {
  var dir = (0, FolderUtils_1.get_dir)((0, PathUtils_1.get_directory_name_from_path)(path));
  if (!dir) {
    throw "\u6307\u5B9A\u3055\u308C\u305F\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306F\u5B58\u5728\u3057\u307E\u305B\u3093\u3002".concat(path);
  }
  var files = dir.getFilesByName((0, PathUtils_1.get_filename_from_path)(path));
  if (files.hasNext()) {
    return document_cls.openById(files.next().getId());
  } else {
    throw "\u6307\u5B9A\u3055\u308C\u305F\u30D5\u30A1\u30A4\u30EB\u306F\u5B58\u5728\u3057\u307E\u305B\u3093\u3002".concat(path);
  }
}
FileUtils.get_file = get_file;
/**
 * ファイルを取得します。存在しない場合は作成します。
 * @param path ファイルのフルパス(絶対パスのみ有効。また、ルートディレクトリは/で指定しない)
 * @param document_cls ドキュメント取得オブジェクト。openByIdメソッドとcreateメソッドが必要で、ファイル名を渡してオブジェクトを生成し、返せるクラス
 * @returns document_clsにより生成または取得したファイルオブジェクトを返します
 */
function get_or_create_file(path, document_cls) {
  var dir_name = (0, PathUtils_1.get_directory_name_from_path)(path);
  var file_name = (0, PathUtils_1.get_filename_from_path)(path);
  var dir = (0, FolderUtils_1.get_dir)(dir_name) || (0, FolderUtils_1.create_dir)(dir_name);
  var files = dir.getFilesByName(file_name);
  if (files.hasNext()) {
    return document_cls.openById(files.next().getId());
  } else {
    var doc = document_cls.create(file_name);
    var file = DriveApp.getFileById(doc.getId());
    file.moveTo(dir);
    return doc;
  }
}
FileUtils.get_or_create_file = get_or_create_file;
/**
 * ファイルを取得します。存在しない場合は作成します。
 * @param path ファイルのフルパス(絶対パスのみ有効。また、ルートディレクトリは/で指定しない)
 * @param document_cls ドキュメント取得オブジェクト。createメソッドが必要で、ファイル名を渡してオブジェクトを生成し、返せるクラス
 * @returns document_clsにより生成したファイルオブジェクトを返します
 */
function create_file(path, document_cls) {
  var dir_name = (0, PathUtils_1.get_directory_name_from_path)(path);
  var file_name = (0, PathUtils_1.get_filename_from_path)(path);
  var dir = (0, FolderUtils_1.get_dir)(dir_name) || (0, FolderUtils_1.create_dir)(dir_name);
  var files = dir.getFilesByName(file_name);
  if (!dir) {
    throw "\u6307\u5B9A\u3055\u308C\u305F\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306F\u5B58\u5728\u3057\u307E\u305B\u3093\u3002".concat(path);
  }
  if (files.hasNext()) {
    throw "\u6307\u5B9A\u3055\u308C\u305F\u30D5\u30A1\u30A4\u30EB\u306F\u3059\u3067\u306B\u5B58\u5728\u3057\u3066\u3044\u307E\u3059\u3002".concat(path);
  } else {
    var doc = document_cls.create(file_name);
    var file = DriveApp.getFileById(doc.getId());
    file.moveTo(dir);
    return doc;
  }
}
FileUtils.create_file = create_file;
/**
 * 指定されたファイルを削除します
 * @param path ファイルのフルパス(絶対パスのみ有効。また、ルートディレクトリは/で指定しない)
 */
function delete_file(path) {
  var dir_name = (0, PathUtils_1.get_directory_name_from_path)(path);
  var file_name = (0, PathUtils_1.get_filename_from_path)(path);
  var dir = (0, FolderUtils_1.get_dir)(dir_name);
  if (!dir) {
    throw "\u6307\u5B9A\u3055\u308C\u305F\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u306F\u5B58\u5728\u3057\u307E\u305B\u3093\u3002".concat(path);
  }
  var files = dir.getFilesByName(file_name);
  if (files.hasNext()) {
    files.next().setTrashed(true);
  } else {
    throw "\u6307\u5B9A\u3055\u308C\u305F\u30D5\u30A1\u30A4\u30EB\u306F\u5B58\u5728\u3057\u307E\u305B\u3093\u3002".concat(path);
  }
}
FileUtils.delete_file = delete_file;

(function (exports) {

	var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function (o, m, k, k2) {
	  if (k2 === undefined) k2 = k;
	  var desc = Object.getOwnPropertyDescriptor(m, k);
	  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	    desc = {
	      enumerable: true,
	      get: function () {
	        return m[k];
	      }
	    };
	  }
	  Object.defineProperty(o, k2, desc);
	} : function (o, m, k, k2) {
	  if (k2 === undefined) k2 = k;
	  o[k2] = m[k];
	});
	var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function (m, exports) {
	  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
	};
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	__exportStar(PathUtils, exports);
	__exportStar(FolderUtils, exports);
	__exportStar(FileUtils, exports); 
} (build));

class GasLogger {
  constructor() {
    this.appenders = [];
  }
  add_appender(appender) {
    this.appenders.push(appender);
  }
  write_log(message, level = 'info') {
    const date_now = new Date();
    const date_message = Utilities.formatDate(date_now, 'Asia/Tokyo', "yyyy-MM-dd'T'HH:mm:ss'Z'");
    const final_message = date_message + ',' + level + ',' + message + "\n";
    for (let logger of this.appenders) {
      logger.write_log(final_message);
    }
  }
  debug(message) {
    this.write_log(message, 'debug');
  }
  info(message) {
    this.write_log(message, 'info');
  }
  warn(message) {
    this.write_log(message, 'warn');
  }
  error(message) {
    this.write_log(message, 'error');
  }
  fatal(message) {
    this.write_log(message, 'fatal');
  }
}
class BaseAppender {
  write_log(message) {
    // ベースクラスのためなにもしない
  }
}

/**
 * ファイル出力するappender
 */
class FileAppender extends BaseAppender {
  /**
   * コンストラクタです
   * @param save_path 保存パス
   * @param file_name ファイル名
   */
  constructor(save_path, file_name) {
    super();
    const date_now = new Date();
    this.logger_file_name = file_name + Utilities.formatDate(date_now, 'Asia/Tokyo', 'yyyyMM') + ".txt";
    build.get_or_create_dir(save_path);
    const file = build.get_or_create_file(save_path + "/" + this.logger_file_name, DocumentApp);
    this.file = file.getBody().editAsText();
  }
  write_log(message) {
    this.file.appendText(message);
  }
}

/**
 * console出力するロガー
 */
class ConsoleAppender extends BaseAppender {
  write_log(message) {
    console.log(message);
  }
}
const loggers = {
  FileAppender,
  ConsoleAppender
};

/**
 * 文字列で指定されたappenderを取得します。
 * @param {string} class_name 
 * @param {any[]} args 
 * @returns {BaseAppender}
 */
function create_appender(class_name, ...args) {
  if (loggers[class_name] === undefined || loggers[class_name] === null) {
    throw new Error(`Class type of \'${class_name}\' is not in the store`);
  }
  return new loggers[class_name](...args);
}

/**
 * ロガーを取得します
 * @returns {GasLogger}
 */
function get_logger() {
  return new GasLogger();
}

const export_functions = [create_appender, get_logger];
