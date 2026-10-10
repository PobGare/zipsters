import fs from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
await fs.mkdir('dist',{recursive:true});
await fs.rm('dist/zipsters-theme.zip',{force:true});
const command=`Add-Type -AssemblyName System.IO.Compression; Add-Type -AssemblyName System.IO.Compression.FileSystem
$themeRoot=(Resolve-Path -LiteralPath 'theme').Path
$themeZip=[System.IO.Compression.ZipFile]::Open((Join-Path (Get-Location) 'dist/zipsters-theme.zip'),[System.IO.Compression.ZipArchiveMode]::Create)
try { Get-ChildItem -LiteralPath $themeRoot -Recurse -File | ForEach-Object { $entryName=$_.FullName.Substring($themeRoot.Length+1).Replace([char]92,[char]47); [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($themeZip,$_.FullName,$entryName) | Out-Null } } finally { $themeZip.Dispose() }`;
const r=spawnSync('powershell.exe',['-NoProfile','-Command',command],{stdio:'inherit'});if(r.status)process.exit(r.status);console.log('Shopify theme: dist/zipsters-theme.zip');

