// ==UserScript==
// @name Badge Oneboxer
// @description Converts tag-like badge comments to badges
// @version 0.1
// @match *://chat.stackexchange.com/rooms/*
// @match *://chat.stackoverflow.com/rooms/*
// @match *://chat.meta.stackexchange.com/rooms/*
// @author The-Quill
// @grant GM_getResourceText
// @resource    badges  https://rawgit.com/The-Quill/badge-oneboxer/master/badges.json
// @run-at document-end
// ==/UserScript==

/* Steps:

 1. Correct all existing messages
 2. Set a mutation observer on the chat feed, check for /(bronze|silver|gold)-badge: ([a-zA-Z]+)/ in message text, if proceeding text is bronze|silver|gold, then match
 3. Replace HTML on said element
 
 Use existing tag structure, plus the circle structure from beta sites.

*/

    'use strict';
    //var Badges = JSON.parse(GM_getResourceText("badges"));
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
        for (var i = 0, length = messages.length; i < length; i++){
            ReplaceText(messages[i])
        }
    }
    var regex = /(\[badge:([a-zA-Z\-]+)\])/i;
    var ColourTransforms = {
        bronze: "CC9966",
        silver: "C5C5C5",
        gold: "FFCC00"
    };
    function ReplaceText(node){
        if (!node) return false;
        console.log(node);
        var badgeProperties = SelectBadgeProperties(node.innerText);
        node.innerHTML = node.innerHTML.replace(
            badgeProperties.total,
            "<span class=\"ob-post-tag\" style=\"background-color: #FFF; color: #000; border-color: #000; border-style: solid;\">" +
            "<svg version=\"1.1\" height=\"18\" width=\"15\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"#" +
            ColourTransforms[Badges[badgeProperties.name]] +
            "\" r=\"3\" cy=\"13.5\" cx=\"3\" /></svg>" +
            badgeProperties.name + "</span>"
        );
        if (HasBadgeText(node.innerText)) ReplaceText(node);
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