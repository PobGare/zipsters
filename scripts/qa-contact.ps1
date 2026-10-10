Add-Type -AssemblyName System.Drawing
foreach ($w in @(1440,1280,1024,768,430,390,360)) {
 $im=[System.Drawing.Image]::FromFile((Join-Path (Get-Location) "research/qa/homepage-$w.jpg"))
 $cols= if($w -lt 500){6}else{4}
 $panelW= if($w -lt 500){240}else{350}
 $sliceH=[int][Math]::Ceiling($im.Height/$cols)
 $scale=$panelW/$im.Width
 $panelH=[int][Math]::Ceiling($sliceH*$scale)
 $bmp=New-Object System.Drawing.Bitmap ($panelW*$cols),$panelH
 $g=[System.Drawing.Graphics]::FromImage($bmp)
 $g.Clear([System.Drawing.Color]::White)
 $g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
 for($i=0;$i -lt $cols;$i++) {
  $sy=$i*$sliceH;$sh=[Math]::Min($sliceH,$im.Height-$sy)
  $dest=New-Object System.Drawing.Rectangle ($i*$panelW),0,$panelW,([int]($sh*$scale))
  $g.DrawImage($im,$dest,0,$sy,$im.Width,$sh,[System.Drawing.GraphicsUnit]::Pixel)
 }
 $bmp.Save((Join-Path (Get-Location) "research/qa/review-$w.jpg"),[System.Drawing.Imaging.ImageFormat]::Jpeg)
 $g.Dispose();$bmp.Dispose();$im.Dispose()
}
