"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class BufferUntilReadable extends events_1.EventEmitter {
    constructor(readable, bufferUntil, bufferSize = 1024) {
        super();
        this.readable = readable;
        this.buffer = Buffer.alloc(bufferSize, 0);
        let offset = 0;
        this.readable.on('data', (data) => {
            const elements = data.split(bufferUntil);
            if (elements.length === 1) {
                offset += this.buffer.write(data, offset);
            }
            else {
                elements.forEach(text => {
                    offset += this.buffer.write(text, offset);
                    this.emit('data', this.buffer.toString('utf-8', 0, offset));
                    offset = 0;
                });
            }
        });
    }
}
exports.default = BufferUntilReadable;
//# sourceMappingURL=BufferUntilReadable.js.map