import type Connection from './connection.js';
import SASLMechanism from './sasl.js';
declare class SASLExternal extends SASLMechanism {
    constructor(mechname?: string, isClientFirst?: boolean, priority?: number);
    onChallenge(connection: Connection): string;
}
export default SASLExternal;
//# sourceMappingURL=sasl-external.d.ts.map