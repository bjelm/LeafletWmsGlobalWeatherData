requirejs.config({
    'baseUrl': '../lib',
    'paths': {
        'leaflet.wms': '../leaflet.wms' //.js'
    }
});

define(['leaflet', 'leaflet.wms'],
function(L, wms) {

var overlayMap = createMap('overlay-map', false);
//var tiledMap = createMap('tiled-map', true);

function createMap(div, tiled) {
    // Map configuration
    var map = L.map(div,{
    crs : L.CRS.EPSG4326
}
    );

    map.setView([-75, -50.2], 3);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    var basemaps = {
        'Basemap': basemap(),
        'Blank': blank().addTo(map)

    };


/*
http://cwf.iass-potsdam.de/thredds/wms/T126/20141114.nc?VERSION=1.3.0&LAYERS=O3&ELEVATION=-995.9730834960938&TIME=2014-11-14T12%3A00%3A00.000Z&COLORSCALERANGE=0%2C8.8e-8&NUMCOLORBANDS=15&LOGSCALE=false&EXCEPTIONS=INIMAGE&SERVICE=WMS&REQUEST=GetMap&CRS=EPSG%3A4326&HEIGHT=256&WIDTH=256', {
    format: 'image/png;mode=32bit',
    layers:'CO',
    SRS: 'EPSG:4326',
    CRS:'CRS:83',
    tileSize:'256',
    elevation:'-995.9730834960938',
    time:'2014-11-09T18%3A00%3A00.000Z',
    styles:'boxfill/cwf_rainbow',
    bbox:'-90,-180,90,180',
    transparent:'true',
    tiled:'false'
*/
    // Add WMS source/layers
    var source = wms.source(
        "http://cwf.iass-potsdam.de/thredds/wms/T126/20141114.nc?VERSION=1.3.0&LAYERS=O3&ELEVATION=-995.9730834960938&COLORSCALERANGE=0%2C8.8e-8&NUMCOLORBANDS=15&LOGSCALE=false&EXCEPTIONS=INIMAGE&SERVICE=WMS&REQUEST=GetMap&CRS=EPSG%3A4326",
        {
            //"format": "image/png;mode=32bit",
            "format": "image/gif",
            "transparent": "true",
            "attribution": "<a href='http://nationalatlas.gov'>NationalAtlas.gov</a>",
            "styles":"boxfill/cwf_rainbow",
            "time":"2014-11-14T18%3A00%3A00.000Z",
            "bbox":"-90,-180,90,180"
        }
    );

    var layers = {
        'O3': source.getLayer("O3"),

    };
    for (var name in layers) {
        layers[name].addTo(map);
    }

    // Create layer control
    L.control.layers(basemaps, layers).addTo(map);

    return map;
}

function basemap() {
    // Attribution (https://gist.github.com/mourner/1804938)
    var mqcdn = "http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.png";
    var osmAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
    var mqTilesAttr = 'Tiles &copy; <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" />';
    return L.tileLayer(mqcdn, {
        'subdomains': '1234',
        'type': 'map',
        'attribution': osmAttr + ', ' + mqTilesAttr
    });
}

function blank() {
    var layer = new L.Layer();
    layer.onAdd = layer.onRemove = function() {};
    return layer;
}

// Export maps for console experimentation
return {
    'maps': {
        'overlay': overlayMap,
    }
};

});
