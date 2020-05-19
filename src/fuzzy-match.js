// https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance

function damlevDistance(a, b) {
    if (!a || a.length === 0) return !b || b.length === 0 ? 0 : b.length;
    if (!b || b.length === 0) return a.length;

    const lengthA = a.length;
    const lengthB = b.length;
    const maxDist = lengthA + lengthB;

    let d = [];
    d[0] = [maxDist];

    for (let i = 0; i <= lengthA; i++) {
        d[i + 1] = [];
        d[i + 1][1] = i;
        d[i + 1][0] = maxDist;
    }
    for (let i = 0; i <= lengthB; i++) {
        d[1][i + 1] = i;
        d[0][i + 1] = maxDist;
    }

    let da = {};
    const sigma = a + b;
    for (let i = 0; i < sigma.length; i++) if (!da.hasOwnProperty(sigma[i])) da[sigma[i]] = 0;

    for (let i = 1; i <= lengthA; i++) {
        let db = 0;
        for (let j = 1; j <= lengthB; j++) {
            let k = da[b[j - 1]];
            let l = db;

            if (a[i - 1] == b[j - 1]) {
                d[i + 1][j + 1] = d[i][j];
                db = j;
            } else {
                d[i + 1][j + 1] = Math.min(d[i][j], Math.min(d[i + 1][j], d[i][j + 1])) + 1;
            }
            d[i + 1][j + 1] = Math.min(d[i + 1][j + 1], d[k][l] + (i - k) + (j - l - 1));
        }
        da[a[i - 1]] = i;
    }
    return d[lengthA + 1][lengthB + 1];
}

function fuzzyMatch(list, name) {
    const distances = list.map((p) => {
        return {
            name: p,
            score: damlevDistance(p, name)
        };
    });
    return distances.sort((x, y) => x.score - y.score).shift();
}

module.exports = fuzzyMatch;
