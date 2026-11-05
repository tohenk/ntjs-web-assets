import * as utils from './utils.js';
import Bosh from './transports/bosh.js';
import Builder, { $build, $msg, $pres, $iq } from './builder.js';
import Connection from './connection.js';
import Handler from './handler.js';
import Request from './request.js';
import SASLAnonymous from './sasl-anon.js';
import SASLExternal from './sasl-external.js';
import SASLMechanism from './sasl.js';
import SASLOAuthBearer from './sasl-oauthbearer.js';
import SASLPlain from './sasl-plain.js';
import SASLSHA1 from './sasl-sha1.js';
import SASLSHA256 from './sasl-sha256.js';
import SASLSHA384 from './sasl-sha384.js';
import SASLSHA512 from './sasl-sha512.js';
import SASLXOAuth2 from './sasl-xoauth2.js';
import StreamManagement, { MemoryStorageBackend, SessionStorageBackend, StreamManagementMirror } from './stream-management/index.js';
import TimedHandler from './timed-handler.js';
import Websocket from './transports/websocket.js';
import WorkerWebsocket from './transports/worker-websocket.js';
import log from './log.js';
import { ElementType, ErrorCondition, LOG_LEVELS, NS, Status, XHTML } from './constants.js';
import { stx, Stanza } from './stanza.js';
const Strophe = Object.assign(Object.assign(Object.assign({ VERSION: '6.0.0', get TIMEOUT() {
        return Bosh.getTimeoutMultplier();
    },
    set TIMEOUT(n) {
        Bosh.setTimeoutMultiplier(n);
    },
    get SECONDARY_TIMEOUT() {
        return Bosh.getSecondaryTimeoutMultplier();
    },
    set SECONDARY_TIMEOUT(n) {
        Bosh.setSecondaryTimeoutMultiplier(n);
    } }, utils), log), { Request,
    Bosh,
    Websocket,
    WorkerWebsocket,
    Connection,
    Handler,
    SASLAnonymous,
    SASLPlain,
    SASLSHA1,
    SASLSHA256,
    SASLSHA384,
    SASLSHA512,
    SASLOAuthBearer,
    SASLExternal,
    SASLXOAuth2,
    Stanza,
    StreamManagement,
    MemoryStorageBackend,
    SessionStorageBackend,
    Builder,
    ElementType,
    ErrorCondition, LogLevel: LOG_LEVELS, NS,
    SASLMechanism,
    Status,
    TimedHandler, XHTML: Object.assign(Object.assign({}, XHTML), { validTag: utils.validTag, validCSS: utils.validCSS, validAttribute: utils.validAttribute }), serialize(elem) {
        return Builder.serialize(elem);
    },
    setLogLevel(level) {
        log.setLogLevel(level);
    },
    addNamespace(name, value) {
        Strophe.NS[name] = value;
    },
    addConnectionPlugin(name, ptype) {
        Connection.addConnectionPlugin(name, ptype);
    } });
globalThis.$build = $build;
globalThis.$iq = $iq;
globalThis.$msg = $msg;
globalThis.$pres = $pres;
globalThis.Strophe = Strophe;
globalThis.stx = stx;
const toStanza = Stanza.toElement;
globalThis.toStanza = Stanza.toElement;
export { Builder, $build, $iq, $msg, $pres, Strophe, Stanza, stx, toStanza, Request, StreamManagement, StreamManagementMirror, MemoryStorageBackend, SessionStorageBackend, };
