const express = require('express');
const app = express();
const blend = require('@mapbox/blend');
const fs = require('fs');
const fetch = require('node-fetch');

const PORT = parseInt(process.env.PORT || '5000', 10);
const { KEY_PAIR_ID, SIGNATURE, POLICY } = process.env;

if (!KEY_PAIR_ID || !SIGNATURE || !POLICY) {
    console.error('KEY_PAIR_ID/SIGNATURE/POLICY env variable triplet not set. moep.');
    process.exit(1);
}

function getCacheFilePath({ x, y, z }) {
    const path = `${process.env.HOME}/.cache/osm-strava/${z}/${x}`;
    fs.mkdirSync(path, { recursive: true });
    return `${path}/${y}.png`;
}

function getOpenStreetMapUrl({ letter, z, x, y }) {
    return `https://${letter}.tile.openstreetmap.de/${z}/${x}/${y}.png`;
}

async function fetchOpenStreetMapTile(params) {
    return (await fetch(getOpenStreetMapUrl(params))).buffer();
}

function getStravaOverlayTileUrl({ letter, z, x, y }) {
    return `https://heatmap-external-${letter}.strava.com/tiles-auth/ride/bluered/${z}/${x}/${y}.png?px=256&Key-Pair-Id=${KEY_PAIR_ID}&Signature=${SIGNATURE}&Policy=${POLICY}`;
}

async function fetchStravaOverlayTile(params) {
    return (await fetch(getStravaOverlayTileUrl(params))).buffer();
}

app.get('/:letter/:z/:x/:y.png', async function (req, res) {
    const cacheFilePath = getCacheFilePath(req.params);

    if (fs.existsSync(cacheFilePath)) {
        res.header({ 'Content-type': 'image/png' }).send(await fs.promises.readFile(cacheFilePath));
        return;
    }

    const [baseImage, stravaOverlay] = await Promise.all([
        fetchOpenStreetMapTile(req.params),
        fetchStravaOverlayTile(req.params),
    ]);

    blend([baseImage, stravaOverlay], { reencode: true, compression: 1 }, function (err, data) {
        if (err) {
            console.log('gnah', err);
            res.status(500).send('image processing failed :-(');
            return;
        }

        fs.promises
            .writeFile(cacheFilePath, data)
            .then(() => undefined)
            .catch((err) => {
                console.warn('failed to write cache file', err);
            });

        res.header({ 'Content-type': 'image/png' }).send(data);
    });
});

app.listen(PORT, function () {
    console.log(`osm-strava server running on port ${PORT}.`);
});
