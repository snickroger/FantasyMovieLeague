yarn && yarn run tsc
if [ $? -ne 0 ]; 
then
  mkdir -p dist/views
  mkdir -p dist/public
  cp -r src/views/** dist/views
  cp -r src/public/** dist/public
fi