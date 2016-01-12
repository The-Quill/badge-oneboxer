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
    var Badges = GM_getResourceText("badges");
    var SelectChildNode = function(node){
        return node.children[0].children[2];
    };
    var ColourTransforms = {
        bronze: "CC9966",
        silver: "C5C5C5",
        gold: "FFCC00"
    };
    var ReplaceText = function(node){
        var badgeProperties = SelectBadgeProperties(node.innerText);
        do {
            node.innerHTML = node.innerHTML.replace(
                badgeProperties.total,
                "<span class=\"ob-post-tag\" style=\"background-color: #FFF; color: #000; border-color: #000; border-style: solid;\">" + 
                "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"#" +
                ColourTransforms[Badges[badgeProperties.name]] +
                "\" r=\"3\"/></svg>" +
                badgeProperties.name + "</span>"
            );
        } while (badgeProperties != false);
        console.log(node.innerText);
    };
    var SelectBadgeProperties = function(text){
        var regex = /(\[badge:([a-zA-Z\-]+)\])/i;
        if (!regex.test(text)) return false;
        var matchesArray = text.match(regex);
        return {
            total: matchesArray[0],
            name: matchesArray[1]
        };
    }
    var BadgeOneboxer = function(){};
    BadgeOneboxer.prototype.Start = function(){
        var m = new MutationObserver(function(data){
            console.log(data);
            for (var i = 0; i < data[0].addedNodes.length; i++){
                var nodeToChange = SelectChildNode(data[0].addedNodes[i]);
                ReplaceText(nodeToChange);
            }
        });
        m.observe(document.getElementById("chat"), {childList: true});
    };
    var BO = new BadgeOneboxer();
    BO.Start();