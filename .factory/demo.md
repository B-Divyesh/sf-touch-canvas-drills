# Demo sandbox

Open `/?demo=1`, use its `/demo` alias, or select **Try it with sample data**. The demo starts on the
"Rail lines" drill with the first completed sample already drawn on the visible
canvas and ready to replay. It also includes two completed, replayable saved
drills. The first contains two rail marks. The second contains two S-curve marks. Its data uses the
`demo:touch-canvas-drills:data` key in both localStorage and the
`touch-canvas-drills` IndexedDB database. The banner remains visible while in
demo mode. **Reset demo** deletes and reseeds only that namespace. **Start for
real** waits for pending writes, deletes the demo record from both stores, and
then opens `/practice`.

The sample drill definitions are bundled with the application, so the demo can
be used after the first visit with the network off. Both demo URLs use the same
isolated namespace; neither reads or writes the real practice key.
