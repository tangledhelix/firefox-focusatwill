
var playerUrl = 'https://www.focusatwill.com/music/#player';

var tabs = require('sdk/tabs');
var simplePrefs = require('sdk/simple-prefs');
var prefs = simplePrefs.prefs;

const { Hotkey } = require('sdk/hotkeys');

exports.main = function(options, callbacks) {

    var getHotkey = function() {
        var hotkeyCombo = '';

        if (prefs.useAccelKey) {
            hotkeyCombo += 'accel-';
        }
        if (prefs.useAltKey) {
            hotkeyCombo += 'alt-';
        }
        if (prefs.useShiftKey) {
            hotkeyCombo += 'shift-';
        }
        hotkeyCombo += prefs.hotkeyChar;

        return hotkeyCombo;
    };

    var hotkeyOnpress = function() {
        var focusAtWillTabIsOpen = false;
        for each (var tab in tabs) {
            if (tab.url.indexOf(playerUrl) === 0) {
                focusAtWillTabIsOpen = true;
                tab.attach({
                    contentScript: 'document.getElementsByClassName("play")[0].click();'
                });
            }
        }
        if (! focusAtWillTabIsOpen) {
            if (prefs.openNewTab) {
                tabs.open({
                    url: playerUrl,
                    isPinned: prefs.pinNewTab
                });
            }
        }
    };

    var generateHotkey = function() {
        return Hotkey({
                combo: getHotkey(),
                onPress: hotkeyOnpress
            });
    }

    var focusAtWillHotkey = generateHotkey();

    var onPrefChange = function(prefName) {
        var oldHotkey = focusAtWillHotkey.toString();
        focusAtWillHotkey.destroy();
        focusAtWillHotkey = generateHotkey();
        console.log('hotkey changed from ' + oldHotkey + ' to ' + focusAtWillHotkey.toString());
    };

    simplePrefs.on('useAccelKey', onPrefChange);
    simplePrefs.on('useAltKey', onPrefChange);
    simplePrefs.on('useShiftKey', onPrefChange);
    simplePrefs.on('hotkeyChar', onPrefChange);

};
