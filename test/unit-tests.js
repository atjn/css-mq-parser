/* global describe, it */

'use strict';

var expect     = require('chai').expect,
    mediaQuery = require('../');

describe('mediaQuery.parse()', function () {
    it('should parse media queries without expressions', function () {
        expect(mediaQuery.parse('screen')).to.eql([
            {
                inverse    : false,
                type       : 'screen',
                expressions: []
            }
        ]);

        expect(mediaQuery.parse('not screen')).to.eql([
            {
                inverse    : true,
                type       : 'screen',
                expressions: []
            }
        ]);
    });

    it('should parse common retina media query list', function () {
        var parsed = mediaQuery.parse(
            'only screen and (-webkit-min-device-pixel-ratio: 2),\n' +
            'only screen and (   min--moz-device-pixel-ratio: 2),\n' +
            'only screen and (     -o-min-device-pixel-ratio: 2/1),\n' +
            'only screen and (        min-device-pixel-ratio: 2),\n' +
            'only screen and (                min-resolution: 192dpi),\n' +
            'only screen and (                min-resolution: 2dppx)'
        );

        expect(parsed).to.be.an.array;
        expect(parsed).to.have.length(6);
        expect(parsed[0].expressions[0].feature).to.equal('-webkit-min-device-pixel-ratio');
        expect(parsed[1].expressions[0].modifier).to.equal('min');
    });

    it('should throw a SyntaxError when a media query is invalid', function () {
        function parse(query) {
            return function () { mediaQuery.parse(query); };
        }

        expect(parse('some crap')).to.throw(SyntaxError);
        expect(parse('48em')).to.throw(SyntaxError);
        expect(parse('screen and crap')).to.throw(SyntaxError);
        expect(parse('screen and (48em)')).to.throw(SyntaxError);
        expect(parse('screen and (foo:)')).to.throw(SyntaxError);
        expect(parse('()')).to.throw(SyntaxError);
        expect(parse('(foo) (bar)')).to.throw(SyntaxError);
        expect(parse('(foo:) and (bar)')).to.throw(SyntaxError);
    });
});
