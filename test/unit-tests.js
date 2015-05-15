/*eslint-env node */
/*eslint no-unused-expressions:0 */
/* global describe, it */
/*jshint -W030 */

var expect = require('chai').expect;
var mediaQuery = require('../');

describe('mediaQuery.parse()', function () {
    it('should parse media queries without expressions', function () {
        expect(mediaQuery.parse('screen')).to.eql([
            {
                inverse: false,
                preTypeHack: '',
                type: 'screen',
                postTypeHack: '',
                expressions: []
            }
        ]);

        expect(mediaQuery.parse('not screen')).to.eql([
            {
                inverse: true,
                preTypeHack: '',
                type: 'screen',
                postTypeHack: '',
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

    it('should parse media queries that use browser hacks', function () {
        // http://browserhacks.com/#hack-36e9719b0244c5806423ca3c8ce02bdc
        expect(mediaQuery.parse('all and (min-resolution: 3e1dpcm)')).to.eql([
            {
                inverse: false,
                preTypeHack: '',
                type: 'all',
                postTypeHack: '',
                expressions: [{
                    modifier: 'min',
                    feature: 'resolution',
                    value: '3e1dpcm'
                }]
            }
        ]);

        // http://browserhacks.com/#hack-a60b03e301a67f76a5a22221c739dc64
        expect(mediaQuery.parse('screen and (min-width:0\\0)')).to.eql([
            {
                inverse: false,
                preTypeHack: '',
                type: 'screen',
                postTypeHack: '',
                expressions: [{
                    modifier: 'min',
                    feature: 'width',
                    value: '0\\0'
                }]
            }
        ]);

        // http://browserhacks.com/#hack-411240e387db3ac5b87da57714e25d22
        expect(mediaQuery.parse('\\0 all')).to.eql([
            {
                inverse: false,
                preTypeHack: '\\0 ',
                type: 'all',
                postTypeHack: '',
                expressions: []
            }
        ]);

        // http://browserhacks.com/#hack-c9242a5ec3f073257e275102be15d95f
        expect(mediaQuery.parse('\\0screen')).to.eql([
            {
                inverse: false,
                preTypeHack: '\\0',
                type: 'screen',
                postTypeHack: '',
                expressions: []
            }
        ]);

        // http://browserhacks.com/#hack-a13653e3599eb6e6c11ba7f1a859193e
        expect(mediaQuery.parse('\\\\0 screen')).to.eql([
            {
                inverse: false,
                preTypeHack: '\\\\0 ',
                type: 'screen',
                postTypeHack: '',
                expressions: []
            }
        ]);

        // http://browserhacks.com/#hack-6615a4a5434dc55fc1c01736edb32cb7
        expect(mediaQuery.parse('screen\\9')).to.eql([
            {
                inverse: false,
                preTypeHack: '',
                type: 'screen',
                postTypeHack: '\\9',
                expressions: []
            }
        ]);
    });

    it('should throw a SyntaxError when a media query is completely invalid', function () {
        function parse(query) {
            return function () {
                mediaQuery.parse(query);
            };
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
