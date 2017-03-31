define([
        "knockout",
        "js/module/numberInput",
        "js/module/participants-editor",
        "js/module/keypad",
        "js/module/close-dialog-btn",
        "js/module/resizer",
        "js/module/navBtn",
        "js/module/tab-switcher",
        "js/module/image-gallery",
        "js/module/user-media-gallery"
    ],

    function (ko, NumberInput, ParticipantsEditor, Keypad, CloseDialogButton, Resizer, NavBtn, TabSwitcher,
        ImageGallery, UserMediaGallery) {
        ko.bindingHandlers.isolate = {
            init: function (element) {
                return {
                    controlsDescendantBindings: true
                };
            }
        };

        function renderCollection(element, data, template) {
            var click = data.onclick;
            element.innerText = '';
            data.source().forEach(function (item) {
                var buffer = document.createDocumentFragment(),
                    $data = data;

                if (!item.renderedElementIsVisible) {
                    item.renderedElementIsVisible = ko.observable(true);
                }
                if (typeof item.renderedElementIsVisible === 'boolean') {
                    item.renderedElementIsVisible = ko.observable(true);
                }

                item.onclick = data.onclick;
                ko.renderTemplate(template, item, {}, buffer, 'replaceChildren');
                element.appendChild(buffer);
                if (item.afterRender) {
                    item.afterRender(element.lastElementChild, item);
                }
            });
        }

        ko.extenders.nonZero = function (target) {
            //create a writable computed observable to intercept writes to our observable
            var result = ko.pureComputed({
                read: target, //always return the original observables value
                write: function (newValue) {
                    if (typeof newValue !== "number") {
                        newValue = parseInt(newValue + "", 10) || 0;
                    }
                    target(newValue <= 0 ? "" : newValue);
                }
            });

            result(target());
            return result;
        };

        ko.bindingHandlers.animation = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {},
            update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {}
        };


        ko.bindingHandlers.contextMenu = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var options = valueAccessor();
                var dialog = document.importNode(document.getElementById(options.template).content, true).firstElementChild;
                if (!dialog.showModal) {
                    /*global dialogPolyfill:true*/
                    dialogPolyfill.registerDialog(dialog);
                }
                document.getElementById("dialogs").appendChild(dialog);
                app.ko.applyBindings(viewModel, dialog);
                dialog.onclick = function (ev) {
                    var action = ev.target.getAttribute("data-action");
                    dialog.close();
                    setTimeout(function () {
                        valueAccessor().click.call(viewModel, action);
                    }, 10);
                };
                element.onclick = function () {
                    //dialog.showModal();
                    app.showDropDownMenu("app_actions", element, {
                        align: "right"
                    });
                };


                // This will be callallBindingsed when the binding is first applied to an element
                // Set up any initial state, event handlers, etc. here
                // 			var visible = allBindings.get('visible');
                // 			var visibleObservable = null;
                // 			element.dataset.bind.split(',').forEach(function(item){
                // 				if (item.indexOf('visible') !== -1) {
                // 					visibleObservable = item.split('visible:')[1].replace(' ', '').replace('!', '').replace('(', '').replace(')', '');
                // 				}
                // 			});
                // 			if (viewModel[visibleObservable]) {
                // 				app.call('animations').subscribeToObservable(viewModel[visibleObservable], element, valueAccessor);
                // // 				viewModel[visibleObservable].subscribe(function (value) {
                // // 					app.call('animations').onVisibleChanged(element, value, valueAccessor);
                // // 				});
                // 			} else {
                // 				console.warn("Failed to find visible observable for element: " + element.dataset.bind);
                // 			}
            },
            update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                // 			app.call('animations').onVisibleChanged(element, value);
                // This will be called once when the binding is first applied to an element,
                // and again whenever any observables/computeds that are accessed change
                // Update the DOM element based on the supplied values here.
            }
        };

        ko.bindingHandlers.searchList = {
            init: function (element, valueAccessor) {
                var data = valueAccessor(),
                    model = {},
                    active, result;
                if (data.source().length) {
                    renderCollection(element, data, data.template);
                }
                data.source.subscribe(function (array) {
                    renderCollection(element, data, data.template);
                });
                if (data.active) {
                    active = data.active();
                } else {
                    active = true;
                }
                model.source = ko.computed(function () {
                    var criteria, result, resultCount, source;
                    if (data.active) {
                        active = data.active();
                    }
                    if (active) {
                        resultCount = 0;
                        source = data.source();
                        criteria = data.input()
                        source.forEach(function (item) {
                            var filter = '';
                            if (data.filter.indexOf('()') > -1) {
                                filter = item[data.filter.substring(0, data.filter.length - 2)]();
                            } else {
                                filter = item[data.filter];
                            }
                            if (!filter) {
                                filter = '';
                            }
                            var itemIsVisible = !criteria.length || (filter.toLowerCase().indexOf(criteria.toLowerCase()) > -1);
                            item.renderedElementIsVisible(itemIsVisible);
                            if (itemIsVisible) {
                                resultCount++;
                            }
                        });
                        if (resultCount > 0) {
                            element.parentNode.classList.remove('empty', 'search');
                        } else {
                            element.parentNode.classList.add('empty');
                            if (criteria.length) {
                                element.parentNode.classList.add('search');
                            } else {
                                element.parentNode.classList.remove('search');
                            }
                        }
                    }
                });
            }
        };
        ko.bindingHandlers.htmlValue = {
            init: function (element, valueAccessor, allBindingsAccessor) {
                element.addEventListener('keydown', function (event) {
                    if (event.keyCode === 13 && (event.shiftKey || event.ctrlKey)) {
                        event.preventDefault();
                        event.stopPropagation();
                        document.execCommand('insertHTML', false, '<br><br>');
                    }
                    if (event.keyCode === 13) {
                        event.preventDefault();
                        event.stopPropagation();
                        return false;
                        // document.execCommand('insertHTML', false, '<br><br>');
                    }
                });

                function onEdit() {
                    var modelValue = valueAccessor();
                    var elementValue = element.innerHTML;
                    if (ko.isWriteableObservable(modelValue)) {
                        modelValue(elementValue);
                    } else { //handle non-observable one-way binding
                        var allBindings = allBindingsAccessor();
                        if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers'].htmlValue) allBindings['_ko_property_writers'].htmlValue(elementValue);
                    }
                }
                ko.utils.registerEventHandler(element, "keyup", onEdit);
                ko.utils.registerEventHandler(element, "DOMNodeInserted", onEdit);

            },
            update: function (element, valueAccessor) {
                var value = ko.utils.unwrapObservable(valueAccessor()) || "";
                if (element.innerHTML !== value) {
                    element.innerHTML = value;
                }
            }
        };
        ko.bindingHandlers.isolate = {
            init: function (element) {
                return {
                    controlsDescendantBindings: true
                };
            }
        };
        ko.bindingHandlers.scrollTo = {
            init: function (element, valueAccessor, allBindingsAccessor) {},
            update: function (element, valueAccessor) {
                var value = ko.utils.unwrapObservable(valueAccessor()) || "";
                setTimeout(function () {
                    if (value === 'end') {
                        element.scrollTop = element.scrollHeight;
                    } else if (value === 'start') {
                        element.scrollTop = 0;
                    } else {
                        var el = document.querySelector(value);
                        if (el) {
                            if (el.scrollIntoViewIfNeeded) {
                                el.scrollIntoViewIfNeeded();
                            } else {
                                el.scrollIntoView();
                            }
                        }
                    }

                }, 10);
            }
        };
        ko.bindingHandlers.attrTranslate = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                //console.log( element, valueAccessor, allBindings, viewModel, bindingContext );
                var attr = valueAccessor(),
                    value = app.translate(element.getAttribute(attr));
                    if (value) {
                        element.setAttribute(attr, value);   
                    }
            },
            update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                //console.log( element, valueAccessor, allBindings, viewModel, bindingContext );
            }
        };

        ko.bindingHandlers.vlistbox = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                //console.log( element, valueAccessor, allBindings, viewModel, bindingContext );
                var listbox = valueAccessor();
                element.appendChild(listbox.container);
            },
            update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                //console.log( element, valueAccessor, allBindings, viewModel, bindingContext );
            }
        };

        ko.bindingHandlers.currentTab = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                //console.log( element, valueAccessor, allBindings, viewModel, bindingContext );

            },
            update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                //console.log( element, valueAccessor, allBindings, viewModel, bindingContext );
            }
        };

        ko.bindingHandlers.selection = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {},
            update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var value = valueAccessor();
                if (typeof value === "function") {
                    value = value();
                }
                if (value === "end") {
                    element.selectionStart = element.value.length;
                    element.selectionEnd = element.value.length;
                    element.focus();
                } else if (value === "all") {
                    element.selectionStart = 0;
                    element.selectionEnd = element.value.length;
                    element.focus();
                }
            }
        };

        ko.bindingHandlers.insertChar = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {},
            update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var value = valueAccessor(),
                    inputValue = element.value,
                    selStart = element.selectionStart,
                    selEnd = element.selectionEnd;

                if (typeof value === "function") {
                    value = value();
                }
                viewModel.number((inputValue.substr(0, selStart) + value + inputValue.substr(selEnd)).substr(0, element.maxLength));
                element.selectionEnd = element.selectionStart = selStart + 1;

                element.focus();
            }
        };

        ko.bindingHandlers.removeChar = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {},
            update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var value = valueAccessor(),
                    inputValue = element.value,
                    selStart = element.selectionStart,
                    selEnd = element.selectionEnd;

                if (typeof value === "function") {
                    value = value();
                }
                if (selStart === selEnd) {
                    if (selStart > 0) {
                        viewModel.number(inputValue.substr(0, selStart - 1) + inputValue.substr(selEnd));
                        element.selectionEnd = element.selectionStart = selStart - 1;
                        element.focus();
                    }
                } else {
                    viewModel.number(inputValue.substr(0, selStart) + inputValue.substr(selEnd));
                    element.selectionEnd = element.selectionStart = selStart;
                    element.focus();
                }
            }
        };

        //selectItem: {0}, selectListItems: {1}
        function renderList(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var bindings = allBindings(),
                items = bindings.selectListItems(),
                selectedItem = bindings.selectedItem;

            if (items && items.length) {
                var renderer = bindings.optionsText,
                    df = document.createDocumentFragment(),
                    tmpl = document.getElementById("did_num_tmpl");
                items.forEach(function (item) {
                    df.appendChild(app.utils.bind(tmpl, item, true));
                });
                element.innerText = "";
                element.appendChild(df);
            }
        }

        ko.bindingHandlers.selectListItems = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                element.addEventListener("click", function (ev) {
                    var itemElement = app.utils.getParent(ev.target, function (el) {
                        return el.hasAttribute("data-item-id");
                    }, element);

                    if (itemElement) {
                        selecteItemId = itemElement.getAttribute("data-item-id");
                        [].forEach.call(element.querySelectorAll("[data-active]"), function (el) {
                            el.removeAttribute("data-active");
                        });
                        itemElement.setAttribute("data-active", "true");
                        if (allBindings().selectedItem) {
                            var item = allBindings().selectListItems().filter(function (list_item) {
                                return list_item.key === selecteItemId;
                            });
                            allBindings().selectedItem(item[0]);
                        }
                    }
                }, true);
                renderList(element, valueAccessor, allBindings, viewModel, bindingContext);
            },
            update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                renderList(element, valueAccessor, allBindings, viewModel, bindingContext);
                // This will be called once when the binding is first applied to an element,
                // and again whenever any observables/computeds that are accessed change
                // Update the DOM element based on the supplied values here.
            }
        };

        ko.components.register('number-input', {
            viewModel: NumberInput,
            template: {
                element: "number_input_tmpl"
            }
        });

        ko.components.register('participants-editor', {
            viewModel: ParticipantsEditor,
            template: {
                element: "participants_editor_tmpl"
            }
        });

        ko.components.register('keypad', {
            viewModel: Keypad,
            template: {
                element: "keypad_tmpl"
            }
        });

        ko.components.register('close-dialog-button', {
            viewModel: CloseDialogButton,
            template: {
                element: "close-dialog-btn"
            }
        });
        ko.components.register('resizer', {
            viewModel: Resizer,
            template: {
                element: "resizer_tmpl"
            }
        });
        ko.components.register('nav_btn', {
            viewModel: NavBtn,
            template: {
                element: "nav_btn_tmpl"
            }
        });

        ko.components.register('image-gallery', {
            viewModel: ImageGallery,
            template: {
                element: "image-gallery-tmpl"
            }
        });

        ko.components.register('tab-switcher', {
            viewModel: TabSwitcher,
            template: {
                element: "tab_switcher_tmpl"
            }
        });

        if (UserMediaGallery) {
            ko.components.register('user-media-gallery', {
                viewModel: UserMediaGallery,
                template: {
                    element: "user-media-gallery-tmpl"
                }
            });
        }

        return ko;
    })