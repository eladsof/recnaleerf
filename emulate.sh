echo "Emulating..."
#sudo ionic build ios
#sudo chmod -R 777 /Users/eladsof/projects/tstionic/platforms/ios
cd ./platforms/ios/build/emulator
var=$(pwd)
 
ios-sim launch "$var"/*.app --devicetypeid "com.apple.CoreSimulator.SimDeviceType.iPhone-6, 8.0"
