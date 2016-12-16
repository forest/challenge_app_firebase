echo '=== Starting build (prod) ==='
au build --env prod
echo '=== Packing for distribution ==='
au dist
echo '=== Deploy to firebase ==='
# firebase deploy