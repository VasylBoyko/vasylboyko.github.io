     function onItemClick () {
        var url = "file:///home/vboyko/projects/fring/kandy/websrc/default/js/module/group-controller.js",
            lineNumber = 710,
            callback = function () {};
        chrome.devtools.panels.openResource(url, lineNumber, callback);
    }
    var tm = null;
    
    function performSearch(filter) {
        if (tm) {
            clearTimeout(tm);
        }
        tm = setTimeout(function () {
            tm = null;
            var params = ["js", "css", "scss","html"];
            
            options = "" + 
                (document.getElementById("ignore_case").checked && "i" || "") + 
                (!document.getElementById("regular_expression").checked && "F" || "")

            if (filter) {
                window._ws.send(JSON.stringify({
                    execute: {
                        cmd: "find_text",
                        arguments: [filter, options]
                    }
                }));
            }
            filter = "";
            
        }, 500);
        return Promise.resolve([]);
    }
    

    function highlightMatch(el) {
        el.classList.add("highlighted-match");
    }

    function renderItems (results) {
            var container = document.getElementById("search_results"),
                search_box = document.getElementById("search_box"),
                search_res_file_entry = document.getElementById("search_res_file_entry"),
                search_res_line_entry = document.getElementById("search_res_line_entry"),
                df = document.createDocumentFragment();
            if (!results.length) {
                container.innerText = "";
            }
            
            var fileName = "", 
                counter = 0,
                fileEntry = null;
                        
            results.forEach(function (item) {
                var itemURL = item.url;

                if (fileName !== itemURL) {
                    if (fileEntry) {
                       /// fileEntry.querySelector(".search-result-matches-count").innerText = "(" + counter + " matches)";
                    }
                    counter = 0;
                    fileName = itemURL;
                    fileEntry = document.importNode(search_res_file_entry.content, true);
                    fileEntry.querySelector(".search-result-file-name").innerText = itemURL.replace("file:///home/vboyko/projects/fring/kandy/", "");
                    fileEntry_ol = fileEntry.querySelector("ol.children");
                    df.appendChild(fileEntry);
                }
                counter++;
                var lineEntry = document.importNode(search_res_line_entry.content, true);
                
                var d = lineEntry.querySelector(".search-match-content");
                d.innerText = item.line;
                d.dataset.url = item.url;
                d.dataset.lineNumber = item.lineNumber;
                d.dataset.line = item.line;

                var dl = lineEntry.querySelector(".search-match-line-number");
                dl.innerText = item.lineNumber;

                fileEntry_ol.appendChild(lineEntry);
                
            })
            container.appendChild(df);
            if (window.sidebar) {
                window.sidebar.setHeight(Math.min(500, Math.max(100, container.offsetHeight + search_box.offsetHeight)) +  "px");
            }
        }

    
    function bindUI() {
        document.getElementById("search_results").addEventListener("click", function (event) {
            if (event.target.dataset.url && chrome.devtools) {
                chrome.devtools.panels.openResource(event.target.dataset.url, event.target.dataset.lineNumber * 1 - 1);
            }
        });
        document.getElementById("search_input").addEventListener("change", function (event) {
            performSearch(event.target.value).then(renderItems);
        });
        document.getElementById("search_input").addEventListener("keypress", function (event) {
            if (event.keyCode === 13) {
                performSearch(event.target.value).then(renderItems);
            }
        });
    }
    
    var res = "";
    function createWS()  {
        window._ws = new WebSocket("ws://localhost");
        window._ws.onmessage = function (evt) {
            if (evt.data === "ready") {
                return;
            }
            res += evt.data;
            if (/\n$/.test(evt.data)) {
                var data = res.split("\n").map(function (row) {
                    if (row) {
                        row = row.split(":");
                        var url = row.shift();
                        return {
                            url: "file://" + url,
                            lineNumber: row.shift() * 1,
                            line: row.join(":")
                        }
                    }
                }).filter(function (item) {return item;}) ;;
                res = ""
                renderItems(data);
                
            }           
        }
    }
    createWS();

    window.onload = function () {
        createWS();
        bindUI();
    }

