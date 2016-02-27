// ==UserScript==
// @name Badge Oneboxer
// @description Converts tag-like badge comments to badges
// @version 0.24
// @match *://chat.stackexchange.com/rooms/*
// @match *://chat.stackoverflow.com/rooms/*
// @match *://chat.meta.stackexchange.com/rooms/*
// @author The-Quill
// @downloadURL  https://raw.githubusercontent.com/The-Quill/badge-oneboxer/master/badge-oneboxer.user.js
// @updateURL https://raw.githubusercontent.com/The-Quill/badge-oneboxer/master/badge-oneboxer.user.js
// @grant GM_getResourceText
// @resource    badges  https://rawgit.com/The-Quill/badge-oneboxer/master/badges.json
// @run-at document-end
// ==/UserScript==

'use strict';
var Badges;
$.get("https://rawgit.com/The-Quill/badge-oneboxer/master/badges.json", function(data){
    Badges = data;
}).done(function(){
    var m = new MutationObserver(function(){
        ReplaceAll();
    });
    m.observe(document.getElementById("chat"), {childList: true});
    ReplaceAll();
});
function ReplaceAll(){
    var messages = document.getElementsByClassName('message');
    for (var i = 0, length = messages.length; i < length - 1; i++){
        ReplaceText(messages[i])
    }
}
var regex = /(\[badge:([a-zA-Z#.\-]+)\])/i;
var ColourTransforms = {
    bronze: "CC9966",
    silver: "C5C5C5",
    gold: "FFCC00"
};
function ReplaceText(node){
    if (!node) return false;
    var badgeProperties = SelectBadgeProperties(node.innerText);
    if (!badgeProperties) { return false };
    if (badgeProperties.total == "") return false;
    node.innerHTML = node.innerHTML.replace(
        badgeProperties.total,
        "<span class=\"ob-post-tag\" style=\"background-color: #FFF; color: #000; border-color: #000; border-style: solid;\">" +
        "<svg version=\"1.1\" height=\"18\" width=\"15\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"#" +
        (Badges.hasOwnProperty(badgeProperties.name) ? ColourTransforms[Badges[badgeProperties.name]] : "000") +
        "\" r=\"3\" cy=\"13.5\" cx=\"3\" /></svg>" +
        badgeProperties.name + "</span>"
    );
    if (HasBadgeText(node.innerText)){
        console.log("again");
        ReplaceText(node);
    }
};
function HasBadgeText(text){
    return regex.test(text);
}
function SelectBadgeProperties(text){
    if (!HasBadgeText(text)) return false;
    var matchesArray = text.match(regex);
    return {
        total: matchesArray[0],
        name:  matchesArray[2]
    };
}
