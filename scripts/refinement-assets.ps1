Add-Type -AssemblyName System.Drawing
$map=@{'mesh-black-alt'='724312887';'denim-styled'='711885901';'pleated-pants-alt'='658981347';'pleated-pants-third'='658540374';'campaign-cafe'='817456040';'henley-white-detail'='714383629'}
$encoder=[System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object {$_.MimeType -eq 'image/jpeg'}
$params=New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0]=New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality),88L
foreach($name in $map.Keys){$im=[System.Drawing.Image]::FromFile((Join-Path (Get-Location) "assets/originals/$($map[$name]).jpg"));foreach($w in @(480,960,1200,1920,2400)){if($w -gt $im.Width -or ($w -gt 1200 -and $name -ne 'campaign-cafe' -and $name -ne 'henley-white-detail')){continue};$h=[int]($im.Height*$w/$im.Width);$b=New-Object System.Drawing.Bitmap $w,$h;$g=[System.Drawing.Graphics]::FromImage($b);$g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic;$g.DrawImage($im,0,0,$w,$h);$b.Save((Join-Path (Get-Location) "theme/assets/$name-$w.jpg"),$encoder,$params);$g.Dispose();$b.Dispose()};$im.Dispose()}
