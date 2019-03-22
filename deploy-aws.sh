#!/bin/bash
VERSION=$1
if [ $(aws s3 ls orderin-ui-host/$VERSION/ | wc -l) -gt 0 ]; then
  echo "$VERSION already deployed";
else
  ng build --prod --configuration=production
  aws s3 cp dist/orderin-host s3://orderin-ui-host/$VERSION --recursive
fi