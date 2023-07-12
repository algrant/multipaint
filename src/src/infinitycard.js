const infinityCardAscii = `
AB AE AE IE
CD CF GH JH

KL KM KM PM
JH JN OD CD
`;



export const polygonsFromAsciiTiles = (tileWidth, tileHeight, asciiCanvas) => {
    const tileData = asciiCanvas.trim().split("\n").map((v => v.split("")))

    const polygons = tileData.reduce((memo, row, rowIndex) => {
        row.forEach((tileId, colIndex) => {
            if (tileId === ' ') return;
            memo[tileId] ||= {
                polygon: [[0, 0], [tileWidth, tileHeight]],
                transforms: [],
            }
            memo[tileId].transforms.push({
                translate: [
                    colIndex*tileWidth,
                    rowIndex*tileHeight,
                ],
            })
        })
        return memo;
    }, {})

    return Object.values(polygons);
};



export const genInfinityCardData = (tileWidth) => {
    return {
        canvas: {
            width: tileWidth*infinityCardAscii.trim().split(`\n`)[0].length,
            height: tileWidth*1.5*infinityCardAscii.trim().split(`\n`).length,
        },
        polygons: polygonsFromAsciiTiles(tileWidth, tileWidth*1.5, infinityCardAscii)
    };
}
