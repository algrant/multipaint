import { pixelsInBoundingBox, applyTransform } from '../MultiPaint';

it('pixelsInBoundingBox yields pixels in bounding box', () => {
    expect(
        [...pixelsInBoundingBox([[0, 0], [2, 3]])]
    ).toEqual(
        [
            [ 0, 0 ], [ 1, 0 ],
            [ 0, 1 ], [ 1, 1 ],
            [ 0, 2 ], [ 1, 2 ],
        ]
    )
});

it('applyTransform translates an index by a vector', () => {
    expect(applyTransform([0,0], { translate: [5, 1] })).toEqual([5, 1])
    expect(applyTransform([-10,10], { translate: [5, 1] })).toEqual([-5, 11])
})