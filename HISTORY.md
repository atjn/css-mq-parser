ChangeLog
==============================

css-mq-parser 0.0.1 (2015-05-12)
----

* Fork css-mediaquery
* Change metadata accordingly


css-mediaquery NEXT
----

* Made `parse()` sticter; it will now thorw a `SyntaxError` if a media query is
  invalid. This makes it behave more like `JSON.parse()`.


css-mediaquery 0.1.2 (2014-01-21)
------------------

* Fixed issue with parsing media queries that do not have expressions. ([#5][])


[#5]: https://github.com/ericf/css-mediaquery/issues/5


css-mediaquery 0.1.1 (2014-01-08)
------------------

* Added docs to README for `parse()`.


css-mediaquery 0.1.0 (2014-01-08)
------------------

* Initial public release.
