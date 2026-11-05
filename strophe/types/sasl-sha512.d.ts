import type Connection from './connection.js';
import SASLMechanism from './sasl.js';
declare class SASLSHA512 extends SASLMechanism {
    constructor(mechname?: string, isClientFirst?: boolean, priority?: number);
    test(connection: Connection): boolean;
    onChallenge(connection: Connection, challenge?: string): Promise<string | false>;
    clientChallenge(connection: Connection, test_cnonce?: string): string;
}
export default SASLSHA512;
//# sourceMappingURL=sasl-sha512.d.ts.map