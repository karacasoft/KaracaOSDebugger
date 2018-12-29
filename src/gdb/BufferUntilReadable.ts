import * as stream from 'stream';
import { EventEmitter } from 'events';

class BufferUntilReadable extends EventEmitter {
  private readable: stream.Readable;

  private buffer: Buffer;

  constructor(readable: stream.Readable, bufferUntil: string, bufferSize: number=1024 * 100) {
    super();
    this.readable = readable;

    this.buffer = Buffer.alloc(bufferSize, 0);
    let offset = 0;

    this.readable.on('data', (data: string) => {
      const elements: string[] = data.split(bufferUntil);
      if(elements.length === 1) {
        offset += this.buffer.write(data, offset);
      } else {
        elements.forEach(text => {
          offset += this.buffer.write(text, offset);
          this.emit('data', this.buffer.toString('utf-8', 0, offset));
          offset = 0;
        });
      }
    });
  }

}

export default BufferUntilReadable;
