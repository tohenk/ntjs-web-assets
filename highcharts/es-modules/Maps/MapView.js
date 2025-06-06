/* *
 *
 *  (c) 2010-2025 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../Core/Globals.js';
const { composed } = H;
import MapViewDefaults from './MapViewDefaults.js';
import GeoJSONComposition from './GeoJSONComposition.js';
import GeometryUtilities from '../Core/Geometry/GeometryUtilities.js';
const { pointInPolygon } = GeometryUtilities;
const { topo2geo } = GeoJSONComposition;
import MU from './MapUtilities.js';
const { boundsFromPath } = MU;
import Projection from './Projection.js';
import U from '../Core/Utilities.js';
const { addEvent, clamp, crisp, fireEvent, isArray, isNumber, isObject, isString, merge, pick, pushUnique, relativeLength } = U;
/* *
 *
 *  Constants
 *
 * */
const tileSize = 256;
/**
 * The world size in terms of 10k meters in the Web Mercator projection, to
 * match a 256 square tile to zoom level 0.
 * @private
 */
const worldSize = 400.979322;
/* *
 *
 *  Variables
 *
 * */
let maps = {};
/* *
 *
 *  Functions
 *
 * */
/**
 * Compute the zoom from given bounds and the size of the playing field. Used in
 * two places, hence the local function.
 * @private
 */
function zoomFromBounds(b, playingField) {
    const { width, height } = playingField, scaleToField = Math.max((b.x2 - b.x1) / (width / tileSize), (b.y2 - b.y1) / (height / tileSize));
    return Math.log(worldSize / scaleToField) / Math.log(2);
}
/**
 * Calculate and set the recommended map view drilldown or drillup if mapData
 * is set for the series.
 * @private
 */
function recommendedMapViewAfterDrill(e) {
    if (e.seriesOptions.mapData) {
        this.mapView?.recommendMapView(this, [
            this.options.chart.map,
            e.seriesOptions.mapData
        ], this.options.drilldown?.mapZooming);
    }
}
/*
Const mergeCollections = <
    T extends Array<AnyRecord|undefined>
>(a: T, b: T): T => {
    b.forEach((newer, i): void => {
        // Only merge by id supported for now. We may consider later to support
        // more complex rules like those of `Chart.update` with `oneToOne`, but
        // it is probably not needed. Existing insets can be disabled by
        // overwriting the `geoBounds` with empty data.
        if (newer && isString(newer.id)) {
            const older = U.find(
                a,
                (aItem): boolean => (aItem && aItem.id) === newer.id
            );
            if (older) {
                const aIndex = a.indexOf(older);
                a[aIndex] = merge(older, newer);
            }
        }
    });
    return a;
};
*/
/* *
 *
 *  Classes
 *
 * */
/**
 * The map view handles zooming and centering on the map, and various
 * client-side projection capabilities.
 *
 * On a chart instance of `MapChart`, the map view is available as `chart.mapView`.
 *
 * @class
 * @name Highcharts.MapView
 *
 * @param {Highcharts.MapChart} chart
 *        The MapChart instance
 * @param {Highcharts.MapViewOptions} options
 *        MapView options
 */
class MapView {
    /* *
     *
     *  Static Functions
     *
     * */
    static compose(MapChartClass) {
        if (pushUnique(composed, 'MapView')) {
            maps = MapChartClass.maps;
            // Initialize MapView after initialization, but before firstRender
            addEvent(MapChartClass, 'afterInit', function () {
                /**
                 * The map view handles zooming and centering on the map, and
                 * various client-side projection capabilities.
                 *
                 * @name Highcharts.MapChart#mapView
                 * @type {Highcharts.MapView|undefined}
                 */
                this.mapView = new MapView(this, this.options.mapView);
            }, { order: 0 });
            addEvent(MapChartClass, 'addSeriesAsDrilldown', recommendedMapViewAfterDrill);
            addEvent(MapChartClass, 'afterDrillUp', recommendedMapViewAfterDrill);
        }
    }
    /**
     * Return the composite bounding box of a collection of bounding boxes
     * @private
     */
    static compositeBounds(arrayOfBounds) {
        if (arrayOfBounds.length) {
            return arrayOfBounds
                .slice(1)
                .reduce((acc, cur) => {
                acc.x1 = Math.min(acc.x1, cur.x1);
                acc.y1 = Math.min(acc.y1, cur.y1);
                acc.x2 = Math.max(acc.x2, cur.x2);
                acc.y2 = Math.max(acc.y2, cur.y2);
                return acc;
            }, merge(arrayOfBounds[0]));
        }
        return;
    }
    /**
     * Merge two collections of insets by the id.
     * @private
     */
    static mergeInsets(a, b) {
        const toObject = (insets) => {
            const ob = {};
            insets.forEach((inset, i) => {
                ob[inset && inset.id || `i${i}`] = inset;
            });
            return ob;
        };
        const insetsObj = merge(toObject(a), toObject(b)), insets = Object
            .keys(insetsObj)
            .map((key) => insetsObj[key]);
        return insets;
    }
    /* *
     *
     *  Constructor
     *
     * */
    constructor(chart, options) {
        /* *
         *
         *  Properties
         *
         * */
        this.allowTransformAnimation = true;
        this.eventsToUnbind = [];
        this.insets = [];
        this.padding = [0, 0, 0, 0];
        this.recommendedMapView = {};
        if (!(this instanceof MapViewInset)) {
            this.recommendMapView(chart, [
                chart.options.chart.map,
                ...(chart.options.series || []).map((s) => s.mapData)
            ]);
        }
        this.userOptions = options || {};
        const o = merge(MapViewDefaults, this.recommendedMapView, options);
        // Merge the inset collections by id, or index if id missing
        const recInsets = this.recommendedMapView?.insets, optInsets = options && options.insets;
        if (recInsets && optInsets) {
            o.insets = MapView.mergeInsets(recInsets, optInsets);
        }
        this.chart = chart;
        /**
         * The current center of the view in terms of `[longitude, latitude]`.
         * @name Highcharts.MapView#center
         * @readonly
         * @type {LonLatArray}
         */
        this.center = o.center;
        this.options = o;
        this.projection = new Projection(o.projection);
        // Initialize with full plot box so we don't have to check for undefined
        // every time we use it
        this.playingField = chart.plotBox;
        /**
         * The current zoom level of the view.
         * @name Highcharts.MapView#zoom
         * @readonly
         * @type {number}
         */
        this.zoom = o.zoom || 0;
        this.minZoom = o.minZoom;
        // Create the insets
        this.createInsets();
        // Initialize and respond to chart size changes
        this.eventsToUnbind.push(addEvent(chart, 'afterSetChartSize', () => {
            this.playingField = this.getField();
            if (this.minZoom === void 0 || // When initializing the chart
                this.minZoom === this.zoom // When resizing the chart
            ) {
                this.fitToBounds(void 0, void 0, false);
                if (
                // Set zoom only when initializing the chart
                // (do not overwrite when zooming in/out, #17082)
                !this.chart.hasRendered &&
                    isNumber(this.userOptions.zoom)) {
                    this.zoom = this.userOptions.zoom;
                }
                if (this.userOptions.center) {
                    merge(true, this.center, this.userOptions.center);
                }
            }
        }));
        this.setUpEvents();
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Create MapViewInset instances from insets options
     * @private
     */
    createInsets() {
        const options = this.options, insets = options.insets;
        if (insets) {
            insets.forEach((item) => {
                const inset = new MapViewInset(this, merge(options.insetOptions, item));
                this.insets.push(inset);
            });
        }
    }
    /**
     * Fit the view to given bounds
     *
     * @function Highcharts.MapView#fitToBounds
     * @param {Object} bounds
     *        Bounds in terms of projected units given as  `{ x1, y1, x2, y2 }`.
     *        If not set, fit to the bounds of the current data set
     * @param {number|string} [padding=0]
     *        Padding inside the bounds. A number signifies pixels, while a
     *        percentage string (like `5%`) can be used as a fraction of the
     *        plot area size.
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart immediately
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     *        What animation to use for redraw
     */
    fitToBounds(bounds, padding, redraw = true, animation) {
        const b = bounds || this.getProjectedBounds();
        if (b) {
            const pad = pick(padding, bounds ? 0 : this.options.padding), fullField = this.getField(false), padArr = isArray(pad) ? pad : [pad, pad, pad, pad];
            this.padding = [
                relativeLength(padArr[0], fullField.height),
                relativeLength(padArr[1], fullField.width),
                relativeLength(padArr[2], fullField.height),
                relativeLength(padArr[3], fullField.width)
            ];
            // Apply the playing field, corrected with padding
            this.playingField = this.getField();
            const zoom = zoomFromBounds(b, this.playingField);
            // Reset minZoom when fitting to natural bounds
            if (!bounds) {
                this.minZoom = zoom;
            }
            const center = this.projection.inverse([
                (b.x2 + b.x1) / 2,
                (b.y2 + b.y1) / 2
            ]);
            this.setView(center, zoom, redraw, animation);
        }
    }
    getField(padded = true) {
        const padding = padded ? this.padding : [0, 0, 0, 0];
        return {
            x: padding[3],
            y: padding[0],
            width: this.chart.plotWidth - padding[1] - padding[3],
            height: this.chart.plotHeight - padding[0] - padding[2]
        };
    }
    getGeoMap(map) {
        if (isString(map)) {
            if (maps[map] && maps[map].type === 'Topology') {
                return topo2geo(maps[map]);
            }
            return maps[map];
        }
        if (isObject(map, true)) {
            if (map.type === 'FeatureCollection') {
                return map;
            }
            if (map.type === 'Topology') {
                return topo2geo(map);
            }
        }
    }
    getMapBBox() {
        const bounds = this.getProjectedBounds(), scale = this.getScale();
        if (bounds) {
            const padding = this.padding, p1 = this.projectedUnitsToPixels({
                x: bounds.x1,
                y: bounds.y2
            }), width = ((bounds.x2 - bounds.x1) * scale +
                padding[1] + padding[3]), height = ((bounds.y2 - bounds.y1) * scale +
                padding[0] + padding[2]);
            return {
                width,
                height,
                x: p1.x - padding[3],
                y: p1.y - padding[0]
            };
        }
    }
    getProjectedBounds() {
        const projection = this.projection;
        const allBounds = this.chart.series.reduce((acc, s) => {
            const bounds = s.getProjectedBounds && s.getProjectedBounds();
            if (bounds &&
                s.options.affectsMapView !== false) {
                acc.push(bounds);
            }
            return acc;
        }, []);
        // The bounds option
        const fitToGeometry = this.options.fitToGeometry;
        if (fitToGeometry) {
            if (!this.fitToGeometryCache) {
                if (fitToGeometry.type === 'MultiPoint') {
                    const positions = fitToGeometry.coordinates
                        .map((lonLat) => projection.forward(lonLat)), xs = positions.map((pos) => pos[0]), ys = positions.map((pos) => pos[1]);
                    this.fitToGeometryCache = {
                        x1: Math.min.apply(0, xs),
                        x2: Math.max.apply(0, xs),
                        y1: Math.min.apply(0, ys),
                        y2: Math.max.apply(0, ys)
                    };
                }
                else {
                    this.fitToGeometryCache = boundsFromPath(projection.path(fitToGeometry));
                }
            }
            return this.fitToGeometryCache;
        }
        return this.projection.bounds || MapView.compositeBounds(allBounds);
    }
    getScale() {
        // A zoom of 0 means the world (360x360 degrees) fits in a 256x256 px
        // tile
        return (tileSize / worldSize) * Math.pow(2, this.zoom);
    }
    // Calculate the SVG transform to be applied to series groups
    getSVGTransform() {
        const { x, y, width, height } = this.playingField, projectedCenter = this.projection.forward(this.center), flipFactor = this.projection.hasCoordinates ? -1 : 1, scaleX = this.getScale(), scaleY = scaleX * flipFactor, translateX = x + width / 2 - projectedCenter[0] * scaleX, translateY = y + height / 2 - projectedCenter[1] * scaleY;
        return { scaleX, scaleY, translateX, translateY };
    }
    /**
     * Convert map coordinates in longitude/latitude to pixels
     *
     * @function Highcharts.MapView#lonLatToPixels
     * @since 10.0.0
     * @param  {Highcharts.MapLonLatObject} lonLat
     *         The map coordinates
     * @return {Highcharts.PositionObject|undefined}
     *         The pixel position
     */
    lonLatToPixels(lonLat) {
        const pos = this.lonLatToProjectedUnits(lonLat);
        if (pos) {
            return this.projectedUnitsToPixels(pos);
        }
    }
    /**
     * Get projected units from longitude/latitude. Insets are accounted for.
     * Returns an object with x and y values corresponding to positions on the
     * projected plane.
     *
     * @requires modules/map
     *
     * @function Highcharts.MapView#lonLatToProjectedUnits
     *
     * @since 10.0.0
     * @sample maps/series/latlon-to-point/ Find a point from lon/lat
     *
     * @param {Highcharts.MapLonLatObject} lonLat Coordinates.
     *
     * @return {Highcharts.ProjectedXY} X and Y coordinates in terms of
     *      projected values
     */
    lonLatToProjectedUnits(lonLat) {
        const chart = this.chart, mapTransforms = chart.mapTransforms;
        // Legacy, built-in transforms
        if (mapTransforms) {
            for (const transform in mapTransforms) {
                if (Object.hasOwnProperty.call(mapTransforms, transform) &&
                    mapTransforms[transform].hitZone) {
                    const coords = chart.transformFromLatLon(lonLat, mapTransforms[transform]);
                    if (coords && pointInPolygon(coords, mapTransforms[transform].hitZone.coordinates[0])) {
                        return coords;
                    }
                }
            }
            return chart.transformFromLatLon(lonLat, mapTransforms['default'] // eslint-disable-line dot-notation
            );
        }
        // Handle insets
        for (const inset of this.insets) {
            if (inset.options.geoBounds &&
                pointInPolygon({ x: lonLat.lon, y: lonLat.lat }, inset.options.geoBounds.coordinates[0])) {
                const insetProjectedPoint = inset.projection.forward([lonLat.lon, lonLat.lat]), pxPoint = inset.projectedUnitsToPixels({ x: insetProjectedPoint[0], y: insetProjectedPoint[1] });
                return this.pixelsToProjectedUnits(pxPoint);
            }
        }
        const point = this.projection.forward([lonLat.lon, lonLat.lat]);
        if (!point.outside) {
            return { x: point[0], y: point[1] };
        }
    }
    /**
     * Calculate longitude/latitude values for a point or position. Returns an
     * object with the numeric properties `lon` and `lat`.
     *
     * @requires modules/map
     *
     * @function Highcharts.MapView#projectedUnitsToLonLat
     *
     * @since 10.0.0
     *
     * @sample maps/demo/latlon-advanced/ Advanced lat/lon demo
     *
     * @param {Highcharts.Point|Highcharts.ProjectedXY} point
     *        A `Point` instance or anything containing `x` and `y` properties
     *        with numeric values.
     *
     * @return {Highcharts.MapLonLatObject|undefined} An object with `lat` and
     *         `lon` properties.
     */
    projectedUnitsToLonLat(point) {
        const chart = this.chart, mapTransforms = chart.mapTransforms;
        // Legacy, built-in transforms
        if (mapTransforms) {
            for (const transform in mapTransforms) {
                if (Object.hasOwnProperty.call(mapTransforms, transform) &&
                    mapTransforms[transform].hitZone &&
                    pointInPolygon(point, mapTransforms[transform].hitZone.coordinates[0])) {
                    return chart.transformToLatLon(point, mapTransforms[transform]);
                }
            }
            return chart.transformToLatLon(point, mapTransforms['default'] // eslint-disable-line dot-notation
            );
        }
        const pxPoint = this.projectedUnitsToPixels(point);
        for (const inset of this.insets) {
            if (inset.hitZone &&
                pointInPolygon(pxPoint, inset.hitZone.coordinates[0])) {
                const insetProjectedPoint = inset
                    .pixelsToProjectedUnits(pxPoint), coordinates = inset.projection.inverse([insetProjectedPoint.x, insetProjectedPoint.y]);
                return { lon: coordinates[0], lat: coordinates[1] };
            }
        }
        const coordinates = this.projection.inverse([point.x, point.y]);
        return { lon: coordinates[0], lat: coordinates[1] };
    }
    /**
     * Calculate and set the recommended map view based on provided map data
     * from series.
     *
     * @requires modules/map
     *
     * @function Highcharts.MapView#recommendMapView
     *
     * @since 11.4.0
     *
     * @param {Highcharts.Chart} chart
     *        Chart object
     *
     * @param {Array<MapDataType | undefined>} mapDataArray
     *        Array of map data from all series.
     *
     * @param {boolean} [update=false]
     *        Whether to update the chart with recommended map view.
     *
     * @return {Highcharts.MapViewOptions|undefined} Best suitable map view.
     */
    recommendMapView(chart, mapDataArray, update = false) {
        // Reset recommended map view
        this.recommendedMapView = {};
        // Handle the global map and series-level mapData
        const geoMaps = mapDataArray.map((mapData) => this.getGeoMap(mapData));
        const allGeoBounds = [];
        geoMaps.forEach((geoMap) => {
            if (geoMap) {
                // Use the first geo map as main
                if (!Object.keys(this.recommendedMapView).length) {
                    this.recommendedMapView =
                        geoMap['hc-recommended-mapview'] || {};
                }
                // Combine the bounding boxes of all loaded maps
                if (geoMap.bbox) {
                    const [x1, y1, x2, y2] = geoMap.bbox;
                    allGeoBounds.push({ x1, y1, x2, y2 });
                }
            }
        });
        // Get the composite bounds
        const geoBounds = (allGeoBounds.length &&
            MapView.compositeBounds(allGeoBounds));
        // Provide a best-guess recommended projection if not set in
        // the map or in user options
        fireEvent(this, 'onRecommendMapView', {
            geoBounds,
            chart
        }, function () {
            if (geoBounds &&
                this.recommendedMapView) {
                if (!this.recommendedMapView.projection) {
                    const { x1, y1, x2, y2 } = geoBounds;
                    this.recommendedMapView.projection =
                        (x2 - x1 > 180 && y2 - y1 > 90) ?
                            // Wide angle, go for the world view
                            {
                                name: 'EqualEarth',
                                parallels: [0, 0],
                                rotation: [0]
                            } :
                            // Narrower angle, use a projection better
                            // suited for local view
                            {
                                name: 'LambertConformalConic',
                                parallels: [y1, y2],
                                rotation: [-(x1 + x2) / 2]
                            };
                }
                if (!this.recommendedMapView.insets) {
                    this.recommendedMapView.insets = void 0; // Reset insets
                }
            }
        });
        // Register the main geo map (from options.chart.map) if set
        this.geoMap = geoMaps[0];
        if (update &&
            chart.hasRendered &&
            !chart.userOptions.mapView?.projection &&
            this.recommendedMapView) {
            this.update(this.recommendedMapView);
        }
    }
    redraw(animation) {
        this.chart.series.forEach((s) => {
            if (s.useMapGeometry) {
                s.isDirty = true;
            }
        });
        this.chart.redraw(animation);
    }
    /**
     * Set the view to given center and zoom values.
     * @function Highcharts.MapView#setView
     * @param {Highcharts.LonLatArray|undefined} center
     *        The center point
     * @param {number} zoom
     *        The zoom level
     * @param {boolean} [redraw=true]
     *        Whether to redraw immediately
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     *        Animation options for the redraw
     *
     * @sample maps/mapview/setview
     *        Set the view programmatically
     */
    setView(center, zoom, redraw = true, animation) {
        if (center) {
            this.center = center;
        }
        if (typeof zoom === 'number') {
            if (typeof this.minZoom === 'number') {
                zoom = Math.max(zoom, this.minZoom);
            }
            if (typeof this.options.maxZoom === 'number') {
                zoom = Math.min(zoom, this.options.maxZoom);
            }
            // Use isNumber to prevent Infinity (#17205)
            if (isNumber(zoom)) {
                this.zoom = zoom;
            }
        }
        const bounds = this.getProjectedBounds();
        if (bounds) {
            const projectedCenter = this.projection.forward(this.center), { x, y, width, height } = this.playingField, scale = this.getScale(), bottomLeft = this.projectedUnitsToPixels({
                x: bounds.x1,
                y: bounds.y1
            }), topRight = this.projectedUnitsToPixels({
                x: bounds.x2,
                y: bounds.y2
            }), boundsCenterProjected = [
                (bounds.x1 + bounds.x2) / 2,
                (bounds.y1 + bounds.y2) / 2
            ], isDrilling = this.chart.series.some((series) => series.isDrilling);
            if (!isDrilling) {
                // Constrain to data bounds
                // Pixel coordinate system is reversed vs projected
                const x1 = bottomLeft.x, y1 = topRight.y, x2 = topRight.x, y2 = bottomLeft.y;
                // Map smaller than plot area, center it
                if (x2 - x1 < width) {
                    projectedCenter[0] = boundsCenterProjected[0];
                    // Off west
                }
                else if (x1 < x && x2 < x + width) {
                    // Adjust eastwards
                    projectedCenter[0] +=
                        Math.max(x1 - x, x2 - width - x) / scale;
                    // Off east
                }
                else if (x2 > x + width && x1 > x) {
                    // Adjust westwards
                    projectedCenter[0] +=
                        Math.min(x2 - width - x, x1 - x) / scale;
                }
                // Map smaller than plot area, center it
                if (y2 - y1 < height) {
                    projectedCenter[1] = boundsCenterProjected[1];
                    // Off north
                }
                else if (y1 < y && y2 < y + height) {
                    // Adjust southwards
                    projectedCenter[1] -=
                        Math.max(y1 - y, y2 - height - y) / scale;
                    // Off south
                }
                else if (y2 > y + height && y1 > y) {
                    // Adjust northwards
                    projectedCenter[1] -=
                        Math.min(y2 - height - y, y1 - y) / scale;
                }
                this.center = this.projection.inverse(projectedCenter);
            }
            this.insets.forEach((inset) => {
                if (inset.options.field) {
                    inset.hitZone = inset.getHitZone();
                    inset.playingField = inset.getField();
                }
            });
            this.render();
        }
        fireEvent(this, 'afterSetView');
        if (redraw) {
            this.redraw(animation);
        }
    }
    /**
     * Convert projected units to pixel position
     *
     * @function Highcharts.MapView#projectedUnitsToPixels
     * @param {Highcharts.PositionObject} pos
     *        The position in projected units
     * @return {Highcharts.PositionObject} The position in pixels
     */
    projectedUnitsToPixels(pos) {
        const scale = this.getScale(), projectedCenter = this.projection.forward(this.center), field = this.playingField, centerPxX = field.x + field.width / 2, centerPxY = field.y + field.height / 2;
        const x = centerPxX - scale * (projectedCenter[0] - pos.x);
        const y = centerPxY + scale * (projectedCenter[1] - pos.y);
        return { x, y };
    }
    /**
     * Convert pixel position to longitude and latitude.
     *
     * @function Highcharts.MapView#pixelsToLonLat
     * @since 10.0.0
     * @param  {Highcharts.PositionObject} pos
     *         The position in pixels
     * @return {Highcharts.MapLonLatObject|undefined}
     *         The map coordinates
     */
    pixelsToLonLat(pos) {
        return this.projectedUnitsToLonLat(this.pixelsToProjectedUnits(pos));
    }
    /**
     * Convert pixel position to projected units
     *
     * @function Highcharts.MapView#pixelsToProjectedUnits
     * @param {Highcharts.PositionObject} pos
     *        The position in pixels
     * @return {Highcharts.PositionObject} The position in projected units
     */
    pixelsToProjectedUnits(pos) {
        const { x, y } = pos, scale = this.getScale(), projectedCenter = this.projection.forward(this.center), field = this.playingField, centerPxX = field.x + field.width / 2, centerPxY = field.y + field.height / 2;
        const projectedX = projectedCenter[0] + (x - centerPxX) / scale;
        const projectedY = projectedCenter[1] - (y - centerPxY) / scale;
        return { x: projectedX, y: projectedY };
    }
    setUpEvents() {
        const { chart } = this;
        // Set up panning and touch zoom for maps. In orthographic projections
        // the globe will rotate, otherwise adjust the map center and zoom.
        let mouseDownCenterProjected, mouseDownKey, mouseDownRotation;
        const onPan = (e) => {
            const { lastTouches, pinchDown } = chart.pointer, projection = this.projection, touches = e.touches;
            let { mouseDownX, mouseDownY } = chart, howMuch = 0;
            if (pinchDown?.length === 1) {
                mouseDownX = pinchDown[0].chartX;
                mouseDownY = pinchDown[0].chartY;
            }
            else if (pinchDown?.length === 2) {
                mouseDownX = (pinchDown[0].chartX + pinchDown[1].chartX) / 2;
                mouseDownY = (pinchDown[0].chartY + pinchDown[1].chartY) / 2;
            }
            // How much has the distance between the fingers changed?
            if (touches?.length === 2 && lastTouches) {
                const startDistance = Math.sqrt(Math.pow(lastTouches[0].chartX - lastTouches[1].chartX, 2) +
                    Math.pow(lastTouches[0].chartY - lastTouches[1].chartY, 2)), endDistance = Math.sqrt(Math.pow(touches[0].chartX - touches[1].chartX, 2) +
                    Math.pow(touches[0].chartY - touches[1].chartY, 2));
                howMuch = Math.log(startDistance / endDistance) / Math.log(0.5);
            }
            if (isNumber(mouseDownX) && isNumber(mouseDownY)) {
                const key = `${mouseDownX},${mouseDownY}`;
                let { chartX, chartY } = e.originalEvent;
                if (touches?.length === 2) {
                    chartX = (touches[0].chartX + touches[1].chartX) / 2;
                    chartY = (touches[0].chartY + touches[1].chartY) / 2;
                }
                // Reset starting position
                if (key !== mouseDownKey) {
                    mouseDownKey = key;
                    mouseDownCenterProjected = this.projection
                        .forward(this.center);
                    mouseDownRotation = (this.projection.options.rotation || [0, 0]).slice();
                }
                // Get the natural zoom level of the projection itself when
                // zoomed to view the full world
                const worldBounds = projection.def && projection.def.bounds, worldZoom = (worldBounds &&
                    zoomFromBounds(worldBounds, this.playingField)) || -Infinity;
                // Panning rotates the globe
                if (projection.options.name === 'Orthographic' &&
                    (touches?.length || 0) < 2 &&
                    // ... but don't rotate if we're loading only a part of the
                    // world
                    (this.minZoom || Infinity) < worldZoom * 1.3) {
                    // Empirical ratio where the globe rotates roughly the same
                    // speed as moving the pointer across the center of the
                    // projection
                    const ratio = 440 / (this.getScale() * Math.min(chart.plotWidth, chart.plotHeight));
                    if (mouseDownRotation) {
                        const lon = (mouseDownX - chartX) * ratio -
                            mouseDownRotation[0], lat = clamp(-mouseDownRotation[1] -
                            (mouseDownY - chartY) * ratio, -80, 80), zoom = this.zoom;
                        this.update({
                            projection: {
                                rotation: [-lon, -lat]
                            }
                        }, false);
                        this.fitToBounds(void 0, void 0, false);
                        this.zoom = zoom;
                        chart.redraw(false);
                    }
                    // #17925 Skip NaN values
                }
                else if (isNumber(chartX) && isNumber(chartY)) {
                    // #17238
                    const scale = this.getScale(), flipFactor = this.projection.hasCoordinates ? 1 : -1;
                    const newCenter = this.projection.inverse([
                        mouseDownCenterProjected[0] +
                            (mouseDownX - chartX) / scale,
                        mouseDownCenterProjected[1] -
                            (mouseDownY - chartY) / scale * flipFactor
                    ]);
                    // #19190 Skip NaN coords
                    if (!isNaN(newCenter[0] + newCenter[1])) {
                        this.zoomBy(howMuch, newCenter, void 0, false);
                    }
                }
                e.preventDefault();
            }
        };
        addEvent(chart, 'pan', onPan);
        addEvent(chart, 'touchpan', onPan);
        // Perform the map zoom by selection
        addEvent(chart, 'selection', (evt) => {
            // Zoom in
            if (!evt.resetSelection) {
                const x = evt.x - chart.plotLeft;
                const y = evt.y - chart.plotTop;
                const { y: y1, x: x1 } = this.pixelsToProjectedUnits({ x, y });
                const { y: y2, x: x2 } = this.pixelsToProjectedUnits({ x: x + evt.width, y: y + evt.height });
                this.fitToBounds({ x1, y1, x2, y2 }, void 0, true, evt.originalEvent.touches ?
                    // On touch zoom, don't animate, since we're already in
                    // transformed zoom preview
                    false :
                    // On mouse zoom, obey the chart-level animation
                    void 0);
                // Only for mouse. Touch users can pinch out.
                if (!/^touch/.test((evt.originalEvent.type))) {
                    chart.showResetZoom();
                }
                evt.preventDefault();
                // Reset zoom
            }
            else {
                this.zoomBy();
            }
        });
    }
    render() {
        // We need a group for the insets
        if (!this.group) {
            this.group = this.chart.renderer.g('map-view')
                .attr({ zIndex: 4 })
                .add();
        }
    }
    /**
     * Update the view with given options
     *
     * @function Highcharts.MapView#update
     *
     * @param {Partial<Highcharts.MapViewOptions>} options
     *        The new map view options to apply
     * @param {boolean} [redraw=true]
     *        Whether to redraw immediately
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     *        The animation to apply to a the redraw
     */
    update(options, redraw = true, animation) {
        const newProjection = options.projection, isDirtyProjection = newProjection && ((Projection.toString(newProjection) !==
            Projection.toString(this.options.projection)));
        let isDirtyInsets = false;
        merge(true, this.userOptions, options);
        merge(true, this.options, options);
        // If anything changed with the insets, destroy them all and create
        // again below
        if ('insets' in options) {
            this.insets.forEach((inset) => inset.destroy());
            this.insets.length = 0;
            isDirtyInsets = true;
        }
        if (isDirtyProjection || 'fitToGeometry' in options) {
            delete this.fitToGeometryCache;
        }
        if (isDirtyProjection || isDirtyInsets) {
            this.chart.series.forEach((series) => {
                const groups = series.transformGroups;
                if (series.clearBounds) {
                    series.clearBounds();
                }
                series.isDirty = true;
                series.isDirtyData = true;
                // Destroy inset transform groups
                if (isDirtyInsets && groups) {
                    while (groups.length > 1) {
                        const group = groups.pop();
                        if (group) {
                            group.destroy();
                        }
                    }
                }
            });
            if (isDirtyProjection) {
                this.projection = new Projection(this.options.projection);
            }
            // Create new insets
            if (isDirtyInsets) {
                this.createInsets();
            }
            // Fit to natural bounds if center/zoom are not explicitly given
            if (!options.center &&
                // Do not fire fitToBounds if user don't want to set zoom
                Object.hasOwnProperty.call(options, 'zoom') &&
                !isNumber(options.zoom)) {
                this.fitToBounds(void 0, void 0, false);
            }
        }
        if (options.center || isNumber(options.zoom)) {
            this.setView(this.options.center, options.zoom, false);
        }
        else if ('fitToGeometry' in options) {
            this.fitToBounds(void 0, void 0, false);
        }
        if (redraw) {
            this.chart.redraw(animation);
        }
    }
    /**
     * Zoom the map view by a given number
     *
     * @function Highcharts.MapView#zoomBy
     *
     * @param {number|undefined} [howMuch]
     *        The amount of zoom to apply. 1 zooms in on half the current view,
     *        -1 zooms out. Pass `undefined` to zoom to the full bounds of the
     *        map.
     * @param {Highcharts.LonLatArray} [coords]
     *        Optional map coordinates to keep fixed
     * @param {Array<number>} [chartCoords]
     *        Optional chart coordinates to keep fixed, in pixels
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     *        The animation to apply to a the redraw
     */
    zoomBy(howMuch, coords, chartCoords, animation) {
        const chart = this.chart, projectedCenter = this.projection.forward(this.center);
        if (typeof howMuch === 'number') {
            const zoom = this.zoom + howMuch;
            let center, x, y;
            // Keep chartX and chartY stationary - convert to lat and lng
            if (chartCoords) {
                const [chartX, chartY] = chartCoords;
                const scale = this.getScale();
                const offsetX = chartX - chart.plotLeft - chart.plotWidth / 2;
                const offsetY = chartY - chart.plotTop - chart.plotHeight / 2;
                x = projectedCenter[0] + offsetX / scale;
                y = projectedCenter[1] + offsetY / scale;
            }
            // Keep lon and lat stationary by adjusting the center
            if (typeof x === 'number' && typeof y === 'number') {
                const scale = 1 - Math.pow(2, this.zoom) / Math.pow(2, zoom);
                const offsetX = projectedCenter[0] - x;
                const offsetY = projectedCenter[1] - y;
                projectedCenter[0] -= offsetX * scale;
                projectedCenter[1] += offsetY * scale;
                center = this.projection.inverse(projectedCenter);
            }
            this.setView(coords || center, zoom, void 0, animation);
            // Undefined howMuch => reset zoom
        }
        else {
            this.fitToBounds(void 0, void 0, void 0, animation);
        }
    }
}
// Putting this in the same file due to circular dependency with MapView
class MapViewInset extends MapView {
    /* *
     *
     *  Constructor
     *
     * */
    constructor(mapView, options) {
        super(mapView.chart, options);
        this.id = options.id;
        this.mapView = mapView;
        this.options = merge({ center: [0, 0] }, mapView.options.insetOptions, options);
        this.allBounds = [];
        if (this.options.geoBounds) {
            // The path in projected units in the map view's main projection.
            // This is used for hit testing where the points should render.
            const path = mapView.projection.path(this.options.geoBounds);
            this.geoBoundsProjectedBox = boundsFromPath(path);
            this.geoBoundsProjectedPolygon = path.map((segment) => [
                segment[1] || 0,
                segment[2] || 0
            ]);
        }
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Get the playing field in pixels
     * @private
     */
    getField(padded = true) {
        const hitZone = this.hitZone;
        if (hitZone) {
            const padding = padded ? this.padding : [0, 0, 0, 0], polygon = hitZone.coordinates[0], xs = polygon.map((xy) => xy[0]), ys = polygon.map((xy) => xy[1]), x = Math.min.apply(0, xs) + padding[3], x2 = Math.max.apply(0, xs) - padding[1], y = Math.min.apply(0, ys) + padding[0], y2 = Math.max.apply(0, ys) - padding[2];
            if (isNumber(x) && isNumber(y)) {
                return {
                    x,
                    y,
                    width: x2 - x,
                    height: y2 - y
                };
            }
        }
        // Fall back to plot area
        return super.getField.call(this, padded);
    }
    /**
     * Get the hit zone in pixels.
     * @private
     */
    getHitZone() {
        const { chart, mapView, options } = this, { coordinates } = options.field || {};
        if (coordinates) {
            let polygon = coordinates[0];
            if (options.units === 'percent') {
                const relativeTo = options.relativeTo === 'mapBoundingBox' &&
                    mapView.getMapBBox() ||
                    merge(chart.plotBox, { x: 0, y: 0 });
                polygon = polygon.map((xy) => [
                    relativeLength(`${xy[0]}%`, relativeTo.width, relativeTo.x),
                    relativeLength(`${xy[1]}%`, relativeTo.height, relativeTo.y)
                ]);
            }
            return {
                type: 'Polygon',
                coordinates: [polygon]
            };
        }
    }
    getProjectedBounds() {
        return MapView.compositeBounds(this.allBounds);
    }
    /**
     * Determine whether a point on the main projected plane is inside the
     * geoBounds of the inset.
     * @private
     */
    isInside(point) {
        const { geoBoundsProjectedBox, geoBoundsProjectedPolygon } = this;
        return Boolean(
        // First we do a pre-pass to check whether the test point is inside
        // the rectangular bounding box of the polygon. This is less
        // expensive and will rule out most cases.
        geoBoundsProjectedBox &&
            point.x >= geoBoundsProjectedBox.x1 &&
            point.x <= geoBoundsProjectedBox.x2 &&
            point.y >= geoBoundsProjectedBox.y1 &&
            point.y <= geoBoundsProjectedBox.y2 &&
            // Next, do the more expensive check whether the point is inside the
            // polygon itself.
            geoBoundsProjectedPolygon &&
            pointInPolygon(point, geoBoundsProjectedPolygon));
    }
    /**
     * Render the map view inset with the border path
     * @private
     */
    render() {
        const { chart, mapView, options } = this, borderPath = options.borderPath || options.field;
        if (borderPath && mapView.group) {
            let animate = true;
            if (!this.border) {
                this.border = chart.renderer
                    .path()
                    .addClass('highcharts-mapview-inset-border')
                    .add(mapView.group);
                animate = false;
            }
            if (!chart.styledMode) {
                this.border.attr({
                    stroke: options.borderColor,
                    'stroke-width': options.borderWidth
                });
            }
            const strokeWidth = this.border.strokeWidth(), field = (options.relativeTo === 'mapBoundingBox' &&
                mapView.getMapBBox()) || mapView.playingField;
            const d = (borderPath.coordinates || []).reduce((d, lineString) => lineString.reduce((d, point, i) => {
                let [x, y] = point;
                if (options.units === 'percent') {
                    x = chart.plotLeft + relativeLength(`${x}%`, field.width, field.x);
                    y = chart.plotTop + relativeLength(`${y}%`, field.height, field.y);
                }
                x = crisp(x, strokeWidth);
                y = crisp(y, strokeWidth);
                d.push(i === 0 ? ['M', x, y] : ['L', x, y]);
                return d;
            }, d), []);
            // Apply the border path
            this.border[animate ? 'animate' : 'attr']({ d });
        }
    }
    destroy() {
        if (this.border) {
            this.border = this.border.destroy();
        }
        this.eventsToUnbind.forEach((f) => f());
    }
    /**
     * No chart-level events for insets
     * @private
     */
    setUpEvents() { }
}
/* *
 *
 *  Default Export
 *
 * */
export default MapView;
