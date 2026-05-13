$path = 'c:\Programming\major\dashboard\IG02_PPT.pptx'
$outPath = 'c:\Programming\major\dashboard\ppt_text_utf8.txt'
Add-Type -AssemblyName System.IO.Compression.FileSystem

$sb = [System.Text.StringBuilder]::new()

try {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($path)
    $entries = $zip.Entries | Where-Object { $_.FullName -match '^ppt/slides/slide\d+\.xml$' } | Sort-Object { [int]([regex]::Match($_.FullName, '\d+').Value) }
    
    foreach ($entry in $entries) {
        [void]$sb.AppendLine("Slide: $($entry.FullName)")
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream)
        $xml = $reader.ReadToEnd()
        $text = ([regex]::Matches($xml, "(?<=<a:t>).*?(?=</a:t>)") | ForEach-Object { $_.Value }) -join " "
        [void]$sb.AppendLine($text)
        [void]$sb.AppendLine("------------------------")
        $reader.Close()
        $stream.Close()
    }
}
finally {
    if ($zip) { $zip.Dispose() }
}

[System.IO.File]::WriteAllText($outPath, $sb.ToString(), [System.Text.Encoding]::UTF8)
