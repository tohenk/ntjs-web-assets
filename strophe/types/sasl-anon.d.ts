import type Connection from './connection.js';
import SASLMechanism from './sasl.js';
declare class SASLAnonymous extends SASLMechanism {
    constructor(mechname?: string, isClientFirst?: boolean, priority?: number);
    test(connection: Connection): boolean;
}
export default SASLAnonymous;
//# sourceMappingURL=sasl-anon.d.ts.map