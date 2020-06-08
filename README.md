osm-strava
==========

osm-strava is a simple little express-based web server, that lazily fetches tiles from the German Open Street Map tile server as well as Strava Global Heatmap overlay tiles, combines these and serves them itself.

Please note that you need to have a Strava Summit account to access the heatmap tiles.

In combination with a redirector extension for your browser, like [Redirector for Firefox](https://addons.mozilla.org/de/firefox/addon/redirector/) or [Redirector for Chrome](https://chrome.google.com/webstore/detail/redirector/ocgpenflpmgnfapjedencafcfakcekcd), you can rewrite Image-URLs and trick sites (like e.g. Komoot) into showing overlayed tiles.

Setup
-----

You will need a strava summit account and node.js installed.

First, copy your Strava policy, signature, and key-pair-id from your strava.com cookies into your environment variables.

```
export POLICY=from_strava
export SIGNATURE=from_strava
export KEY_PAIR_ID=from_strava
```

Then run:

```
git clone https://github.com/stesie/osm-strava.git
cd osm-strava
npm install
npm start
```

_Note_: If you are running on Mac OS X Catalina, make sure you have node v12 installed. Mapnik installation will fail with node v14.

Make sure to add a redirector policy to your browser to redirect image-urls from `https://*.tile.openstreetmap.org/*/*/*.png` to `http://localhost:5000/*/*/*/*.png`. You may want to use a plugin like [Redirector for Firefox](https://addons.mozilla.org/de/firefox/addon/redirector/) or [Redirector for Chrome].

Finally, fire up komoot and choose the Open Street Map Map Layer in your Komoot Planning App.
