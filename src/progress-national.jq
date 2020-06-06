[
    .update | .harian | .[] |
    {
        type: "country",
        name: "Indonesia",
        timestamp: .key,
        numbers: {
            infected: .jumlah_positif_kum .value,
            recovered: .jumlah_sembuh_kum .value,
            fatal: .jumlah_meninggal_kum .value
        }
    }
]
