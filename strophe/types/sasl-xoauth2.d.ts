import type Connection from './connection.js';
import SASLMechanism from './sasl.js';
declare class SASLXOAuth2 extends SASLMechanism {
    constructor(mechname?: string, isClientFirst?: boolean, priority?: number);
    test(connection: Connection): boolean;
    onChallenge(connection: Connection): string;
}
export default SASLXOAuth2;
//# sourceMappingURL=sasl-xoauth2.d.ts.map