/*jslint browser:true, devel:true */
/*global app:true, tools:true, offlineAPI:true, Blob:true, FileReader:true, IDBKeyRange:true */

indexDbAPI = (function () {
    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
        db,
        DB_NAME = "playLists",
        DB_VERSION = 1;

    function initDatabase(callback) {
        var request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onsuccess = function () {
            db = request.result;
            callback('{"status": true, "data": {}}');
        };

        request.onupgradeneeded = function (event) {
            var resousesStore,
                removeDbRequest;

            db = request.result;

            function createStore() {
                resousesStore = db.createObjectStore("lists", {
                    keyPath: "list_id"
                });
                resousesStore.createIndex("list_id", "list_id", {
                    unique: true
                });
                resousesStore.createIndex("list_name", "list_name", {
                    unique: false
                });
            }

            if (db.objectStoreNames.length) {
                var deleteRequest = db.deleteObjectStore("lists");
                deleteRequest.onsuccess = function () {
                    createStore();
                };
            } else {
                createStore();
            }
        };

        request.onerror = function () {
            console.log("Error: Connection attempt to indexedDB failed!");
            //removeDbRequest = indexedDB.deleteDatabase(DB_NAME);
        };
    }

    function copyList(id, title, callback, errorCallback) {
        var transaction = db.transaction(["lists"], "readwrite"),
            objectStore = transaction.objectStore("lists"),
            index = objectStore.index("list_id"),
            request = index.get(id);

        function addCloneProject(project) {
            var request = objectStore.add(project);
            request.onsuccess = function () {
                callback(project.resource_id);
            };

            request.onerror = function () {
                //todo add error message
            };
        }

        request.onsuccess = function (event) {
            var project = event.target.result;
            if (project) {
                project.name = title;
                project.resource_id = tools.getUniqueId();
                addCloneProject(project);
            }
        };

        request.onerror = function (error) {
            if ("function" === typeof errorCallback) {
                errorCallback();
            }
        };
    }


    function deleteList(id, callback, errorCallback) {
        var transaction = db.transaction(["lists"], "readwrite"),
            objectStore = transaction.objectStore("lists"),
            request = objectStore.delete(id);

        request.onsuccess = function () {
            callback(id);
        };
        request.onerror = function (error) {
            if ("function" === typeof errorCallback) {
                errorCallback();
            }
        };
    }

    function getList(id, callback, errorCallback) {
        var transaction = db.transaction(["lists"]),
            objectStore = transaction.objectStore("lists"),
            index = objectStore.index("list_id"),
            request = index.get(id);

        request.onsuccess = function (event) {
            var resource = event.target.result;
            if (resource) {
                callback(resource);
            }
        };

        request.onerror = function () {
            if (errorCallback) {
                errorCallback({
                    "status": false,
                    "data": {
                        "reason": "error appeared"
                    }
                });
            }
        };
    }

    function addList(data, callback, errorCallback) {
        var transaction = db.transaction(["lists"], "readwrite"),
            objectStore = transaction.objectStore("lists"),
            list_id = data.id || tools.getUniqueId(),
            resource = {
                "list_id": list_id,
                "list_name": data.name,
                "list_items": data.items
            },
            request = objectStore.add(resource);

        request.onsuccess = function () {
            setTimeout(function () {
                callback({
                    list_id: list_id
                });
            }, 20);
        };
        request.onerror = function (error) {
            if ("function" === typeof errorCallback) {
                errorCallback();
            }
        };
    }

    function updateList(data, callback, errorCallback) {
        var transaction = db.transaction(["lists"], "readwrite");
        var objectStore = transaction.objectStore("lists");
        var index = objectStore.index("list_id");
        var request = index.get(data.id);

        request.onsuccess = function (event) {
            var resource = event.target.result;
            var updateRequest;

            if (resource) {
                if (data.name) {
                    resource.list_name = data.name;
                }

                if (data.items) {
                    resource.list_items = data.items;
                }

                updateRequest = objectStore.put(resource);

                updateRequest.onsuccess = function () {
                    if ("function" === typeof callback) {
                        callback();
                    }
                };

                updateRequest.onerror = function () {
                    if ("function" === typeof errorCallback) {
                        errorCallback();
                    }
                };
            } else {
                console.log("indexedDB edit project. Project missing!!!");
            }
        };
        request.onerror = function () {
            if ("function" === typeof errorCallback) {
                errorCallback();
            }
        };
    }

    function listLists(types, callback) {
        var transaction = db.transaction(["lists"]),
            objectStore = transaction.objectStore("lists"),
            index = objectStore.index("list_id"),
            resources = [],
            i = 0;

        function getRecords(i) {
            var request = index.openCursor(IDBKeyRange.only(types[i]));

            request.onsuccess = function (event) {
                var cursor = event.target.result,
                    resource;
                if (cursor) {
                    resource = cursor.value;
                    resources.push({
                        id: resource.list_id,
                        name: resource.list_name
                    });
                    cursor.continue();
                } else {
                    if (i === types.length - 1) {
                        callback(resources);
                    } else {
                        getRecords(++i);
                    }
                }
            };
        }
        getRecords(i);
    }

    function init(callback) {
        initDatabase(callback || function () {});
    }

    return {
        /**
         * Sends authorization request.
         *
         * @method init
         */
        init: init,

        /**
         * Sends request which copies existing resource.
         *
         * @method copy
         */
        'copy': copyList,

        /**
         * Sends request which removes resource with specific id.
         *
         * @method delete
         */
        'delete': deleteList,

        /**
         * Sends request which returns custom resource data.
         *
         * @method get
         */
        'get': getList,

        /**
         * Sends request which inserts new resource into store.
         *
         * @method insert
         */
        'insert': addList,

        /**
         * Sends request which updates existing resource.
         *
         * @method update
         */
        'update': updateList,

        /**
         * Sends request which returns list of resources with short summary.
         *
         * @method list
         */
        'list': listLists
    };
}());