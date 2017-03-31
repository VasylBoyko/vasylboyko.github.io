(function () {
    var firebase;

    function FireBase() {
        var that = this;
    
        function sendData(data) {
             if (that.onChange) {
                that.onChange(data);
             }
        }

        function saveData(data) {
             dbRef.set(data);
        };
        
        this.save = saveData;

        window.firebase.initializeApp({
            apiKey: "AIzaSyD3qUqqgDYMPsvFcopazOW2zdtVMCEifGk",
            authDomain: "tool-box-399a3.firebaseapp.com",
            databaseURL: "https://tool-box-399a3.firebaseio.com",
            storageBucket: "tool-box-399a3.appspot.com",
            messagingSenderId: "894780180167"
        });

        var dbRef = window.firebase.database().ref().child('commands');

        dbRef.on('value', snap => sendData(snap.val()));
        dbRef.once('value').then(snap => sendData(snap.val()));
    }

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
            commands = cmds;
            localStorage.setItem("commands", commands);
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

        this.save = function () {
            document.body.classList.remove("editmode");
            commands = document.getElementById("commands_editor").value;
            localStorage.setItem("commands", commands);
            this.renderStoredCommands(commands);
            firebase.save(commands);
        }

        this.bindUI = function() {
            var that = this;
            editButton = document.getElementById("editBtn"),
                saveButton = document.getElementById("saveBtn"),
                cancelButton = document.getElementById("cancelBtn"),
                commandsEditor = document.getElementById("commands_editor");
            editButton.addEventListener("click", function() {
                document.getElementById("commands_editor").value = commands;
                document.body.classList.add("editmode");
            });
            cancelButton.addEventListener("click", function() {
                document.body.classList.remove("editmode");
            });
            saveButton.addEventListener("click", this.save.bind(that));
            commandsEditor.addEventListener("keydown", (function(event) {
                if (event.keyCode == 27) {
                    document.body.classList.remove("editmode");
                    event.preventDefault();
                    event.stopPropagation();
                } else  if (event.ctrlKey || event.metaKey) {
                    switch (String.fromCharCode(event.which).toLowerCase()) {
                    case 's':
                        event.preventDefault();
                        this.save();
                        break;
                    case 'f':
                        event.preventDefault();
    //                    alert('ctrl-f');
                        break;
                    case 'g':
                        event.preventDefault();
    ///                    alert('ctrl-g');
                        break;
                    }
                }
            }).bind(that));
        }

        this.renderStoredCommands(commands);
        this.bindUI();
    }
    window.onload = function() {
        commandsLog =  new CommandsLog(localStorage.getItem("commands") || "");
        firebase = new FireBase();
        firebase.onChange  = commandsLog.renderStoredCommands.bind(commandsLog);
    };
})();
