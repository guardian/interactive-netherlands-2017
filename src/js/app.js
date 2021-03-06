import xr from 'xr'
import config from './../../config.json'
import Mustache from 'mustache'
//import swig from 'swig'
import chambertemplate from './../templates/chamber.html'
import chamberseatstemplate from './../templates/chamberseats.html'

var totalseats = 120;

var useSeats = true;
var dataurl = isPreview() ? config.docDataJsonPreview : config.docDataJson;

function isPreview() {
    var url = window.top.location.hostname;
    if (url.search('gutools.co.uk') >= 0 || url.search('localhost') >= 0) {
        return true;
    } else {return false};
}

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
    if (typeof input == "string" )
{    input = input.replace(/,/g, "");
    return parseFloat(input);
}
    if (typeof input == "number") {
        return input;
    }
}

function orderparties(parties) {
    parties = parties.sort(function (a, b) { return cleannumber(b.voteshare) - cleannumber(a.voteshare) });
    parties.map(function(p){
        p.party == "National" ? p.pvv = true: p.pvv = false;
        p.party == "Labour" ? p.vvd = true: p.vvd = false;
        p.seatschangemessage = cleannumber(p.seatschange) > 0 ? '+' + cleannumber(p.seatschange) : cleannumber(p.seatschange);  
    })
   // console.log(parties);
    return parties;
}

function applybarwidths(parties) {
    parties.forEach(function(p){
        var partybarclass = ".gv-elex-bar.gv-" + p.party;
        var thisbar = document.querySelector(partybarclass);
        thisbar.style.width = cleannumber(p.voteshare) + "%";
        thisbar.style['background-color'] = p.colour;

     var partyblobclass = ".gv-elex-blob.gv-" + p.party;
     var thisblob = document.querySelector(partyblobclass);
   //  console.log(thisblob);
     thisblob.style['background-color'] = p.colour;
    // console.log(thisblob);

     p.party == "National" ? thisbar.style.float = "right" : 0 ;

     
    })
}

xr.get(dataurl).then((resp) => {
    var sheets = resp.data.sheets;
    useSeats = cleannumber(sheets.results[1].seats) > 0 ? true : false;
    var parties = orderparties(sheets.results);
    var furniture = sheets.furniture[0];
    console.log(furniture);
    totalseats = cleannumber(furniture.totalseats);

    var everything = {"parties" : parties, "furniture" : furniture};
    var chamberhtml = useSeats? Mustache.render(chamberseatstemplate, everything) : Mustache.render(chambertemplate, everything);


    var resultswrapper = document.querySelector(".gv-results-wrapper");
    resultswrapper.innerHTML = chamberhtml;
    applybarwidths(parties);
    isMainMedia() ? resultswrapper.classList.add('gv-main-media') : '';
     if (isliveblog() == true && isMainMedia() != true ) {
        document.querySelector(".gv-results-wrapper").classList.add("liveblog");
    }
    window.resize();

})


function isMainMedia() {
    var atomelement = parent.document.querySelector(".element-atom");
    var atomchild = atomelement.firstChild.nextSibling;
    var atomparent = atomelement.parentElement;
    if (atomchild.classList.contains('interactive-atom-fence') && atomparent.classList.contains('media-primary') ){
        return true;
    }
}

