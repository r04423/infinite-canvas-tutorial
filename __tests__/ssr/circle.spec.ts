import _gl from 'gl';
import getPixels from 'get-pixels';
import '../useSnapshotMatchers';
import {
  Canvas,
  Circle,
  ImageExporter,
  DOMAdapter,
} from '../../packages/core/src';
import { NodeJSAdapter } from '../utils';

DOMAdapter.set(NodeJSAdapter);

const dir = `${__dirname}/snapshots`;
let $canvas: HTMLCanvasElement;
let canvas: Canvas;
let exporter: ImageExporter;

describe('Circle', () => {
  beforeEach(async () => {
    $canvas = DOMAdapter.get().createCanvas(200, 200) as HTMLCanvasElement;
    canvas = await new Canvas({
      canvas: $canvas,
    }).initialized;
    exporter = new ImageExporter({
      canvas,
    });
  });

  afterEach(() => {
    canvas.destroy();
  });

  it('should render a simple circle correctly.', async () => {
    const circle = new Circle({
      cx: 100,
      cy: 100,
      r: 50,
      fill: 'black',
    });
    canvas.appendChild(circle);
    canvas.render();

    expect($canvas.getContext('webgl1')).toMatchWebGLSnapshot(dir, 'circle');
    expect(exporter.toSVG({ grid: true })).toMatchSVGSnapshot(dir, 'circle');
  });

  it('should render a circle with stroke correctly.', async () => {
    const circle = new Circle({
      cx: 100,
      cy: 100,
      r: 50,
      fill: 'black',
      stroke: 'black',
      strokeOpacity: 0.5,
      strokeWidth: 20,
    });
    canvas.appendChild(circle);
    canvas.render();

    expect($canvas.getContext('webgl1')).toMatchWebGLSnapshot(
      dir,
      'circle-stroke',
    );
    expect(exporter.toSVG({ grid: true })).toMatchSVGSnapshot(
      dir,
      'circle-stroke',
    );
  });

  it('should render a circle with stroke alignment correctly.', async () => {
    const circle1 = new Circle({
      cx: 50,
      cy: 50,
      r: 50,
      fill: 'red',
      stroke: 'black',
      strokeOpacity: 0.5,
      strokeWidth: 20,
      strokeAlignment: 'inner',
    });
    canvas.appendChild(circle1);

    const circle2 = new Circle({
      cx: 150,
      cy: 50,
      r: 50,
      fill: 'red',
      stroke: 'black',
      strokeOpacity: 0.5,
      strokeWidth: 20,
      strokeAlignment: 'outer',
    });
    canvas.appendChild(circle2);

    const circle3 = new Circle({
      cx: 50,
      cy: 150,
      r: 50,
      fill: 'red',
      stroke: 'black',
      strokeOpacity: 0.5,
      strokeWidth: 20,
      strokeAlignment: 'center',
    });
    canvas.appendChild(circle3);

    canvas.render();

    expect($canvas.getContext('webgl1')).toMatchWebGLSnapshot(
      dir,
      'circle-stroke-alignment',
    );
    expect(exporter.toSVG({ grid: true })).toMatchSVGSnapshot(
      dir,
      'circle-stroke-alignment',
    );
  });

  it('should render a circle with stroke dasharray correctly.', async () => {
    const circle1 = new Circle({
      cx: 50,
      cy: 50,
      r: 50,
      fill: 'red',
      stroke: 'black',
      strokeOpacity: 0.5,
      strokeWidth: 20,
      strokeDasharray: [5, 5],
    });
    canvas.appendChild(circle1);

    canvas.render();

    expect($canvas.getContext('webgl1')).toMatchWebGLSnapshot(
      dir,
      'circle-stroke-dasharray',
    );
    expect(exporter.toSVG({ grid: true })).toMatchSVGSnapshot(
      dir,
      'circle-stroke-dasharray',
    );
  });

  it.skip('should render a circle with image correctly.', async () => {
    // Load local image instead of fetching remote URL.
    // @see https://github.com/stackgl/headless-gl/pull/53/files#diff-55563b6c0b90b80aed19c83df1c51e80fd45d2fbdad6cc047ee86e98f65da3e9R83
    const src = await new Promise((resolve, reject) => {
      getPixels(__dirname + '/canvas.png', function (err, image) {
        if (err) {
          reject('Bad image path');
        } else {
          image.width = image.shape[0];
          image.height = image.shape[1];
          resolve(image);
        }
      });
    });

    const circle = new Circle({
      cx: 100,
      cy: 100,
      r: 50,
      // @ts-expect-error
      fill: src,
      stroke: 'black',
      strokeOpacity: 0.5,
      strokeWidth: 20,
    });
    canvas.appendChild(circle);
    canvas.render();

    expect($canvas.getContext('webgl1')).toMatchWebGLSnapshot(
      dir,
      'circle-image',
    );
  });

  it('should render a circle with sizeAttenuation correctly.', async () => {
    const circle1 = new Circle({
      cx: 50,
      cy: 50,
      r: 50,
      fill: 'red',
      stroke: 'black',
      sizeAttenuation: true,
    });
    canvas.appendChild(circle1);

    canvas.camera.zoom = 2;
    canvas.render();

    expect($canvas.getContext('webgl1')).toMatchWebGLSnapshot(
      dir,
      'circle-size-attenuation',
    );
    expect(exporter.toSVG({ grid: true })).toMatchSVGSnapshot(
      dir,
      'circle-size-attenuation',
    );
  });
});
