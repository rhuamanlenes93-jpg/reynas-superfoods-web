# Descarga las fotos de solucionesquimicasgk.com (web de la misma dueña)
# y reemplaza las fotos hechas con IA en assets/products/ con el mismo nombre.
# Uso (desde la carpeta del proyecto, en la terminal de VS Code):
#   powershell -ExecutionPolicy Bypass -File tools\descargar-fotos-gk.ps1

$ErrorActionPreference = 'Stop'
$base = 'https://solucionesquimicasgk.com/_astro/'
$dest = Join-Path $PSScriptRoot '..\assets\products'

# clave de la foto en Reyna's  =  archivo en la web GK
$fotos = [ordered]@{
  'feat_maca'        = 'harina-de-maca-negra-gelatinizada.CAXah8Eu_1CHmme.webp'
  'h_maca_negra'     = 'extracto-de-maca-negra.duHGeQn6_2lTbwD.webp'
  'h_maca_roja'      = 'harina-de-maca-roja-gelatinizada.ycyaErA4_2qYXFs.webp'
  'h_maca_amarilla'  = 'harina-de-maca-amarilla-gelatinizada.B9EdZYaU_Z1x1pWu.webp'
  'h_maca_comercial' = 'harina-de-maca-negra-comercial-gelatinizada.D1Xx7rjU_Z1GxhmP.webp'
  'h_lucuma'         = 'lucuma-en-polvo.Dgo9Dwyi_27fwTs.webp'
  'h_maiz_morado'    = 'extracto-de-maiz-morado.D5_M8ri7_Z1tQmLm.webp'
  'h_camu_camu'      = 'extracto-de-camu-camu-marron-10-1.CBTvntXb_2ugc5v.webp'
  'h_quinua'         = 'harina-de-quinua-gelatinizada.D09jVjIf_Z11G10P.webp'
  'h_kiwicha'        = 'harina-de-kiwicha-gelatinizada.4dA-BfKt_FKDyg.webp'
  'h_aguaje'         = 'extracto-de-aguaje-10-1.XCA7ixWC_ZJMfa1.webp'
  'h_huanarpo'       = 'harina-de-huanarpo-macho.DnpjPIiX_1p94bW.webp'
  'h_espirulina'     = 'espirulina-verde-en-polvo.D5X5qpO-_1jCEy.webp'
  'h_algas'          = 'extracto-de-alga-wakame.CGvVFVIe_25ByaA.webp'
  'h_sauco'          = 'extracto-de-elderberry-sauco.ClXp2y3j_Z1aUaVV.webp'
  'h_noni'           = 'extracto-de-noni-8-1.CUIEd8LW_1tOHNW.webp'
  'h_avena'          = 'harina-de-avena.B1GFop7B_Z1AbHSr.webp'
  'h_linaza'         = 'harina-de-linaza.Bo2ZI4-0_Z1jMOla.webp'
  'h_chia'           = 'extracto-de-semilla-de-chia.CQTJcxpE_Z2qzN0l.webp'
  'h_soja'           = 'harina-de-soya.BrrqrrT1_1lzB8p.webp'
  'h_cebada'         = 'extracto-de-cebada.Dnlt2Gmu_1DP2z1.webp'
  'h_fenogreco'      = 'extracto-de-fenogreco-10.ChSth7WY_Z1t0sVE.webp'
  'h_te_verde'       = 'extracto-de-te-verde-80.BiF6IeLA_ZoTd3e.webp'
  'h_te_negro'       = 'extracto-de-te-negro-en-polvo.BBK8sTjz_Z1FuHVY.webp'
  'h_romero'         = 'extracto-de-romero.fzzvy_na_1r2mP4.webp'
  'h_achiote'        = 'extracto-de-achiote-10-1.CI8FuatK_Z1r74in.webp'
  'h_sen'            = 'extracto-de-sen-20.CeSGbLsc_1L0xGC.webp'
  'h_alfalfa'        = 'harina-de-alfalfa.tDFLhRBK_1jBGXX.webp'
  'h_paico'          = 'extracto-de-paico.Ds4msKVB_o7PeY.webp'
  'h_platano'        = 'extracto-de-platano-10-1.BE-lPf9f_Z2f5lva.webp'
  'h_zanahoria'      = 'extracto-de-zanahoria.DEFC1z1G_Z1uInJJ.webp'
  'h_beterraga'      = 'extracto-de-remolacha.DVGXkMha_SkUHH.webp'
  'h_kion'           = 'harina-de-jengibre.DjNos9XM_1eD8ID.webp'
  'h_curcuma'        = 'extracto-de-curcuma.wbSQL3Md_oE8Mp.webp'
  'h_ajos'           = 'harina-de-ajo.CH1Hz1WE_Ejrb7.webp'
  'h_higo'           = 'extracto-de-higo-8-1.DnEbHqdc_elHNc.webp'
  'h_mango'          = 'extracto-de-mango-8-1.C3ocTu6O_Z1JK0ud.webp'
  'h_alcachofa'      = 'harina-de-alcachofa.oP2G4ujT_Z2vJAgU.webp'
  'x_camu_camu'      = 'extracto-de-camu-camu-rosado.ByxowzGk_1OTpRD.webp'
  'x_arandano_rojo'  = 'extracto-de-arandano-rojo-cranberry-10-1.BEOVI71d_8hrOt.webp'
  'x_arandano_azul'  = 'extracto-de-arandano-azul-blueberry-10-1.DZkhmqSh_CMd1w.webp'
  'x_maracuya'       = 'extracto-de-maracuya-10-1.BDwZkRbn_Z1VAzVh.webp'
  'x_fresa'          = 'extracto-de-fresa-8-1.RfXhbSxt_Z2bCb7.webp'
  'x_uva'            = 'uva-roja-atomizada.DB92PIqC_2wBvGf.webp'
  'x_granada'        = 'extracto-de-granada-5-1.B-znUtq0_ZmWS4P.webp'
  'x_acai'           = 'extracto-de-acai-berry-10-1.CqpASoAs_Acx56.webp'
  'x_pitahaya'       = 'extracto-de-pitahaya-10-1.CT2I8S8Y_Z1kQYPJ.webp'
}

$ok = 0; $fallas = @()
foreach ($k in $fotos.Keys) {
  $out = Join-Path $dest "$k.webp"
  try {
    Invoke-WebRequest -Uri ($base + $fotos[$k]) -OutFile $out -UseBasicParsing
    $ok++; Write-Host "OK   $k"
  } catch {
    $fallas += $k; Write-Host "FALLO $k  ($($_.Exception.Message))" -ForegroundColor Red
  }
}
Write-Host ""
Write-Host "Listo: $ok fotos reemplazadas en assets/products." -ForegroundColor Green
if ($fallas.Count) { Write-Host "No se pudieron bajar: $($fallas -join ', ')" -ForegroundColor Yellow }
