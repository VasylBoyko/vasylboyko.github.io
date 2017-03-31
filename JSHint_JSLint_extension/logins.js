window.onload = function() {
    function CommandsLog(commands) {
        this.run = function(event) {
            cmd = event.target.nextElementSibling.value;
            chrome.devtools.inspectedWindow.eval(
                cmd,
                function(result, isException) {
                    var container = event.target.parentNode,
                        d;
                    if (!container.querySelector(".result")) {
                        var d = document.createElement("div");
                        d.className = "result";
                        container.appendChild(d);
                    }
                    container = container.querySelector(".result");
                    container.innerText = JSON.stringify(result);
                    if (isException) {
                        container.classList.add("error");
                    } else {
                        container.classList.remove("error");
                    }
                }
            );
        }

        this.renderStoredCommands = function(cmds) {
            var commandList = cmds.split("\n"),
                tmplContactItem = document.getElementById("cmd_row_tmpl"),
                container = document.getElementById("stored_commands"),
                that = this;
            container.innerHTML = "";
            commandList.forEach(function(cmd) {
                var node;
                if (cmd) {
                    node = document.importNode(tmplContactItem.content, true);
                    node.querySelector("input").value = cmd;
                    var buttons = node.querySelectorAll("button"),
                        action;
                    for (let btn of buttons) {
                        action = btn.getAttribute("data-action");
                        if (that[action]) {
                            btn.onclick = that[action];
                        }
                    }
                } else {
                    node = document.createElement("br");
                }
                container.appendChild(node);
            });
        };

        function extractTextWithWhitespace(elems) {
            return extractTextWithWhitespaceWorker(elems, "DIV");
        }

        function extractTextWithWhitespaceWorker(elems, lineBreakNodeName) {
            var ret = "";
            var elem;

            for (var i = 0; elems[i]; i++) {
                elem = elems[i];

                if (elem.nodeType === elem.TEXT_NODE || elem.nodeType === elem.CDATA_SECTION_NODE) {
                    ret += elem.nodeValue;
                }

                if (["DIV", "BR"].indexOf(elem.nodeName) && ret.slice(-1) != "\n") {
                    ret += "\n";
                }

                if (elem.nodeType !== elem.COMMENT_NODE) {
                    ret += extractTextWithWhitespace(elem.childNodes, lineBreakNodeName);
                }
            }

            return ret;
        }


        this.bindUI = function() {
            var that = this;
            editButton = document.getElementById("editBtn"),
                saveButton = document.getElementById("saveBtn"),
                cancelButton = document.getElementById("cancelBtn");
            editButton.addEventListener("click", function() {
                document.querySelector(".commands_editor").innerText = commands;
                document.body.classList.add("editmode");
            });
            cancelButton.addEventListener("click", function() {
                document.body.classList.remove("editmode");
            });
            saveButton.addEventListener("click", function() {
                document.body.classList.remove("editmode");
                commands = extractTextWithWhitespace([document.querySelector(".commands_editor")]);
                localStorage.setItem("commands", commands);
                that.renderStoredCommands(commands);
            })
        };

        this.renderStoredCommands(commands);
        this.bindUI();
    }
    return new CommandsLog(localStorage.getItem("commands") || "");
};
