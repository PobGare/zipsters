Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
$out = Join-Path $root 'theme/assets'
New-Item -ItemType Directory -Force -Path $out | Out-Null
$map = @{
 'hero-cafe'='836117967'; 'henley-black'='825325436'; 'henley-black-alt'='825325299';
 'henley-white'='714383629'; 'henley-white-alt'='806505256'; 'henley-brown'='712523869';
 'henley-brown-alt'='830695312'; 'henley-grey'='710667119'; 'henley-grey-alt'='779786755';
 'henley-long-white'='753137331'; 'story-garden'='764817420'; 'campaign-garden'='684572580';
 'look-cafe'='817456040'; 'look-riverside'='766075056'; 'look-brown'='807921218';
 'mesh-black'='747743820'; 'mesh-white'='752610051'; 'denim'='711426318';
 'pleated-pants'='662512995'; 'tee-black'='753672868'; 'look-studio'='741365784'; 'look-recline'='651746955'
}
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object {$_.MimeType -eq 'image/jpeg'}
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality),85L
foreach ($name in $map.Keys) {
 $im = [System.Drawing.Image]::FromFile((Join-Path $root "assets/originals/$($map[$name]).jpg"))
 foreach ($width in @(480,960,1200,2400)) {
  if ($width -gt $im.Width) {continue}
  $height = [int]($im.Height * $width / $im.Width)
  $bmp = New-Object System.Drawing.Bitmap $width,$height
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($im,0,0,$width,$height)
  $bmp.Save((Join-Path $out "$name-$width.jpg"),$encoder,$params)
  $g.Dispose(); $bmp.Dispose()
 }
 $im.Dispose()
}
