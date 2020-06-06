[
    .list_data | .[] |
    {
        type: "province",
        name: .key,
        numbers:
        {
            infected: .jumlah_kasus,
            recovered : .jumlah_sembuh,
            fatal: .jumlah_meninggal
        }
    }
]
