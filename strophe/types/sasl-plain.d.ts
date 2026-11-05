import type Connection from './connection.js';
import SASLMechanism from './sasl.js';
declare class SASLPlain extends SASLMechanism {
    constructor(mechname?: string, isClientFirst?: boolean, priority?: number);
    test(connection: Connection): boolean;
    onChallenge(connection: Connection): string;
}
export default SASLPlain;
//# sourceMappingURL=sasl-plain.d.ts.map