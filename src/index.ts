import * as socket from 'socket.io';

import { serveOnSocketIo } from './debugger/KaracaOSDebugger';

const io = socket(5000);

io.on('connection', serveOnSocketIo());
