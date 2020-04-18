osm-strava
==========

osm-strava is a simple little express-based web server, that lazily fetches tiles from
the German Open Street Map tile server as well as Strava Global Heatmap overlay tiles,
combines these and serves them itself.

Please note that you need to have a Strava Summit account to access the heatmap tiles.

In combination with a redirector extension for your browser, like
[Redirector for Firefox](https://addons.mozilla.org/de/firefox/addon/redirector/),
you can rewrite URLs like `https://*.tile.openstreetmap.org/*/*/*.png` to
`https://*.tile.openstreetmap.org/*/*/*.png` and hence can trick sites (like e.g. Komoot)
into showing overlayed tiles.
