import { polygonsFromAsciiTiles } from "../infinitycard";
const horizontalAs = "AA";
const horizontalAsWithGap = "A A";
const horizontalABA = "ABA";
const verticalAs = `
A
A
`;

describe("polygonsFromAsciiTiles", () => {
  it("returns single tile for A", () => {
    const polygons = polygonsFromAsciiTiles(7, 10, `A`);

    expect(polygons).toEqual([
      {
        polygon: [
          [0, 0],
          [7, 10],
        ],
        transforms: [{ translate: [0, 0] }],
      },
    ]);
  });

  it("returns single tile with two transforms for AA", () => {
    const polygons = polygonsFromAsciiTiles(7, 10, horizontalAs);

    expect(polygons).toEqual([
      {
        polygon: [
          [0, 0],
          [7, 10],
        ],
        transforms: [{ translate: [0, 0] }, { translate: [7, 0] }],
      },
    ]);
  });

  it("returns single tile with two transforms for 'A A' which skip space", () => {
    const polygons = polygonsFromAsciiTiles(7, 10, horizontalAsWithGap);

    expect(polygons).toEqual([
      {
        polygon: [
          [0, 0],
          [7, 10],
        ],
        transforms: [{ translate: [0, 0] }, { translate: [14, 0] }],
      },
    ]);
  });

  it("returns two tiles for AB", () => {
    const polygons = polygonsFromAsciiTiles(7, 10, `AB`);

    expect(polygons).toEqual([
      {
        polygon: [
          [0, 0],
          [7, 10],
        ],
        transforms: [{ translate: [0, 0] }],
      },
      {
        polygon: [
          [0, 0],
          [7, 10],
        ],
        transforms: [{ translate: [7, 0] }],
      },
    ]);
  });

  it("returns two tiles for ABA with appropriate transforms", () => {
    const polygons = polygonsFromAsciiTiles(7, 10, horizontalABA);

    expect(polygons).toEqual([
      {
        polygon: [
          [0, 0],
          [7, 10],
        ],
        transforms: [{ translate: [0, 0] }, { translate: [14, 0] }],
      },
      {
        polygon: [
          [0, 0],
          [7, 10],
        ],
        transforms: [{ translate: [7, 0] }],
      },
    ]);
  });

  it("returns appropriate tiles for vertical stacked As", () => {
    const polygons = polygonsFromAsciiTiles(7, 10, verticalAs);

    expect(polygons).toEqual([
      {
        polygon: [
          [0, 0],
          [7, 10],
        ],
        transforms: [{ translate: [0, 0] }, { translate: [0, 10] }],
      },
    ]);
  });
});
