Add-Type -AssemblyName System.Drawing
$im=[System.Drawing.Image]::FromFile((Join-Path (Get-Location) 'assets/originals/714383629.jpg'))
$encoder=[System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object {$_.MimeType -eq 'image/jpeg'}
$params=New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0]=New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality),88L
foreach($w in @(480,960,1200)) {$h=[int]($w*1500/1700);$b=New-Object System.Drawing.Bitmap $w,$h;$g=[System.Drawing.Graphics]::FromImage($b);$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic;$rect=New-Object System.Drawing.Rectangle 0,0,$w,$h;$g.DrawImage($im,$rect,1000,50,1700,1500,[System.Drawing.GraphicsUnit]::Pixel);$b.Save((Join-Path (Get-Location) "theme/assets/henley-macro-$w.jpg"),$encoder,$params);$g.Dispose();$b.Dispose()};$im.Dispose()
