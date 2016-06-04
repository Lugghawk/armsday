if (typeof browser === 'undefined' && chrome) {
    browser = chrome;
}

browser.runtime.sendMessage({
        url: "https://www.bungie.net/Platform/Destiny/2/Account/4611686018452889968/Character/2305843009333785046/Advisors/"
    },
    function(data) {
        console.log(data);
    }
);
