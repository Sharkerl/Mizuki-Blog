$baseOutput = "public/tiles"
$baseUrl = "https://tile.openstreetmap.org"
$latMin = 10
$latMax = 60
$lonMin = 80
$lonMax = 160
$zoomLevels = @(4, 5, 6)

function Get-TileNumber {
    param($lat, $lon, $z)
    $x = [Math]::Floor(($lon + 180) / 360 * [Math]::Pow(2, $z))
    $latRad = $lat * [Math]::PI / 180
    $y = [Math]::Floor((1 - [Math]::Log([Math]::Tan($latRad) + 1/[Math]::Cos($latRad)) / [Math]::PI) / 2 * [Math]::Pow(2, $z))
    return @{ x = $x; y = $y }
}

foreach ($z in $zoomLevels) {
    Write-Host "Processing zoom level $z ..."
    $tileMin = Get-TileNumber -lat $latMax -lon $lonMin -z $z
    $tileMax = Get-TileNumber -lat $latMin -lon $lonMax -z $z
    $xMin = $tileMin.x; $xMax = $tileMax.x
    $yMin = $tileMin.y; $yMax = $tileMax.y
    $count = 0
    foreach ($x in $xMin..$xMax) {
        foreach ($y in $yMin..$yMax) {
            $outDir = "$baseOutput/$z/$x"
            $outFile = "$outDir/$y.png"
            if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }
            if (-not (Test-Path $outFile)) {
                try {
                    Invoke-WebRequest -Uri "$baseUrl/$z/$x/$y.png" -OutFile $outFile -UseBasicParsing
                    $count++
                } catch {}
            }
        }
    }
    Write-Host "Downloaded $count tiles at zoom $z"
}
