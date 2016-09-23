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

    this.edit = function(event) {
        var btn = event.target,
            input;
        if (btn) {
            input = btn.previousElementSibling;
            if (input.getAttribute("readonly")) {
                btn.innerText = "Save";
                input.removeAttribute("readonly");
            } else {
                btn.innerText = "Edit";
                input.setAttribute("readonly", "readonly");
            }
        }
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
                node = document.createElement("div");
                node.style.height = "10px";
            }
            container.appendChild(node);
        });
    };

    function extractTextWithWhitespace(elems) {
        var lineBreakNodeName = "DIV";

        var extractedText = extractTextWithWhitespaceWorker(elems, lineBreakNodeName);

        return extractedText;
    }

    // Cribbed from jQuery 1.4.2 (getText) and modified to retain whitespace
    function extractTextWithWhitespaceWorker(elems, lineBreakNodeName) {
        var ret = "";
        var elem;

        for (var i = 0; elems[i]; i++) {
            elem = elems[i];

            if (elem.nodeType === 3 // text node
                ||
                elem.nodeType === 4) // CDATA node
            {
                ret += elem.nodeValue;
            }

            if (elem.nodeName === lineBreakNodeName) {
                ret += "\n";
            }

            if (elem.nodeType !== 8) {// comment node
                ret += extractTextWithWhitespace(elem.childNodes, lineBreakNodeName);
            }
        }

        return ret;
    }

    this.bindUI = function() {
        var that = this;
        editButton = document.getElementById("editBtn"),
            saveButton = document.getElementById("saveBtn");
        editButton.addEventListener("click", function() {
            document.querySelector(".commands_editor").innerText = commands;
            document.body.classList.add("editmode");
        });
        saveButton.addEventListener("click", function() {
            document.body.classList.remove("editmode");
            commands = extractTextWithWhitespace([document.querySelector(".commands_editor")]);
            that.renderStoredCommands(commands);
        })
    };

    this.renderStoredCommands(commands);
    this.bindUI();
}
window.onload = function() {
    fetch("commands.txt").then(function (res) {
        res.text().then(function(res) {
            if (res) {
                  CommandsLog(res);
            }
        });
    });
};