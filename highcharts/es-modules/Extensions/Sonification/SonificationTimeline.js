/* *
 *
 *  (c) 2009-2025 Øystein Moseng
 *
 *  Class representing a Timeline with sonification events to play.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import TimelineChannel from './TimelineChannel.js';
import toMIDI from './MIDI.js';
import DU from '../DownloadURL.js';
const { downloadURL } = DU;
import U from '../../Core/Utilities.js';
const { defined, find, merge } = U;
/**
 * Get filtered channels. Timestamps are compensated, so that the first
 * event starts immediately.
 * @private
 */
function filterChannels(filter, channels) {
    const filtered = channels.map((channel) => {
        channel.cancel();
        return {
            channel,
            filteredEvents: channel.muted ?
                [] : channel.events.filter(filter)
        };
    }), minTime = filtered.reduce((acc, cur) => Math.min(acc, cur.filteredEvents.length ?
        cur.filteredEvents[0].time : Infinity), Infinity);
    return filtered.map((c) => (new TimelineChannel(c.channel.type, c.channel.engine, c.channel.showPlayMarker, c.filteredEvents.map((e) => merge(e, { time: e.time - minTime })), c.channel.muted)));
}
/**
 * The SonificationTimeline class. This class represents a timeline of
 * audio events scheduled to play. It provides functionality for manipulating
 * and navigating the timeline.
 * @private
 */
class SonificationTimeline {
    constructor(options, chart) {
        this.chart = chart;
        this.isPaused = false;
        this.isPlaying = false;
        this.channels = [];
        this.scheduledCallbacks = [];
        this.playTimestamp = 0;
        this.resumeFromTime = 0;
        this.options = options || {};
    }
    // Add a channel, optionally with events, to be played.
    // Note: Only one speech channel is supported at a time.
    addChannel(type, engine, showPlayMarker = false, events) {
        if (type === 'instrument' &&
            !engine.scheduleEventAtTime ||
            type === 'speech' &&
                !engine.sayAtTime) {
            throw new Error('Highcharts Sonification: Invalid channel engine.');
        }
        const channel = new TimelineChannel(type, engine, showPlayMarker, events);
        this.channels.push(channel);
        return channel;
    }
    // Play timeline, optionally filtering out only some of the events to play.
    // Note that if not all instrument parameters are updated on each event,
    // parameters may update differently depending on the events filtered out,
    // since some of the events that update parameters can be filtered out too.
    // The filterPersists argument determines whether or not the filter persists
    // after e.g. pausing and resuming. Usually this should be true.
    play(filter, filterPersists = true, resetAfter = true, onEnd) {
        if (this.isPlaying) {
            this.cancel();
        }
        else {
            this.clearScheduledCallbacks();
        }
        this.onEndArgument = onEnd;
        this.playTimestamp = Date.now();
        this.resumeFromTime = 0;
        this.isPaused = false;
        this.isPlaying = true;
        const skipThreshold = this.options.skipThreshold || 2, onPlay = this.options.onPlay, showTooltip = this.options.showTooltip, showCrosshair = this.options.showCrosshair, channels = filter ?
            filterChannels(filter, this.playingChannels || this.channels) :
            this.channels, getEventKeysSignature = (e) => Object.keys(e.speechOptions || {})
            .concat(Object.keys(e.instrumentEventOptions || {}))
            .join(), pointsPlayed = [];
        if (filterPersists) {
            this.playingChannels = channels;
        }
        if (onPlay) {
            onPlay({ chart: this.chart, timeline: this });
        }
        let maxTime = 0;
        channels.forEach((channel) => {
            if (channel.muted) {
                return;
            }
            const numEvents = channel.events.length;
            let lastCallbackTime = -Infinity, lastEventTime = -Infinity, lastEventKeys = '';
            maxTime = Math.max(channel.events[numEvents - 1] &&
                channel.events[numEvents - 1].time || 0, maxTime);
            for (let i = 0; i < numEvents; ++i) {
                const e = channel.events[i], keysSig = getEventKeysSignature(e);
                // Optimize by skipping extremely close events (<2ms apart by
                // default), as long as they don't introduce new event options
                if (keysSig === lastEventKeys &&
                    e.time - lastEventTime < skipThreshold) {
                    continue;
                }
                lastEventKeys = keysSig;
                lastEventTime = e.time;
                if (channel.type === 'instrument') {
                    channel.engine
                        .scheduleEventAtTime(e.time / 1000, e.instrumentEventOptions || {});
                }
                else {
                    channel.engine.sayAtTime(e.time, e.message || '', e.speechOptions || {});
                }
                const point = e.relatedPoint, chart = point && point.series && point.series.chart, needsCallback = e.callback ||
                    point && (showTooltip || showCrosshair) &&
                        channel.showPlayMarker !== false &&
                        (e.time - lastCallbackTime > 50 || i === numEvents - 1);
                if (point) {
                    pointsPlayed.push(point);
                }
                if (needsCallback) {
                    this.scheduledCallbacks.push(setTimeout(() => {
                        if (e.callback) {
                            e.callback();
                        }
                        if (point) {
                            if (showCrosshair) {
                                const s = point.series;
                                if (s && s.xAxis && s.xAxis.crosshair) {
                                    s.xAxis.drawCrosshair(void 0, point);
                                }
                                if (s && s.yAxis && s.yAxis.crosshair) {
                                    s.yAxis.drawCrosshair(void 0, point);
                                }
                            }
                            if (showTooltip && !(
                            // Don't re-hover if shared tooltip
                            chart && chart.hoverPoints &&
                                chart.hoverPoints.length > 1 &&
                                find(chart.hoverPoints, (p) => p === point) &&
                                // Stock issue w/Navigator
                                point.onMouseOver)) {
                                point.onMouseOver();
                            }
                        }
                    }, e.time));
                    lastCallbackTime = e.time;
                }
            }
        });
        const onEndOpt = this.options.onEnd, onStop = this.options.onStop;
        this.scheduledCallbacks.push(setTimeout(() => {
            const chart = this.chart, context = { chart, timeline: this, pointsPlayed };
            this.isPlaying = false;
            if (resetAfter) {
                this.resetPlayState();
            }
            if (onStop) {
                onStop(context);
            }
            if (onEndOpt) {
                onEndOpt(context);
            }
            if (onEnd) {
                onEnd(context);
            }
            if (chart) {
                if (chart.tooltip) {
                    chart.tooltip.hide(0);
                }
                if (chart.hoverSeries) {
                    chart.hoverSeries.onMouseOut();
                }
                chart.axes.forEach((a) => a.hideCrosshair());
            }
        }, maxTime + 250));
        this.resumeFromTime = filterPersists ? maxTime : this.getLength();
    }
    // Pause for later resuming. Returns current timestamp to resume from.
    pause() {
        this.isPaused = true;
        this.cancel();
        this.resumeFromTime = Date.now() - this.playTimestamp - 10;
        return this.resumeFromTime;
    }
    // Get current time
    getCurrentTime() {
        return this.isPlaying ?
            Date.now() - this.playTimestamp :
            this.resumeFromTime;
    }
    // Get length of timeline in milliseconds
    getLength() {
        return this.channels.reduce((maxTime, channel) => {
            const lastEvent = channel.events[channel.events.length - 1];
            return lastEvent ? Math.max(lastEvent.time, maxTime) : maxTime;
        }, 0);
    }
    // Resume from paused
    resume() {
        if (this.playingChannels) {
            const resumeFrom = this.resumeFromTime - 50;
            this.play((e) => e.time > resumeFrom, false, false, this.onEndArgument);
            this.playTimestamp -= resumeFrom;
        }
        else {
            this.play(void 0, false, false, this.onEndArgument);
        }
    }
    // Play a short moment, then pause, setting the cursor to the final
    // event's time.
    anchorPlayMoment(eventFilter, onEnd) {
        if (this.isPlaying) {
            this.pause();
        }
        let finalEventTime = 0;
        this.play((e, ix, arr) => {
            // We have to keep track of final event time ourselves, since
            // play() messes with the time internally upon filtering.
            const res = eventFilter(e, ix, arr);
            if (res && e.time > finalEventTime) {
                finalEventTime = e.time;
            }
            return res;
        }, false, false, onEnd);
        this.playingChannels = this.playingChannels || this.channels;
        this.isPaused = true;
        this.isPlaying = false;
        this.resumeFromTime = finalEventTime;
    }
    // Play event(s) occurring next/prev from paused state.
    playAdjacent(next, onEnd, onBoundaryHit, eventFilter) {
        if (this.isPlaying) {
            this.pause();
        }
        const fromTime = this.resumeFromTime, closestTime = this.channels.reduce((time, channel) => {
            // Adapted binary search since events are sorted by time
            const events = eventFilter ?
                channel.events.filter(eventFilter) : channel.events;
            let s = 0, e = events.length, lastValidTime = time;
            while (s < e) {
                const mid = (s + e) >> 1, t = events[mid].time, cmp = t - fromTime;
                if (cmp > 0) { // Ahead
                    if (next && t < lastValidTime) {
                        lastValidTime = t;
                    }
                    e = mid;
                }
                else if (cmp < 0) { // Behind
                    if (!next && t > lastValidTime) {
                        lastValidTime = t;
                    }
                    s = mid + 1;
                }
                else { // Same as from time
                    if (next) {
                        s = mid + 1;
                    }
                    else {
                        e = mid;
                    }
                }
            }
            return lastValidTime;
        }, next ? Infinity : -Infinity), margin = 0.02;
        if (closestTime === Infinity || closestTime === -Infinity) {
            if (onBoundaryHit) {
                onBoundaryHit({
                    chart: this.chart, timeline: this, attemptedNext: next
                });
            }
            return;
        }
        this.anchorPlayMoment((e, ix, arr) => {
            const withinTime = next ?
                e.time > fromTime && e.time <= closestTime + margin :
                e.time < fromTime && e.time >= closestTime - margin;
            return eventFilter ? withinTime && eventFilter(e, ix, arr) :
                withinTime;
        }, onEnd);
    }
    // Play event with related point, where the value of a prop on the
    // related point is closest to a target value.
    // Note: not very efficient.
    playClosestToPropValue(prop, targetVal, onEnd, onBoundaryHit, eventFilter) {
        const filter = (e, ix, arr) => !!(eventFilter ?
            eventFilter(e, ix, arr) && e.relatedPoint :
            e.relatedPoint);
        let closestValDiff = Infinity, closestEvent = null;
        (this.playingChannels || this.channels).forEach((channel) => {
            const events = channel.events;
            let i = events.length;
            while (i--) {
                if (!filter(events[i], i, events)) {
                    continue;
                }
                const val = events[i].relatedPoint[prop], diff = defined(val) && Math.abs(targetVal - val);
                if (diff !== false && diff < closestValDiff) {
                    closestValDiff = diff;
                    closestEvent = events[i];
                }
            }
        });
        if (closestEvent) {
            this.play((e) => !!(closestEvent &&
                e.time < closestEvent.time + 1 &&
                e.time > closestEvent.time - 1 &&
                e.relatedPoint === closestEvent.relatedPoint), false, false, onEnd);
            this.playingChannels = this.playingChannels || this.channels;
            this.isPaused = true;
            this.isPlaying = false;
            this.resumeFromTime = closestEvent.time;
        }
        else if (onBoundaryHit) {
            onBoundaryHit({ chart: this.chart, timeline: this });
        }
    }
    // Get timeline events that are related to a certain point.
    // Note: Point grouping may cause some points not to have a
    //  related point in the timeline.
    getEventsForPoint(point) {
        return this.channels.reduce((events, channel) => {
            const pointEvents = channel.events
                .filter((e) => e.relatedPoint === point);
            return events.concat(pointEvents);
        }, []);
    }
    // Divide timeline into 100 parts of equal time, and play one of them.
    // Used for scrubbing.
    // Note: Should be optimized?
    playSegment(segment, onEnd) {
        const numSegments = 100;
        const eventTimes = {
            first: Infinity,
            last: -Infinity
        };
        this.channels.forEach((c) => {
            if (c.events.length) {
                eventTimes.first = Math.min(c.events[0].time, eventTimes.first);
                eventTimes.last = Math.max(c.events[c.events.length - 1].time, eventTimes.last);
            }
        });
        if (eventTimes.first < Infinity) {
            const segmentSize = (eventTimes.last - eventTimes.first) / numSegments, fromTime = eventTimes.first + segment * segmentSize, toTime = fromTime + segmentSize;
            // Binary search, do we have any events within time range?
            if (!this.channels.some((c) => {
                const events = c.events;
                let s = 0, e = events.length;
                while (s < e) {
                    const mid = (s + e) >> 1, t = events[mid].time;
                    if (t < fromTime) { // Behind
                        s = mid + 1;
                    }
                    else if (t > toTime) { // Ahead
                        e = mid;
                    }
                    else {
                        return true;
                    }
                }
                return false;
            })) {
                return; // If not, don't play - avoid cancelling current play
            }
            this.play((e) => e.time >= fromTime && e.time <= toTime, false, false, onEnd);
            this.playingChannels = this.playingChannels || this.channels;
            this.isPaused = true;
            this.isPlaying = false;
            this.resumeFromTime = toTime;
        }
    }
    // Get last played / current point
    // Since events are scheduled we can't just store points as we play them
    getLastPlayedPoint(filter) {
        const curTime = this.getCurrentTime(), channels = this.playingChannels || this.channels;
        let closestDiff = Infinity, closestPoint = null;
        channels.forEach((c) => {
            const events = c.events.filter((e, ix, arr) => !!(e.relatedPoint && e.time <= curTime &&
                (!filter || filter(e, ix, arr)))), closestEvent = events[events.length - 1];
            if (closestEvent) {
                const closestTime = closestEvent.time, diff = Math.abs(closestTime - curTime);
                if (diff < closestDiff) {
                    closestDiff = diff;
                    closestPoint = closestEvent.relatedPoint;
                }
            }
        });
        return closestPoint;
    }
    // Reset play/pause state so that a later call to resume() will start over
    reset() {
        if (this.isPlaying) {
            this.cancel();
        }
        this.resetPlayState();
    }
    cancel() {
        const onStop = this.options.onStop;
        if (onStop) {
            onStop({ chart: this.chart, timeline: this });
        }
        this.isPlaying = false;
        this.channels.forEach((c) => c.cancel());
        if (this.playingChannels && this.playingChannels !== this.channels) {
            this.playingChannels.forEach((c) => c.cancel());
        }
        this.clearScheduledCallbacks();
        this.resumeFromTime = 0;
    }
    destroy() {
        this.cancel();
        if (this.playingChannels && this.playingChannels !== this.channels) {
            this.playingChannels.forEach((c) => c.destroy());
        }
        this.channels.forEach((c) => c.destroy());
    }
    setMasterVolume(vol) {
        this.channels.forEach((c) => c.engine.setMasterVolume(vol));
    }
    getMIDIData() {
        return toMIDI(this.channels.filter((c) => c.type === 'instrument'));
    }
    downloadMIDI(filename) {
        const data = this.getMIDIData(), name = (filename ||
            this.chart &&
                this.chart.options.title &&
                this.chart.options.title.text ||
            'chart') + '.mid', blob = new Blob([data], { type: 'application/octet-stream' }), url = window.URL.createObjectURL(blob);
        downloadURL(url, name);
        window.URL.revokeObjectURL(url);
    }
    resetPlayState() {
        delete this.playingChannels;
        delete this.onEndArgument;
        this.playTimestamp = this.resumeFromTime = 0;
        this.isPaused = false;
    }
    clearScheduledCallbacks() {
        this.scheduledCallbacks.forEach(clearTimeout);
        this.scheduledCallbacks = [];
    }
}
/* *
 *
 *  Default Export
 *
 * */
export default SonificationTimeline;
/* *
 *
 *  API declarations
 *
 * */
/**
 * Filter callback for filtering timeline events on a SonificationTimeline.
 *
 * @callback Highcharts.SonificationTimelineFilterCallback
 *
 * @param {Highcharts.SonificationTimelineEvent} e TimelineEvent being filtered
 *
 * @param {number} ix Index of TimelineEvent in current event array
 *
 * @param {Array<Highcharts.SonificationTimelineEvent>} arr The current event array
 *
 * @return {boolean}
 * The function should return true if the TimelineEvent should be included,
 * false otherwise.
 */
(''); // Keep above doclets in JS file
