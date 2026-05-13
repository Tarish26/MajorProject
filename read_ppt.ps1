$path = 'c:\Programming\major\dashboard\IG02_PPT.pptx'
Add-Type -AssemblyName System.IO.Compression.FileSystem

try {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($path)
    $entries = $zip.Entries | Where-Object { $_.FullName -match '^ppt/slides/slide\d+\.xml$' } | Sort-Object { [int]([regex]::Match($_.FullName, '\d+').Value) }
    
    foreach ($entry in $entries) {
        Write-Host "Slide: $($entry.FullName)"
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream)
        $xml = $reader.ReadToEnd()
        $text = ([regex]::Matches($xml, "(?<=<a:t>).*?(?=</a:t>)") | ForEach-Object { $_.Value }) -join " "
        Write-Host $text
        Write-Host "------------------------"
        $reader.Close()
        $stream.Close()
    }
} finally {
    if ($zip) { $zip.Dispose() }
}
