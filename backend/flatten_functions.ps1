$root = "C:\Users\rohan\Desktop\medigram\backend\supabase\functions"

Get-ChildItem -Recurse -Directory $root | ForEach-Object {
    $path = $_.FullName
    if (Test-Path "$path\index.js") {
        $name = Split-Path $path -Leaf
        $newPath = Join-Path $root $name
        
        if ($path -ne $newPath) {
            Write-Host "Moving $path to $newPath..."
            Move-Item -Force $path $newPath
        }
    }
}
