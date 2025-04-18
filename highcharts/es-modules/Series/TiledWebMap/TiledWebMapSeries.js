/* *
 *
 *  (c) 2010-2025 Hubert Kozik, Kamil Musiałowski
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../../Core/Globals.js';
const { composed } = H;
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const { map: MapSeries } = SeriesRegistry.seriesTypes;
import TilesProvidersRegistry from '../../Maps/TilesProviders/TilesProviderRegistry.js';
import TiledWebMapSeriesDefaults from './TiledWebMapSeriesDefaults.js';
import U from '../../Core/Utilities.js';
const { addEvent, defined, error, merge, pick, pushUnique } = U;
/* *
 *
 *  Functions
 *
 * */
/** @private */
function onRecommendMapView(e) {
    const { geoBounds, chart } = e, twm = (chart.options.series || []).filter((s) => s.type === 'tiledwebmap')[0];
    if (twm && twm.provider && twm.provider.type && !twm.provider.url) {
        const ProviderDefinition = TilesProvidersRegistry[twm.provider.type];
        if (!defined(ProviderDefinition)) {
            error('Highcharts warning: Tiles Provider not defined in the ' +
                'Provider Registry.', false);
        }
        else {
            const def = new ProviderDefinition(), { initialProjectionName: providerProjectionName } = def;
            if (geoBounds) {
                const { x1, y1, x2, y2 } = geoBounds;
                this.recommendedMapView = {
                    projection: {
                        name: providerProjectionName,
                        parallels: [y1, y2],
                        rotation: [-(x1 + x2) / 2]
                    }
                };
            }
            else {
                this.recommendedMapView = {
                    projection: {
                        name: providerProjectionName
                    },
                    minZoom: 0
                };
            }
            return false;
        }
    }
    return true;
}
/* *
 *
 *  Class
 *
 * */
/**
 * The series type
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.tiledwebmap
 *
 * @augments Highcharts.Series
 */
class TiledWebMapSeries extends MapSeries {
    constructor() {
        /* *
         *
         *  Static Properties
         *
         * */
        super(...arguments);
        this.redrawTiles = false;
        this.isAnimating = false;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    static compose(MapViewClass) {
        if (pushUnique(composed, 'TiledWebMapSeries')) {
            addEvent(MapViewClass, 'onRecommendMapView', onRecommendMapView);
        }
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Convert map coordinates in longitude/latitude to tile
     * @private
     * @param  {Highcharts.MapLonLatObject} lonLat
     *         The map coordinates
     * @return {Highcharts.PositionObject}
     *         Array of x and y positions of the tile
     */
    lonLatToTile(lonLat, zoom) {
        const { lon, lat } = lonLat, xTile = Math.floor((lon + 180) / 360 * Math.pow(2, zoom)), yTile = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) +
            1 / Math.cos(lat * Math.PI / 180)) / Math.PI) /
            2 * Math.pow(2, zoom));
        return { x: xTile, y: yTile };
    }
    /**
     * Convert tile to map coordinates in longitude/latitude
     * @private
     * @param  xTile
     *         Position x of the tile
     * @param  yTile
     *         Position y of the tile
     * @param  zTile
     *         Zoom of the tile
     * @return {Highcharts.MapLonLatObject}
     *         The map coordinates
     */
    tileToLonLat(xTile, yTile, zTile) {
        const lon = xTile / Math.pow(2, zTile) * 360 - 180, n = Math.PI - 2 * Math.PI * yTile / Math.pow(2, zTile), lat = (180 /
            Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
        return { lon, lat };
    }
    drawPoints() {
        const chart = this.chart, mapView = chart.mapView;
        if (!mapView) {
            return;
        }
        const tiles = (this.tiles = this.tiles || {}), transformGroups = (this.transformGroups = this.transformGroups || []), series = this, options = this.options, provider = options.provider, { zoom } = mapView, lambda = pick((mapView.projection.options.rotation &&
            mapView.projection.options.rotation[0]), 0), worldSize = 400.979322, tileSize = 256, duration = chart.renderer.forExport ? 0 : 200, animateTiles = (duration) => {
            for (const zoomKey of Object.keys(tiles)) {
                if ((parseFloat(zoomKey) === (mapView.zoom < 0 ? 0 :
                    Math.floor(mapView.zoom))) ||
                    (series.minZoom &&
                        (mapView.zoom < 0 ? 0 :
                            Math.floor(mapView.zoom)) < series.minZoom &&
                        parseFloat(zoomKey) === series.minZoom) ||
                    (series.maxZoom &&
                        (mapView.zoom < 0 ? 0 :
                            Math.floor(mapView.zoom)) > series.maxZoom &&
                        parseFloat(zoomKey) === series.maxZoom)) {
                    Object
                        .keys(tiles[zoomKey].tiles)
                        .forEach((key, i) => {
                        tiles[zoomKey].tiles[key].animate({
                            opacity: 1
                        }, {
                            duration: duration
                        }, () => {
                            if (i === Object.keys(tiles[zoomKey].tiles)
                                .length - 1) {
                                tiles[zoomKey].isActive = true;
                            }
                        });
                    });
                }
                else {
                    Object
                        .keys(tiles[zoomKey].tiles)
                        .forEach((key, i) => {
                        tiles[zoomKey].tiles[key].animate({
                            opacity: 0
                        }, {
                            duration: duration,
                            defer: duration / 2
                        }, () => {
                            tiles[zoomKey].tiles[key].destroy();
                            delete tiles[zoomKey].tiles[key];
                            if (i === Object.keys(tiles[zoomKey].tiles)
                                .length - 1) {
                                tiles[zoomKey].isActive = false;
                                tiles[zoomKey].loaded = false;
                            }
                        });
                    });
                }
            }
        };
        let zoomFloor = zoom < 0 ? 0 : Math.floor(zoom), maxTile = Math.pow(2, zoomFloor), scale = ((tileSize / worldSize) * Math.pow(2, zoom)) /
            ((tileSize / worldSize) * Math.pow(2, zoomFloor)), scaledTileSize = scale * 256;
        if (provider && (provider.type || provider.url)) {
            if (provider.type && !provider.url) {
                const ProviderDefinition = TilesProvidersRegistry[provider.type];
                if (!defined(ProviderDefinition)) {
                    error('Highcharts warning: Tiles Provider \'' +
                        provider.type + '\' not defined in the Provider' +
                        'Registry.', false);
                    return;
                }
                const def = new ProviderDefinition(), providerProjection = def.initialProjectionName;
                let theme, subdomain = '';
                if (provider.theme && defined(def.themes[provider.theme])) {
                    theme = def.themes[provider.theme];
                }
                else {
                    // If nothing set take first theme
                    const firstTheme = Object.keys(def.themes)[0];
                    theme = def.themes[firstTheme];
                    error('Highcharts warning: The Tiles Provider\'s Theme \'' +
                        provider.theme + '\' is not defined in the Provider ' +
                        'definition - falling back to \'' + firstTheme + '\'.', false);
                }
                if (provider.subdomain &&
                    def.subdomains &&
                    def.subdomains.indexOf(provider.subdomain) !== -1) {
                    subdomain = provider.subdomain;
                }
                else if (defined(def.subdomains) &&
                    // Do not show warning if no subdomain in URL
                    theme.url.indexOf('{s}') !== -1) {
                    subdomain = pick(def.subdomains && def.subdomains[0], '');
                    error('Highcharts warning: The Tiles Provider\'s Subdomain ' +
                        '\'' + provider.subdomain + '\' is not defined in ' +
                        'the Provider definition - falling back to \'' +
                        subdomain + '\'.', false);
                }
                if (def.requiresApiKey) {
                    if (provider.apiKey) {
                        theme.url =
                            theme.url.replace('{apikey}', provider.apiKey);
                    }
                    else {
                        error('Highcharts warning: The Tiles Provider requires ' +
                            'API Key to use tiles, use provider.apiKey to ' +
                            'provide a token.', false);
                        theme.url = theme.url.replace('?apikey={apikey}', '');
                    }
                }
                provider.url = theme.url
                    .replace('{s}', subdomain);
                this.minZoom = theme.minZoom;
                this.maxZoom = theme.maxZoom;
                // Add as credits.text, to prevent changing the default mapText
                const creditsText = pick(chart.userOptions.credits && chart.userOptions.credits.text, 'Highcharts.com ' + pick(theme.credits, def.defaultCredits));
                if (chart.credits) {
                    chart.credits.update({
                        text: creditsText
                    });
                }
                else {
                    chart.addCredits({
                        text: creditsText,
                        style: pick(chart.options.credits?.style, {})
                    });
                }
                if (mapView.projection.options.name !== providerProjection) {
                    error('Highcharts warning: The set projection is different ' +
                        'than supported by Tiles Provider.', false);
                }
            }
            else {
                if (!mapView.projection.options.name) {
                    error('Highcharts warning: The set projection is different ' +
                        'than supported by Tiles Provider.', false);
                }
            }
            // If zoom is smaller/higher than supported by provider
            if (defined(this.minZoom) && zoomFloor < this.minZoom) {
                zoomFloor = this.minZoom;
                maxTile = Math.pow(2, zoomFloor);
                scale = ((tileSize / worldSize) * Math.pow(2, zoom)) /
                    ((tileSize / worldSize) * Math.pow(2, zoomFloor));
                scaledTileSize = scale * 256;
            }
            else if (defined(this.maxZoom) && zoomFloor > this.maxZoom) {
                zoomFloor = this.maxZoom;
                maxTile = Math.pow(2, zoomFloor);
                scale = ((tileSize / worldSize) * Math.pow(2, zoom)) /
                    ((tileSize / worldSize) * Math.pow(2, zoomFloor));
                scaledTileSize = scale * 256;
            }
            if (mapView.projection && mapView.projection.def) {
                // Always true for tile maps
                mapView.projection.hasCoordinates = true;
                if (!transformGroups[zoomFloor]) {
                    transformGroups[zoomFloor] =
                        chart.renderer.g().add(this.group);
                }
                const replaceVariables = (url, x, y, zoom) => url
                    .replace('{x}', x.toString())
                    .replace('{y}', y.toString())
                    .replace('{zoom}', zoom.toString())
                    .replace('{z}', zoom.toString());
                const addTile = (x, y, givenZoom, translateX, translateY) => {
                    const modX = x % maxTile, modY = y % maxTile, tileX = modX < 0 ? modX + maxTile : modX, tileY = modY < 0 ? modY + maxTile : modY;
                    if (!tiles[`${givenZoom}`].tiles[`${x},${y}`]) {
                        if (provider.url) {
                            const url = replaceVariables(provider.url, tileX, tileY, givenZoom);
                            tiles[givenZoom].loaded = false;
                            tiles[`${givenZoom}`].tiles[`${x},${y}`] =
                                chart.renderer.image(url, (x * scaledTileSize) - translateX, (y * scaledTileSize) - translateY, scaledTileSize, scaledTileSize)
                                    .attr({
                                    zIndex: 2,
                                    opacity: 0
                                })
                                    .on('load', function () {
                                    if (provider.onload) {
                                        provider.onload.apply(this);
                                    }
                                    if ((givenZoom ===
                                        (mapView.zoom < 0 ? 0 :
                                            Math.floor(mapView.zoom))) ||
                                        givenZoom === series.minZoom) {
                                        tiles[`${givenZoom}`]
                                            .actualTilesCount++;
                                        // If last tile
                                        if (tiles[`${givenZoom}`]
                                            .howManyTiles ===
                                            tiles[`${givenZoom}`]
                                                .actualTilesCount) {
                                            tiles[givenZoom].loaded = true;
                                            // Fade-in new tiles if there is
                                            // no other animation
                                            if (!series.isAnimating) {
                                                series.redrawTiles = false;
                                                animateTiles(duration);
                                            }
                                            else {
                                                series.redrawTiles = true;
                                            }
                                            tiles[`${givenZoom}`]
                                                .actualTilesCount = 0;
                                        }
                                    }
                                })
                                    .add(transformGroups[givenZoom]);
                            tiles[`${givenZoom}`].tiles[`${x},${y}`].posX = x;
                            tiles[`${givenZoom}`].tiles[`${x},${y}`].posY = y;
                            tiles[`${givenZoom}`].tiles[`${x},${y}`]
                                .originalURL = url;
                        }
                    }
                };
                // Calculate topLeft and bottomRight corners without normalize
                const topLeftUnits = mapView.pixelsToProjectedUnits({
                    x: 0,
                    y: 0
                }), topLeftArr = mapView.projection.def.inverse([topLeftUnits.x, topLeftUnits.y]), topLeft = {
                    lon: topLeftArr[0] - lambda,
                    lat: topLeftArr[1]
                }, bottomRightUnits = mapView.pixelsToProjectedUnits({
                    x: chart.plotWidth,
                    y: chart.plotHeight
                }), bottomRightArr = mapView.projection.def.inverse([bottomRightUnits.x, bottomRightUnits.y]), bottomRight = {
                    lon: bottomRightArr[0] - lambda,
                    lat: bottomRightArr[1]
                };
                // Do not support vertical looping
                if (topLeft.lat > mapView.projection.maxLatitude ||
                    bottomRight.lat < -1 * mapView.projection.maxLatitude) {
                    topLeft.lat = mapView.projection.maxLatitude;
                    bottomRight.lat = -1 * mapView.projection.maxLatitude;
                }
                const startPos = this.lonLatToTile(topLeft, zoomFloor), endPos = this.lonLatToTile(bottomRight, zoomFloor);
                // Calculate group translations based on first loaded tile
                const firstTileLonLat = this.tileToLonLat(startPos.x, startPos.y, zoomFloor), units = mapView.projection.def.forward([
                    firstTileLonLat.lon + lambda,
                    firstTileLonLat.lat
                ]), firstTilePx = mapView.projectedUnitsToPixels({
                    x: units[0], y: units[1]
                }), translateX = (startPos.x * scaledTileSize - firstTilePx.x), translateY = (startPos.y * scaledTileSize - firstTilePx.y);
                if (!tiles[`${zoomFloor}`]) {
                    tiles[`${zoomFloor}`] = {
                        tiles: {},
                        isActive: false,
                        howManyTiles: 0,
                        actualTilesCount: 0,
                        loaded: false
                    };
                }
                tiles[`${zoomFloor}`].howManyTiles =
                    (endPos.x - startPos.x + 1) * (endPos.y - startPos.y + 1);
                tiles[`${zoomFloor}`].actualTilesCount = 0;
                for (let x = startPos.x; x <= endPos.x; x++) {
                    for (let y = startPos.y; y <= endPos.y; y++) {
                        addTile(x, y, zoomFloor, translateX, translateY);
                    }
                }
            }
            for (const zoomKey of Object.keys(tiles)) {
                for (const key of Object.keys(tiles[zoomKey].tiles)) {
                    if (mapView.projection && mapView.projection.def) {
                        // Calculate group translations based on first loaded
                        // tile
                        const scale = ((tileSize / worldSize) *
                            Math.pow(2, zoom)) / ((tileSize / worldSize) *
                            Math.pow(2, parseFloat(zoomKey))), scaledTileSize = scale * 256, firstTile = tiles[zoomKey].tiles[Object.keys(tiles[zoomKey].tiles)[0]], { posX, posY } = tiles[zoomKey].tiles[key];
                        if (defined(posX) &&
                            defined(posY) &&
                            defined(firstTile.posX) &&
                            defined(firstTile.posY)) {
                            const firstTileLonLat = this.tileToLonLat(firstTile.posX, firstTile.posY, parseFloat(zoomKey)), units = mapView.projection.def.forward([
                                firstTileLonLat.lon + lambda,
                                firstTileLonLat.lat
                            ]), firstTilePx = mapView.projectedUnitsToPixels({
                                x: units[0], y: units[1]
                            }), tilesOffsetX = (firstTile.posX * scaledTileSize) -
                                firstTilePx.x, tilesOffsetY = (firstTile.posY * scaledTileSize) -
                                firstTilePx.y;
                            if (chart.renderer.globalAnimation &&
                                chart.hasRendered) {
                                const startX = Number(tiles[zoomKey].tiles[key].attr('x')), startY = Number(tiles[zoomKey].tiles[key].attr('y')), startWidth = Number(tiles[zoomKey].tiles[key].attr('width')), startHeight = Number(tiles[zoomKey].tiles[key].attr('height'));
                                const step = (now, fx) => {
                                    tiles[zoomKey].tiles[key].attr({
                                        x: (startX + (((posX * scaledTileSize) -
                                            tilesOffsetX - startX) * fx.pos)),
                                        y: (startY + (((posY * scaledTileSize) -
                                            tilesOffsetY - startY) * fx.pos)),
                                        width: (startWidth + ((Math.ceil(scaledTileSize) + 1 -
                                            startWidth) * fx.pos)),
                                        height: (startHeight + ((Math.ceil(scaledTileSize) + 1 -
                                            startHeight) * fx.pos))
                                    });
                                };
                                series.isAnimating = true;
                                tiles[zoomKey].tiles[key]
                                    .attr({ animator: 0 })
                                    .animate({ animator: 1 }, { step }, function () {
                                    series.isAnimating = false;
                                    // If animate ended after loading
                                    // the tiles
                                    if (series.redrawTiles) {
                                        series.redrawTiles = false;
                                        animateTiles(duration);
                                    }
                                });
                                // When dragging or first rendering,
                                // animation is off
                            }
                            else {
                                // Animate tiles if something broke
                                if (series.redrawTiles ||
                                    parseFloat(zoomKey) !== zoomFloor ||
                                    ((tiles[zoomKey].isActive ||
                                        parseFloat(zoomKey) === zoomFloor) &&
                                        Object.keys(tiles[zoomKey].tiles)
                                            .map((key) => tiles[zoomKey].tiles[key])
                                            .some((tile) => tile.opacity === 0))) {
                                    series.redrawTiles = false;
                                    animateTiles(duration);
                                }
                                tiles[zoomKey].tiles[key].attr({
                                    x: (posX * scaledTileSize) - tilesOffsetX,
                                    y: (posY * scaledTileSize) - tilesOffsetY,
                                    width: Math.ceil(scaledTileSize) + 1,
                                    height: Math.ceil(scaledTileSize) + 1
                                });
                            }
                        }
                    }
                }
            }
        }
        else {
            error('Highcharts warning: Tiles Provider not defined in the ' +
                'Provider Registry.', false);
        }
    }
    update() {
        const series = this, { transformGroups } = series, chart = this.chart, mapView = chart.mapView, options = arguments[0], { provider } = options;
        if (transformGroups) {
            transformGroups.forEach((group) => {
                if (Object.keys(group).length !== 0) {
                    group.destroy();
                }
            });
            this.transformGroups = [];
        }
        if (mapView &&
            !defined(chart.userOptions.mapView?.projection) &&
            provider &&
            provider.type) {
            const ProviderDefinition = TilesProvidersRegistry[provider.type];
            if (ProviderDefinition) {
                const def = new ProviderDefinition(), { initialProjectionName: providerProjectionName } = def;
                mapView.update({
                    projection: {
                        name: providerProjectionName
                    }
                });
            }
        }
        super.update.apply(series, arguments);
    }
}
TiledWebMapSeries.defaultOptions = merge(MapSeries.defaultOptions, TiledWebMapSeriesDefaults);
SeriesRegistry.registerSeriesType('tiledwebmap', TiledWebMapSeries);
/* *
 *
 *  Default Export
 *
 * */
export default TiledWebMapSeries;
