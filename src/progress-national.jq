[
    .features | .[] | .attributes |
    {
        type: "country",
        name: "Indonesia",
        day: .Hari_ke,
        numbers: {
            infected: .Jumlah_Kasus_Kumulatif,
            recovered: .Jumlah_Pasien_Sembuh,
            fatal: .Jumlah_Pasien_Meninggal
        }
    }
]
