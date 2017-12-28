///Merge tabs to single window: https://chromium.googlesource.com/chromium/src/+/master/chrome/common/extensions/docs/examples/api/windows/merge_windows


class xTab extends HTMLElement {
	constructor(tabData) {
		super(); // always call super() first in the ctor.
		//      var tabData = this.tabData;
		let shadowRoot = this.attachShadow({mode: 'open'});
		const t = document.querySelector('#x-tab-template');
		const instance = t.content.cloneNode(true),
		  p = instance.querySelector("p");
		p.setAttribute("title", tabData.url);
		p.innerHTML = tabData.title;
		p.onclick = function () {
			/*
			chrome.tabs.captureVisibleTab(tabData.windowId, {}, function (dataUrl) {
				document.getElementById("tabThumb").src=dataUrl;
			})*/
			
			chrome.tabs.highlight({tabs: tabData.index, windowId: tabData.windowId})
		}

		var self = this;
		const close = instance.querySelector("[data-action='close']");
		close && (close.onclick = function () {
			chrome.tabs.remove(tabData.id, function () {
				self.remove()
			})
		})

		self.onmouseenter = function () {
			///todo show tab tumbnail if available
			chrome.windows.getCurrent(null, function (wnd) {
				if (tabData.windowId != wnd.id) {
					chrome.tabs.highlight({tabs: tabData.index, windowId:tabData.windowId})
				}
			})
		}
		
		self.onmouseenter = function () {
			chrome.windows.getCurrent(null, function (wnd) {
				if (tabData.windowId != wnd.id) {
					chrome.tabs.highlight({tabs: tabData.index, windowId:tabData.windowId})
				}
			})
		}
		
		if (tabData.favIconUrl) {
			instance.querySelector("img").src = tabData.favIconUrl;
		}
		shadowRoot.appendChild(instance);
	}
}

customElements.define('x-tab', xTab);

    function extractHostname(url) {
        var hostname;
        //find & remove protocol (http, ftp, etc.) and get hostname

        if (url.indexOf("://") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }

        //find & remove port number
        hostname = hostname.split(':')[0];
        //find & remove "?"
        hostname = hostname.split('?')[0];

        return hostname;
    }
    function extractRootDomain(domain) {
        var splitArr = domain.split('.'),
            arrLen = splitArr.length;

        //extracting the root domain here
        if (arrLen > 2) {
            domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        }
        return domain;
    }

    function getTabs() {
        return new Promise(function (resolve, reject) {
            chrome.tabs.query({}, function (tabs) {
                resolve(tabs.sort(function (tab1, tab2) {
                    var url1 = tab1.url || "",
                        url2 = tab2.url || "",
                        host1 = extractHostname(url1),
                        host2 = extractHostname(url2),
                        domain1 = extractRootDomain(host1),
                        domain2 = extractRootDomain(host2);

                    if (host1 === host2) {
                        return url1 > url2 ? 1: -1;
                    }else if (domain1 === domain2) {
                        return host1 > host2 ? 1: -1;
                    } else {
                        return domain1 > domain2 ? 1: -1;
                    }
                }));
            });
        });
    }
    function renderTabs(container) {
        getTabs().then(function(tabs) {
            var df = document.createDocumentFragment();

            tabs.forEach(function (tabData) {
                var tab = new xTab(tabData);
                df.appendChild(tab);
            });
            container.appendChild(df);
        });
    }

window.onload = function () {
    renderTabs(document.getElementById("tabsContainer"));
}
