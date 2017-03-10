

function chartcandidates(candidates) {
    var groupedcandidates = candidates;
    var others = {
        "party" : "Others",
        "displayname" : "Others",
        "voteshare" : 0
    }
    groupedcandidates.forEach(function combineothers(p){
        if (p.party != "VVD" && p.party != "PVV" && p.party != "D66" && p.party != "CDA" && p.party != "GL") {
        others.voteshare = others.voteshare + cleannumber(p.voteshare);
        p.grouped = true;
        } 
    })
    groupedcandidates.push(others);
            //add flag for parties that have seats (for legend)
    groupedcandidates.map(function(c) {
        if (cleannumber(c.seats) > 0 && c.grouped != true) { c.hasSeats = true };
                //add flags for DUP and SF
        if (c.party == "VVD") { c.vvd = true };
        if (c.party == "PVV") { c.pvv = true };
        
        c.grouped ? c.voteshare = 0 : c.voteshare = cleannumber(c.voteshare);
        return c;
    })  
    var summedvoteshare = 0;      
    groupedcandidates.forEach(function sumvoteshares (x) {
        summedvoteshare += x.voteshare;
    })    
    console.log(groupedcandidates);
    return groupedcandidates;
}

function ordercandidates(candidates) {
    //sort 
    candidates = candidates.sort(function (a, b) { return cleannumber(b.seats) - cleannumber(a.seats) });
    //find winner (so that bar widths can be calced)
    var winner = candidates[0];
    //calc bar widths
    candidates = candidates.map(function (c) {
        c.votesharevalue = cleannumber(c.voteshare);
        c.changevalue = cleannumber(c.change);
        if (c.changevalue > 0) {
            c.change = "+" + c.change;
        }
        c.fraction = cleannumber(c.seats) / cleannumber(winner.seats);
        c.width = c.votesharevalue + "%";
        return c;
    });
    console.log(candidates);
    return candidates;
}
