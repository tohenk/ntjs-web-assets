import type Connection from './connection.js';
import SASLMechanism from './sasl.js';
declare class SASLOAuthBearer extends SASLMechanism {
    constructor(mechname?: string, isClientFirst?: boolean, priority?: number);
    test(connection: Connection): boolean;
    onChallenge(connection: Connection): string;
}
export default SASLOAuthBearer;
//# sourceMappingURL=sasl-oauthbearer.d.ts.map