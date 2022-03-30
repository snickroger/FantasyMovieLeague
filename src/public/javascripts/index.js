function changeSeason(e) {
  var seasonSlug = jQuery(e.target).val();
  window.location = '/?season='+seasonSlug;
}

function changeTeam(e, seasonSlug) {
  var team = jQuery(e.target).val();
  if (team) {
    window.location = '/'+team+'?season='+seasonSlug;
  }
}

var SORT = {
  selectedAttr: null,
  selectedDir: null,
  defaults: {
    releaseDate: { attr: "release-date", dir: "asc"},
    title: { attr: "title", dir: "asc" },
    shares: { attr: "shares", dir: "desc" },
    gross: { attr: "gross", dir: "desc" },
    rating: { attr: "rating", dir: "desc" },
    value: { attr: "value", dir: "desc" }
  }
}

var RANKING_SORT = {
  selectedIndex: null,
  selectedDir: null
}

function sort(s) {
  var dir;
  if (s.attr === SORT.selectedAttr && SORT.selectedDir === "asc") {
    dir = "desc";
  } else if (s.attr === SORT.selectedAttr && SORT.selectedDir === "desc") {
    dir = "asc";
  } else {
    dir = s.dir;
  }

  tinysort('#movies div.movie-box', {data: s.attr, order: dir});
  SORT.selectedAttr = s.attr;
  SORT.selectedDir = dir;

  return false;
}

function rankingSort(index) {
  var dir;
  if (index === RANKING_SORT.selectedIndex && RANKING_SORT.selectedDir === "asc") {
    dir = "desc";
  } else {
    dir = "asc";
  }

  tinysort('#rankings tbody tr', { selector: 'td:nth-child('+(index+1)+')', data:'sort', order: dir });
  RANKING_SORT.selectedIndex = index;
  RANKING_SORT.selectedDir = dir;

  return false;
}

$("#end-date").countdown(endDate, function(event) {
  if(event.offset.totalDays > 0 && event.offset.totalDays <= 28) {
    format = '%-d day%!d ';
    $(this).html("Season ends in " + event.strftime(format));
  }
});
