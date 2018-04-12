projectname=$(basename $PWD)
echo $projectname
echo "+++++++++xcode file reference+++++++++"
ruby tools/xcodeFileManager.rb ../ios $projectname add $projectname/song.ttf ../resource/song.ttf
ruby tools/xcodeFileManager.rb ../ios $projectname del Libraries
ruby tools/xcodeFileManager.rb ../ios $projectname del $projectname/main.jsbundle
ruby tools/xcodeFileManager.rb ../ios $projectname script SetIP  "ip=\$(ifconfig | grep 'inet 10.' | head -1 | cut -d \" \" -f 2)+--+if [ ! -f ip.txt ]; then+--+touch ip.txt+--+ruby ../tools/xcodeFileManager.rb ../ios $projectname add ip.txt+--+fi+--+echo \$ip >ip.txt" 0
