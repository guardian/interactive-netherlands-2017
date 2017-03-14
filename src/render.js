import mainTemplate from './src/templates/main.html!text'
import config from './../config.json'
import Mustache from 'mustache'
import chambertemplate from './src/templates/chamber.html!text'
import fetch from 'node-fetch'
import cheerio from 'cheerio'

function getcopy() {
    function isMobile() {
        if (window.innerWidth < 620) {
            return true;
        }
    }

    function isliveblog() {
        var url = window.top.location.pathname;
        if (url.search('/live/') > 0 || url.search('liveblog') > 0) {
            return true;
        } else { return false };
    }

    function cleannumber(input) {
        if (typeof input == "string") {
            input = input.replace(/,/g, "");
            return parseFloat(input);
        }
        if (typeof input == "number") {
            return input;
        }
    }

    function orderparties(parties) {
        parties = parties.sort(function (a, b) { return cleannumber(b.voteshare) - cleannumber(a.voteshare) });
        parties.map(function (p) {
            p.party == "PVV" ? p.pvv = true : p.pvv = false;
            p.party == "VVD" ? p.vvd = true : p.vvd = false;
        })
        return parties;
    }

    function applybarwidths(parties, newmaintemplate) {
        let $ = cheerio.load(newmaintemplate);
        parties.forEach(function (p) {
            var partybarclass = ".gv-elex-bar.gv-" + p.party;
            $(partybarclass).css('width', cleannumber(p.voteshare) + '%')
                .css('background-color', p.colour);

            var partyblobclass = ".gv-elex-blob.gv-" + p.party;
            $(partyblobclass).css('background-color', p.colour);

            p.party == "PVV" ? $(partybarclass).css('float', 'right') : 0;
        })
        newmaintemplate = $.html('.gv-results-wrapper');
        return newmaintemplate;
    }

    var newmaintemplate =
        fetch(config.docDataJson)
            .then((resp) => {
                return resp.json()
            })
            .then((json) => {
                var sheets = json.sheets;
                var parties = orderparties(sheets.results);
                var furniture = sheets.furniture[0];

                var everything = { "parties": parties, "furniture": furniture };
                var chamberhtml = Mustache.render(chambertemplate, everything);

                var newmaintemplate = mainTemplate.replace('<div class="gv-results-wrapper"></div>', '<div class="gv-results-wrapper">' + chamberhtml + '</div>');
                var newermaintemplate = applybarwidths(parties, newmaintemplate);
                return newermaintemplate;
            })
    
    return newmaintemplate;
}

export async function render() {
    return getcopy();
}
