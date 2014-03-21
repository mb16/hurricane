/**
 * Created by mbrandt on 3/12/14.
 */

// path to OpenLayers images.
OpenLayers.ImgPath = "/hurricane/img/";


var focuslist =[];
var satelliteView = false;
$(document).ready(function () {
    $('#toggleSatellite').click(function () {
        if (satelliteView) {
            map.setBaseLayer(baseOSM);
            baseAerial.setVisibility(false);
            baseOSM.setVisibility(true);
            $('#toggleSatellite').html("Satellite");
        }
        else {
            map.setBaseLayer(baseAerial);
            baseAerial.setVisibility(true);
            baseOSM.setVisibility(false);
            $('#toggleSatellite').html("Street");
        }
        satelliteView = !satelliteView;
    });


    $.get( "focuslist.dat", function( data ) {

        focuslist =  $.merge($.map(data.split("\n"), genBDecks), $.map(data.split("\n"), $.trim));  // create b* dat files, at front on list.
        //console.log($.map(data.split("\n"), $.trim));
        //focuslist.concat( $.map(data.split("\n"), $.trim));  // add a* date files.
console.log(focuslist);
        // calls out to a function that should be implemented in each view.
        MapLauncher(); // initial data load
    });




});


function genBDecks(str){
    return str.length > 0 ? "b" + str.trim().substring(1) : "";
}

var lat = -0.12;
var lon = 51.503;
var zoom = 1;

var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
var position = new OpenLayers.LonLat(lon, lat).transform(fromProjection, toProjection);

map = new OpenLayers.Map("Map", {

    projection: new OpenLayers.Projection("EPSG:900913"),
    units: "m",
    maxResolution: 156543.0339,
    maxExtent: new OpenLayers.Bounds(
        -20037508, -20037508, 20037508, 20037508.34),
    displayProjection: toProjection,
    controls: [
        new OpenLayers.Control.Navigation(),
        new OpenLayers.Control.KeyboardDefaults(),
        new OpenLayers.Control.PanZoomBar(),
        new OpenLayers.Control.Scale(),
        new OpenLayers.Control.Attribution()
    ]

});




// http://developer.mapquest.com/web/products/open/map
// see terms of use at the bottom...

var arrayOSM = ["http://otile1.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg",
    "http://otile2.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg",
    "http://otile3.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg",
    "http://otile4.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg"];
var arrayAerial = ["http://otile1.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg",
    "http://otile2.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg",
    "http://otile3.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg",
    "http://otile4.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg"];

baseOSM = new OpenLayers.Layer.OSM("MapQuest-OSM Tiles", arrayOSM);
baseAerial = new OpenLayers.Layer.OSM("MapQuest Open Aerial Tiles", arrayAerial);

map.addLayer(baseOSM);
map.addLayer(baseAerial);


// this layer must be below the points layer since the point layers has the popups.
var layerHeatMap1 = null;
var layerHeatMap2 = null;
layerHeatMap1 = new OpenLayers.Layer.OSM("HeatMapLayer1");
layerHeatMap2 = new OpenLayers.Layer.Heatmap("HeatmapLayer2", map, layerHeatMap1, { visible: true, radius: 2 }, { isBaseLayer: false, opacity: 0.3, projection: toProjection });
map.addLayers([layerHeatMap1, layerHeatMap2]);



var markers = new OpenLayers.Layer.Markers("Markers");
map.addLayer(markers);


map.setCenter(position, zoom);



// create a styleMap with a custom default symbolizer
var styleMap = new OpenLayers.StyleMap({
    fillOpacity: 0.3,
    strokeWidth: 2,
    strokeColor: "Transparent",
    pointRadius: 4,
    fillColor: "Transparent"

});

// create a lookup table with different symbolizers for each line of business
var lookup = {
    "NONE": { fillColor: "Transparent",  strokeColor: "Transparent" },
    "COLOR0": { fillColor: "DarkViolet",  strokeColor: "DarkViolet" },
    "COLOR1": { fillColor: "DarkBlue",  strokeColor: "DarkBlue" },
    "COLOR2": { fillColor: "Brown",  strokeColor: "Brown" },
    "COLOR3": { fillColor: "Black",  strokeColor: "Black" },
    "COLOR4": { fillColor: "DarkGreen",  strokeColor: "DarkGreen" },
    "COLOR5": { fillColor: "DarkSalmon",  strokeColor: "DarkSalmon" },
    "COLOR6": { fillColor: "DeepPink",  strokeColor: "DeepPink" },
    "COLOR7": { fillColor: "DeepSkyBlue",  strokeColor: "DeepSkyBlue" },
    "COLOR8": { fillColor: "GoldenRod",  strokeColor: "GoldenRod" },
    "COLOR9": { fillColor: "GreenYellow",  strokeColor: "GreenYellow" },
    "COLOR10": { fillColor: "IndianRed",  strokeColor: "IndianRed" },
    "COLOR11": { fillColor: "LemonChiffon",  strokeColor: "LemonChiffon" },
    "COLOR12": { fillColor: "Magenta",  strokeColor: "Magenta" },
    "COLOR13": { fillColor: "MintCream",  strokeColor: "MintCream" },
    "COLOR14": { fillColor: "PeachPuff",  strokeColor: "PeachPuff" },
    "COLOR15": { fillColor: "Purple",  strokeColor: "Purple" },
    "COLOR16": { fillColor: "SeaShell",  strokeColor: "SeaShell" },
    "COLOR17": { fillColor: "Tan",  strokeColor: "Tan" },
    "KT15": { fillColor: "#FFFF07",  strokeColor: "#FFFF07" },
    "KT30": { fillColor: "#FFCD07",  strokeColor: "#FFCD07" },
    "KT45": { fillColor: "#FFB407",  strokeColor: "#FFB407" },
    "KT60": { fillColor: "#FF9C07",  strokeColor: "#FF9C07" },
    "KT75": { fillColor: "#FF8307",  strokeColor: "#FF8307" },
    "KT90": { fillColor: "#FF6A07",  strokeColor: "#FF6A07" },
    "KT105": { fillColor: "#FF5107",  strokeColor: "#FF5107" },
    "KT120": { fillColor: "#FF3907",  strokeColor: "#FF3907" },
    "KT135": { fillColor: "#FF2007",  strokeColor: "#FF2007" },
    "KT150": { fillColor: "#FF0707",  strokeColor: "#FF0707" },
    "CAT0": { fillColor: "#FFD507",  strokeColor: "#FFD507" },
    "CAT1": { fillColor: "#FFAC07",  strokeColor: "#FFAC07" },
    "CAT2": { fillColor: "#FF8307",  strokeColor: "#FF8307" },
    "CAT3": { fillColor: "#FF5A07",  strokeColor: "#FF5A07" },
    "CAT4": { fillColor: "#FF3007",  strokeColor: "#FF3007" },
    "CAT5": { fillColor: "#FF0707",  strokeColor: "#FF0707" }
};




// add rules from the above lookup table, with the keyes mapped to
// the "type" property of the features, for the "default" intent
styleMap.addUniqueValueRules("default", "type", lookup);



var layerPoints = null;
layerPoints = new OpenLayers.Layer.Vector("PointsLayer",{
    styleMap: styleMap,
    eventListeners: {
        'featureselected': function (evt) {
            var feature = evt.feature;
            var popup = new OpenLayers.Popup.FramedCloud("popup",
                OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
                null,
                "<div style='font-size:.8em'><strong>Storm:</strong> " + feature.attributes.storm + "<br /><strong>Model:</strong> " + feature.attributes.modelName + "<br /><strong>Location:</strong> " + feature.attributes.location + "<br /><strong>Hours:</strong> " + feature.attributes.time + "<br /><strong>Wind Speed:</strong> " + feature.attributes.windSpeed + "kts<br /><strong>Pressure:</strong> " + feature.attributes.pressure + "mb</div>",
                null,
                true
            );
            feature.popup = popup;
            map.addPopup(popup);
        },
        'featureunselected': function (evt) {
            var feature = evt.feature;
            map.removePopup(feature.popup);
            feature.popup.destroy();
            feature.popup = null;
        }
    }
});


// create the select feature control
var selector = new OpenLayers.Control.SelectFeature(layerPoints, {
    hover: true,
    autoActivate: true
});

map.addControl(selector);


var layerLines = new OpenLayers.Layer.Vector("LineLayer",{
    styleMap: styleMap
});
map.addLayer(layerLines);

// must be above line layer
map.addLayer(layerPoints);





var mapDisplayType = "1";
var focuslistData = {};

var models = {};
var modelIndex = 0;

map.events.register("zoomend", map, function () {
    if (mapDisplayType === "1") { // heatmap
        setTimeout(function () { // neccessary for UI updating
            layerHeatMap2.heatmap.set('radius', map.zoom * (2 / 7)); // scale the radius to make it proportional to zoom.
            layerHeatMap2.updateLayer();
        }, 0);
    }
});


function reloadData(endpointArray) {

    focuslistData = {}; // force reload of data.
    loadData(endpointArray);

}



function loadData(endpointArray) {

    mapDisplayType = $('#maptype').val();

    if (mapDisplayType === undefined)
        mapDisplayType = "2";


    // always clear features off points layer.
    layerPoints.destroyFeatures();
    layerLines.destroyFeatures();

    if (mapDisplayType === "2") {

        var transformedTestData = { max: 1, data: [] };
        layerHeatMap2.setDataSet(transformedTestData);

    }

    if (Object.keys(focuslistData).length > 0)
        addDataToLayer();
    else{

        for (var i = 0; i < endpointArray.length; i++) {

            if ( endpointArray[i] === undefined || endpointArray[i].trim().length === 0) continue;

            focuslistData[endpointArray[i]] = null;


            $.ajax({
                type: "GET",
                dataType: "text",
                url: endpointArray[i]
            })
                .fail(function () {
                    console.log("error");
                })
                .always(function () {
                    //console.log("complete");
                })
                .done(function (dataRecieved, textStatus, jqXHR) {

                    focuslistData[this.url] = $.csv.toArrays(dataRecieved);

                    var foundNull = false;
                    for (var key in focuslistData) {
                        if (focuslistData[key] === null )
                            foundNull = true;
                    }
                    if ( foundNull === false )
                        addDataToLayer();

                });
        }
    }
}


function buildDateTimeSelector(){

    function parseDateTimeHour(str){
        return str.substring(0,4) + "-" + str.substring(4,6) + "-" + str.substring(6,8) + " H: " + str.substring(8);
    }

    if ($("#DataSet").val() !== null ) return; // don't build list if it already built.

    var dateTimeList = {};

    for (var key in focuslistData) {

         var dataArray = focuslistData[key];
        console.log(key);
         for (var i = 0; i < dataArray.length; i++)
             dateTimeList[dataArray[i][2].trim()] = ""; // no need to store anything, using a dictionary for uniqueness

    }

    var orderedList = Object.keys(dateTimeList).sort();
    for (var i = 0; i < orderedList.length; i++) {

        $('#DataSet').append($('<option>', { value : orderedList[i] }).text(parseDateTimeHour(orderedList[i])));

    }

    $("#DataSet option:last").attr("selected","selected");
}


function addDataToLayer() {

    if (focuslistData != null) {

        buildDateTimeSelector();
        displayStormList();


        if (mapDisplayType === "1") {
            //filterHeatMap();
        }

        if (mapDisplayType === "2") {

            models = {};
            modelIndex = 0;

            for (var key in focuslistData) {

                console.log("display: " + key);

                var dataArray = focuslistData[key];

                var points = [];
                var lastType = null;

                var dateTimeDataSet = $("#DataSet").val();

                var StormList = getStormList();


                function drawLine(lType){

                    var featureVector = new OpenLayers.Feature.Vector(
                        new OpenLayers.Geometry.LineString(points)
                    );
                    featureVector.attributes.type = models[lType];
                    featureVector.attributes.modelName = lType;
                    featureVector.attributes.storm =getStormName();
                    featureVector.style = StormList.contains(getStormName()) && lType !== "CARQ" ? '' :{strokeColor:"Transparent"};
                    layerLines.addFeatures(featureVector);
                    //console.log("storm list: " + StormList);
                    //console.log(stormDatFile + " " + StormList.contains(stormDatFile) + " " + key);
                    //console.log("Add Line: " +models[lType] + " " + lType);
                }

                function getStormName()
                {
                    return key.substring(1,5).toUpperCase();
                }

                function parseDateTimeYear(str){
                    return parseInt(str.substring(0,4));
                }

                function parseDateTimeMonth(str){
                    return parseInt(str.substring(4,6)) - 1; // months numbered 0 - 11
                }

                function parseDateTimeDay(str){
                    return parseInt(str.substring(6,8));
                }

                function parseDateTimeHour(str){
                    return  parseInt(str.substring(8));
                }




                for (var i = 0; i < dataArray.length; i++) {

                    if (dataArray[i][2].trim() === dateTimeDataSet) {

                        if ( lastType !== dataArray[i][4].trim()){

                            if( models[dataArray[i][4].trim()] === undefined ) { // check if contains key
                                models[dataArray[i][4].trim()] = "COLOR" + modelIndex;
                                modelIndex++;
                            }

                            if ( lastType !== null )
                                drawLine(lastType);

                            points = [];
                        }

                        lastType =  dataArray[i][4].trim();


                        var lat = convertLatitude(dataArray[i][6].trim());
                        var lon = convertLongitude(dataArray[i][7].trim());
                        var position = new OpenLayers.LonLat(lon, lat).transform(fromProjection, toProjection);

                        var point = new OpenLayers.Geometry.Point(position.lon, position.lat);
                        var pointVector = new OpenLayers.Feature.Vector(point);


                        pointVector.attributes.modelName = dataArray[i][4].trim();
                        pointVector.attributes.time = ((new Date(Date.UTC(parseDateTimeYear(dataArray[i][2].trim()),parseDateTimeMonth(dataArray[i][2].trim()),parseDateTimeDay(dataArray[i][2].trim()),parseDateTimeHour(dataArray[i][2].trim()),0,0))).addHours(parseInt(dataArray[i][5].trim()))).toUTCString();
                        pointVector.attributes.windSpeed = dataArray[i][8].trim();

                        pointVector.attributes.type = GetColor(pointVector.attributes.modelName, pointVector.attributes.windSpeed, models, $("#IntensitySet").val());
                        pointVector.attributes.focus = key;
                        pointVector.attributes.pressure = dataArray[i][9].trim();
                        pointVector.attributes.storm = getStormName();
                        pointVector.attributes.stormDatFile = key;
                        pointVector.style = StormList.contains(getStormName()) & pointVector.attributes.modelName !== "CARQ" ? '' : 'NONE';
                        pointVector.attributes.location = convertLatitude(dataArray[i][6].trim()) + ", " + convertLatitude(dataArray[i][7].trim());
                        //console.log(lat + " " + lon + " " + dataArray[i][4] + " " + dataArray[i][5]);
                        //console.log(parseDateTimeYear(dataArray[i][2].trim()) + " " + parseDateTimeMonth(dataArray[i][2].trim()) + " " +parseDateTimeDay(dataArray[i][2].trim()) + " " +  parseDateTimeHour(dataArray[i][2].trim()));
                        //console.log(new Date(Date.UTC(parseDateTimeYear(dataArray[i][2].trim()),parseDateTimeMonth(dataArray[i][2].trim()),parseDateTimeDay(dataArray[i][2].trim()),parseDateTimeHour(dataArray[i][2].trim()),0,0)));
                        //console.log("add hours: " + parseInt(dataArray[i][5].trim()));
                        //console.log(((new Date(Date.UTC(parseDateTimeYear(dataArray[i][2].trim()),parseDateTimeMonth(dataArray[i][2].trim()),parseDateTimeDay(dataArray[i][2].trim()),parseDateTimeHour(dataArray[i][2].trim()),0,0))).addHours(parseInt(dataArray[i][5].trim()))));
                        //console.log(((new Date(Date.UTC(parseDateTimeYear(dataArray[i][2].trim()),parseDateTimeMonth(dataArray[i][2].trim()),parseDateTimeDay(dataArray[i][2].trim()),parseDateTimeHour(dataArray[i][2].trim()),0,0))).addHours(parseInt(dataArray[i][5].trim()))).toUTCString());
                        layerPoints.addFeatures([pointVector]);

                        points.push(point);

                    }

                }

                if ( points.length > 0 )
                    drawLine(lastType);

            }

            displayModelList(models);
            displayIntensitySet();
        }
    }
}



function GetColor(model, windSpeed, models, displayType){

    var speed = parseInt(windSpeed);
    if ( displayType === "1"  ){
        if ( speed >= 64 && speed <= 82 ) return "CAT1";
        if ( speed >= 83 && speed <= 95 ) return "CAT1";
        if ( speed >= 96 && speed <= 112 ) return "CAT1";
        if ( speed >= 113 && speed <= 136 ) return "CAT1";
        if ( speed >= 137 ) return "CAT1";
        return "CAT0";
    }
    else if (displayType === "2"){
        if (  speed <= 15 ) return "KT15";
        if ( speed <= 30 ) return "KT30";
        if (  speed <= 45 ) return "KT45";
        if ( speed <= 60 ) return "KT60";
        if (  speed <= 75 ) return "KT75";
        if (  speed <= 90 ) return "KT90";
        if ( speed <= 105 ) return "KT105";
        if (  speed <= 120 ) return "KT120";
        if (  speed <= 135 ) return "KT135";
        return "KT150";    }
    else{
        return models[model];
    }
}


function displayStormList(){


    if ($("#stormList").html() !== "" ) return; // don't build list if it already built.

    var html = "<strong>Storms:</strong> ";

    for (var key in focuslistData) {

        html += '&nbsp;<span style=""><input class="stormCheckbox" onclick="filterPoints();" type="checkbox" checked="checked" id="' + key.substring(1,5).toUpperCase() + '" name="' + key.substring(1,5).toUpperCase() + '" /><span>&nbsp;' + key.substring(1,5).toUpperCase() + '</span></span>';

    }
    console.log(html);
    $("#stormList").html(html);
}

function displayModelList(models){
    var html = "";

    for (var key in models) {

        var checked = (key != "CARQ" ? 'checked="checked"' : "");
        html += '&nbsp;<span style="border-bottom: 4px solid ' + lookup[models[key]].fillColor + ';"><input class="modelCheckbox" onclick="filterPoints();" type="checkbox" ' + checked + ' id="' + key + '" name="' + key + '" /><span>&nbsp;' + key + '</span></span>';

    }
 console.log(html);
    $("#modelKey").html(html);
}

function displayIntensitySet(){
    var html = "";
    var intensitySet = $("#IntensitySet").val()
    if (intensitySet === "1" ){
        html += '&nbsp;<span style="border-bottom: 4px solid ' + lookup["CAT0"].fillColor + ';"><span>&nbsp;None</span></span>';
        html += '&nbsp;<span style="border-bottom: 4px solid ' + lookup["CAT1"].fillColor + ';"><span>&nbsp;Category 1</span></span>';
        html += '&nbsp;<span style="border-bottom: 4px solid ' + lookup["CAT2"].fillColor + ';"><span>&nbsp;Category 2</span></span>';
        html += '&nbsp;<span style="border-bottom: 4px solid ' + lookup["CAT3"].fillColor + ';"><span>&nbsp;Category 3</span></span>';
        html += '&nbsp;<span style="border-bottom: 4px solid ' + lookup["CAT4"].fillColor + ';"><span>&nbsp;Category 4</span></span>';
        html += '&nbsp;<span style="border-bottom: 4px solid ' + lookup["CAT5"].fillColor + ';"><span>&nbsp;Category 5</span></span>';
    }
    else if (intensitySet ==="2"){

        html += '&nbsp;<span style="border-bottom: 4px solid ' + lookup["KT15"].fillColor + ';"><span>&nbsp;< 15 kt</span></span>';
        html += '&nbsp;<span style="border-bottom: 4px solid ' + lookup["KT30"].fillColor + ';"><span>&nbsp;< 30 kt</span></span>';
        html += '&nbsp;<span style="border-bottom: 4px solid ' + lookup["KT45"].fillColor + ';"><span>&nbsp;< 45 kt</span></span>';
        html += '&nbsp;<span style="border-bottom: 4px solid ' + lookup["KT60"].fillColor + ';"><span>&nbsp;< 60 kt</span></span>';
        html += '&nbsp;<span style="border-bottom: 4px solid ' + lookup["KT75"].fillColor + ';"><span>&nbsp;< 75 kt</span></span>';
        html += '&nbsp;<span style="border-bottom: 4px solid ' + lookup["KT90"].fillColor + ';"><span>&nbsp;< 90 kt</span></span>';
        html += '&nbsp;<span style="border-bottom: 4px solid ' + lookup["KT105"].fillColor + ';"><span>&nbsp;< 105 kt</span></span>';
        html += '&nbsp;<span style="border-bottom: 4px solid ' + lookup["KT120"].fillColor + ';"><span>&nbsp;< 120 kt</span></span>';
        html += '&nbsp;<span style="border-bottom: 4px solid ' + lookup["KT135"].fillColor + ';"><span>&nbsp;< 135 kt</span></span>';
        html += '&nbsp;<span style="border-bottom: 4px solid ' + lookup["KT150"].fillColor + ';"><span>&nbsp;> 135 kt</span></span>';
    }

    $("#intensityKey").html(html);
}


function filterPoints() {

    var ModelList = getModelList();
    var StormList = getStormList();
    console.log(ModelList);
    console.log(StormList);

    for (var i = 0; i < layerPoints.features.length; i++){
        layerPoints.features[i].attributes.type = GetColor(layerPoints.features[i].attributes.modelName, layerPoints.features[i].attributes.windSpeed, models, $("#IntensitySet").val());
        layerPoints.features[i].style = (ModelList.contains(layerPoints.features[i].attributes.modelName) && StormList.contains(layerPoints.features[i].attributes.storm) ? '' : 'NONE');
    }
    layerPoints.redraw();

    for (var i = 0; i < layerLines.features.length; i++){
        layerLines.features[i].style = (ModelList.contains(layerLines.features[i].attributes.modelName) && StormList.contains(layerLines.features[i].attributes.storm) ? '' :{strokeColor:"Transparent"}); // NONE doesn't work here.
    }
    layerLines.redraw();
}


function getModelList() {
    var list = [];
    $('input[type = checkbox].modelCheckbox').each(function (index, value) {
        console.log($(this).attr('id'));
        if ($(value).is(':checked'))
            list.push($(this).attr('id'));
     });

    return list;
}


function getStormList() {
    var list = [];
    $('input[type = checkbox].stormCheckbox').each(function (index, value) {
        console.log($(this).attr('id'));
        if ($(value).is(':checked'))
            list.push($(this).attr('id'));
    });

    return list;
}


function convertLatitude(str){
    var dir = str.charAt(str.length - 1);
    var val = str.substring(0,str.length - 1);
    return (dir === "S" ? -1 : 1 ) * parseFloat(val)/ 10.0;
}

function convertLongitude(str){
    var dir = str.charAt(str.length - 1);
    var val = str.substring(0,str.length - 1);
    return (dir === "W" ? -1 : 1 ) * parseFloat(val)/ 10.0;
}



function positionMap(lat, lon, zm){

    if (lat != null && lon != null) {
        var position = new OpenLayers.LonLat(lon, lat).transform(fromProjection, toProjection);
        map.setCenter(position, zm);
    }
}



Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

Date.prototype.addHours= function(h){
    var copiedDate = new Date(this.getTime());
    copiedDate.setHours(copiedDate.getHours()+h);
    return copiedDate;
}