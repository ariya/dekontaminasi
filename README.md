# Dekontaminasi

[![GitHub license](https://img.shields.io/github/license/ariya/dekontaminasi)](https://github.com/ariya/dekontaminasi/blob/master/LICENSE)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/ariya/dekontaminasi)
[![Tests](https://github.com/ariya/dekontaminasi/workflows/Tests/badge.svg)](https://github.com/ariya/dekontaminasi/actions)

[Bahasa Indonesia](#indonesian) | [English](#english)

---

### <a name="indonesian"></a>Bahasa Indonesia

Repositori ini menyimpan perkakas yang digunakan untuk membuat [dekontaminasi.com](https://dekontaminasi.com), sebuah layanan API untuk data perkembangan COVID-19 di Indonesia.

Dengan mengubah isi repositori sesuai kebutuhan, Anda pun bisa menjalankan layanan API Anda sendiri untuk menyebarluaskan informasi COVID-19!

Beberapa ragam data yang tersedia (dalam format JSON):

* [Rangkuman penyebaran total dan tiap provinsi](https://dekontaminasi.com/api/id/covid19/stats)
* [Daftar rumah sakit rujukan resmi](https://dekontaminasi.com/api/id/covid19/hospitals)
* [Berita-berita termutakhir](https://dekontaminasi.com/api/id/covid19/news) seputar COVID-19
* [Kabar hoaks](https://dekontaminasi.com/api/id/covid19/hoaxes) terbaru (dari [turnbackhoax.id](https://turnbackhoax.id/))

**CATATAN**: Data paparan COVID-19 diekstrak dari [dashboard resmi ArcGIS milik BNPB](https://inacovid19.maps.arcgis.com) (Badan Nasional Penanggulangan Bencana).

Yang diperlukan (versi minimum): [Node.js](https://nodejs.org/) versi 10, [curl](https://curl.haxx.se/) versi 7.58, [jq](https://stedolan.github.io/jq/manual/) versi 1.5. Pengguna Ubuntu/Debian bisa mendapatkannya dengan:
```
sudo apt install -y nodejs curl jq
```

Cara menjalankan:
```
npm install
npm run build
```

maka data-data penting akan diletakkan di direktori `public`:
```
$ find public/ -type f
public/api/id/covid19/hoaxes
public/api/id/covid19/hospitals
public/api/id/covid19/news
public/api/id/covid19/stats
public/index.html
public/ping
```

yang tentunya telah siap dipublikasikan sebagai situs statik, misalnya menggunakan [Firebase Hosting](https://firebase.google.com/docs/hosting/), [Zeit/Vercel](https://vercel.com/), [Surge](https://surge.sh/), [Netlify](https://www.netlify.com/), [Aerobatic](https://www.aerobatic.com/), dan yang sejenisnya, ataupun juga diletakkan di sebuah server HTTP secara manual.

Khusus untuk [dekontaminasi.com](https://dekontaminasi.com), data-data tersebut akan diperbarui tiap 15 menit karena tahapan `npm run build` terus dipicu secara berkala, memanfaatkan fitur _scheduled event_ dari GitHub Actions ([lihat dokumentasinya](https://help.github.com/en/actions/reference/events-that-trigger-workflows#scheduled-events-schedule)).

<hr>

### <a name="english"></a>English

This repository contains the tools necessary to build [dekontaminasi.com](https://dekontaminasi.com), an API service to get the latest COVID-19 development in Indonesia.

If you want to run your own COVID-19 API server, simply customize and tweak this repository and deploy the data accordingly!

Currently, some available information includes (formatted as JSON):

* [Summary of cases](https://dekontaminasi.com/api/id/covid19/stats)
* [The list of referral hospitals](https://dekontaminasi.com/api/id/covid19/hospitals)
* [Latest news articles](https://dekontaminasi.com/api/id/covid19/news) relevant to COVID-19
* [Recently discovered hoaxes](https://dekontaminasi.com/api/id/covid19/hoaxes) (from [turnbackhoax.id](https://turnbackhoax.id/))

**NOTE**: The information on COVID-19 spread is extracted from [the official ArcGIS dashboard of BNPB](https://inacovid19.maps.arcgis.com/) (National Disaster Mitigation Agency).

Minimum requirements: [Node.js](https://nodejs.org/) version 10, [curl](https://curl.haxx.se/) version 7.58, [jq](https://stedolan.github.io/jq/manual/) version 1.5. For Ubuntu/Debian, fulfill these by installing the following packages:
```
sudo apt install -y nodejs curl jq
```

To run the data extraction:
```
npm install
npm run build
```

which will place the important bits in the `public` subdirectory:
```
$ find public/ -type f
public/api/id/covid19/hoaxes
public/api/id/covid19/hospitals
public/api/id/covid19/news
public/api/id/covid19/stats
public/index.html
public/ping
```

that can be published just like a regular static site, e.g. using [Firebase Hosting](https://firebase.google.com/docs/hosting/), [Zeit/Vercel](https://vercel.com/), [Surge](https://surge.sh/), [Netlify](https://www.netlify.com/), [Aerobatic](https://www.aerobatic.com/), etc, or served manually from any HTTP server.

Note that for [dekontaminasi.com](https://dekontaminasi.com), the data will be updated very 15 minutes because `npm run build` is triggered periodically, thanks to the  _scheduled event_ feature from GitHub Actions ([check the documentation](https://help.github.com/en/actions/reference/events-that-trigger-workflows#scheduled-events-schedule))
