echo "Emulating..."
sudo ionic build ios
cd ./platforms/ios/build/emulator
var=$(pwd)
 
sudo ios-sim launch "$var"/*.app
#--devicetypeid "com.apple.CoreSimulator.SimDeviceType.iPhone-6, 8.0"
