$(".shares").change(updateMoneyRemaining).keyup(updateMoneyRemaining);
$(updateMoneyRemaining);

function changeSeason(e) {
  var seasonSlug = jQuery(e.target).val();
  window.location = '/?season='+seasonSlug;
}

function updateMoneyRemaining()
{
    var start = 100;
    var error = false;
    var boxes = $(".shares");
    var meter = document.getElementById('remaining');

    for (i=0;i<boxes.length;i++)
    {
        var val = boxes.eq(i).val();

        if (isNaN(val) || val == "" || val > 100 || val < 0 || val % 1 != 0)
        {
            boxes.eq(i).css("background-color","#F55");
            error = true;
        }
        else
        {
            start -= parseInt(val);
            boxes.eq(i).css("background-color","");
        }
    }

    var pct = Math.max(0,120*(start/100));
    var cappedValue = Math.max(0, start);
    meter.style.background = `#fff linear-gradient(to right, hsla(${pct},100%,80%,1) 0%, hsla(${pct},100%,80%,1) ${cappedValue}%, hsla(${pct},100%,40%,0) ${cappedValue}%)`;
    meter.children[0].innerHTML = `${start} remaining`;

    var bonusSelected = $("#bonus1").val() !== "-1" && $("#bonus2").val() !== "-1";

    if (start != 0 || error || !bonusSelected)
        $("#save").attr("disabled","disabled");
    else
        $("#save").removeAttr("disabled");
}

function hsl2rgba(h, s, l, a) {
    var m1, m2, hue;
    var r, g, b
    s /= 100;
    l /= 100;
    if (s == 0)
        r = g = b = (l * 255);
    else {
        if (l <= 0.5)
            m2 = l * (s + 1);
        else
            m2 = l + s - l * s;
        m1 = l * 2 - m2;
        hue = h / 360;
        r = HueToRgb(m1, m2, hue + 1/3);
        g = HueToRgb(m1, m2, hue);
        b = HueToRgb(m1, m2, hue - 1/3);
    }
    return "rgba("+Math.round(r)+", "+Math.round(g)+", "+Math.round(b)+", " + a + ")";
}

function HueToRgb(m1, m2, hue) {
    var v;
    if (hue < 0)
        hue += 1;
    else if (hue > 1)
        hue -= 1;

    if (6 * hue < 1)
        v = m1 + (m2 - m1) * hue * 6;
    else if (2 * hue < 1)
        v = m2;
    else if (3 * hue < 2)
        v = m1 + (m2 - m1) * (2/3 - hue) * 6;
    else
        v = m1;

    return 255 * v;
}

$("#deadline").countdown(seasonStart, function(event) {
    var format = '%H:%M:%S';
    if(event.offset.totalDays > 0) {
        format = '%-d day%!d ' + format;
    }
    if(event.offset.weeks > 0) {
        format = '%-w week%!w ' + format;
    }
    $(this).html(event.strftime(format));
});
