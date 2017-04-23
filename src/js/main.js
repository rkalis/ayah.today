function getRandomColour() {
    var colours = ["#16a085", "#27ae60", "#2c3e50", "#f39c12", "#e74c3c",
                   "#9b59b6", "#FB6964", "#342224", "#472E32", "#BDBB99",
                   "#77B1A9", "#73A857"];
    return colours[Math.floor(Math.random() * colours.length)];
}

function getRandomVerseNumber() {
    var noVerses = 6236;
    var verseNumber = Math.floor(Math.random() * noVerses) + 1
    return verseNumber;
}

function getTweetContents(content, link, hashtags) {
    var maxLength = 140;
    var ellipses = "...";
    var space = " ";
    var numberOfHashtags = hashtags.split(",").length;
    var tweet;

    if(content.length <= 140) {
        tweet = content;
    } else {
        maxLength -= link.length
        maxLength -= ellipses.length;
        maxLength -= 2 * space.length;
        maxLength -= hashtags.length;
        maxLength -= numberOfHashtags * space.length;

        tweet = content.slice(0, maxLength);
        tweet += ellipses;
        tweet += space;
        tweet += link;
    }

    return encodeURIComponent(tweet);
}

function changeContent(div, newContent, newColour) {
    var oldHeight = div.height();
    div.animate({opacity: 0}, function() {
        div.html(newContent);
        var newHeight = div.height();
        div.height(oldHeight);
        div.animate({height: newHeight, color: newColour, opacity: 1}, 500,
            function() {
                div.height('auto');
            });
    });
}

function newVerse() {
    if($("#getVerse").hasClass("requesting")) {
        return;
    }
    $("#getVerse").addClass("requesting");
    var verseNumber = getRandomVerseNumber();
    var url = "http://api.alquran.cloud/ayah/"
    url += verseNumber + "/editions/en.sahih";
    $.getJSON(url, function(json) {
        var verse = json.data[0];
        var content = verse.text;
        var surah = verse.surah.number;
        var number = verse.numberInSurah;

        var link = "https://quran.com/" + surah + "/" + number;

        var hashtags = "quran";
        var tweetLink = "https://twitter.com/intent/tweet?hashtags=" + hashtags
        tweetLink += "&text=" + getTweetContents(content, link, hashtags);

        var colour = getRandomColour();

        changeContent($("#verse"), content, colour);
        changeContent(
            $("#origin"),
            ' - <a href="' + link + '">' + surah + ":" + number + '</a>',
            colour);

        $("#tweet").attr("href", tweetLink);

        $("body").animate({
          backgroundColor: colour
        }, 1000);
        $(".btn").animate({
          backgroundColor: colour,
          borderColor: colour
        }, 1000,
        function() {
            $("#getVerse").removeClass("requesting");
        });
    });
}

(function($) {
    "use strict";

    $(document).ready(function() {
        newVerse();
    })
    $("#getVerse").on("click", function() {
        newVerse();
    });
})(jQuery);
