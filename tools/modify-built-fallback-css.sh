#!/bin/bash

css_file=$(find -type f -name "fallback-*.css")

# Check if the file exists
if [[ -z "$css_file" ]]; then
  echo "No target .css file found!"
  exit 1
fi

# Remove @property blocks
sed -Ei 's/@property[^{]*\{([^}]|\n)*\}//g' "$css_file"

# # Insert @property alts
sed -Ei '0,/@layer theme\{/s/(@layer theme\{)/\1:root\{--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;--tw-rotate-x:rotateX(0);--tw-rotate-y:rotateY(0);--tw-rotate-z:rotateZ(0);--tw-skew-x:skewX(0);--tw-skew-y:skewY(0);--tw-space-y-reverse:0;--tw-space-x-reverse:0;--tw-border-style:solid;--tw-leading:normal;--tw-font-weight:normal;--tw-tracking:normal;--tw-shadow:0 0 #0000;--tw-shadow-color:transparent;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:transparent;--tw-ring-color:transparent;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:transparent;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:none;--tw-ring-offset-width:0;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-outline-style:solid;--tw-blur:none;--tw-brightness:none;--tw-contrast:none;--tw-grayscale:none;--tw-hue-rotate:none;--tw-invert:none;--tw-opacity:1;--tw-saturate:none;--tw-sepia:none;--tw-drop-shadow:none;--tw-duration:0s;\}/' "$css_file"

# # Replace color var form
sed -Ei 's/color:(var\([^)]*\))/color:rgb(\1)/g' "$css_file"

# # Rplace color-mix
sed -Ei 's/color-mix\(in oklab,\s*var\(([^)]+)\)\s*([0-9]+%)\s*,\s*transparent\)/rgba(var(\1), \2)/g' "$css_file"
