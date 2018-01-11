require 'xcodeproj' 
require 'find'

# 用于向xcode中引入或者移除文件。特点：主要格式的文件(夹)基本都支持；不强制实际路径与xcode中的路径相同；递归引入文件夹，并且移除时会清除内容为空的gruop
# 引入文件(夹)：支持后缀为".h", ".m", ".mm", ".cpp"的源文件，支持引入资源文件，支持引入后缀为".a", ".framework", ".bundle", ".xcodeproj"的文件及文件夹。
# 移除文件(夹)：暂未发现不支持的情况
# usage: ruby xcodeFileManager.rb 工程xcodeproj文件根目录 工程xcodeproj文件名 add/del 引入/移除文件(夹)在xcode中的路径 要引入的文件(夹)的真实路径与工程xcodeproj文件根目录的相对路径 引入文件的编译参数
# add: 5个必备+2个可选参数 后两个参数顺序固定，可酌情为空或者使用占位符%s
# del: 5个必备参数
# e.g.:
# ruby xcodeFileManager.rb /Users/zhaosong/Desktop/RnInit/ios RnInit add songOut.m
# ruby xcodeFileManager.rb /Users/zhaosong/Desktop/RnInit/ios RnInit add song
# ruby xcodeFileManager.rb /Users/zhaosong/Desktop/RnInit/ios RnInit add song/song.m
# ruby xcodeFileManager.rb /Users/zhaosong/Desktop/RnInit/ios RnInit add song/songsong
# ruby xcodeFileManager.rb /Users/zhaosong/Desktop/RnInit/ios RnInit add song/songsong/song.m
# ruby xcodeFileManager.rb /Users/zhaosong/Desktop/RnInit/ios RnInit add RnInit/song/songsong/songsong.m song/songsong/songsong.m
# ruby xcodeFileManager.rb /Users/zhaosong/Desktop/RnInit/ios RnInit add songOut.m  %s  -fno-objc-arc
# ruby xcodeFileManager.rb /Users/zhaosong/Desktop/RnInit/ios RnInit add Libraries/RCTActionSheet.xcodeproj  ../node_modules/react-native/Libraries/ActionSheetIOS/RCTActionSheet.xcodeproj

# ruby xcodeFileManager.rb /Users/zhaosong/Desktop/RnInit/ios RnInit del songOut.m
# ruby xcodeFileManager.rb /Users/zhaosong/Desktop/RnInit/ios RnInit del song
# ruby xcodeFileManager.rb /Users/zhaosong/Desktop/RnInit/ios RnInit del song/song.m
# ruby xcodeFileManager.rb /Users/zhaosong/Desktop/RnInit/ios RnInit del song/songsong
# ruby xcodeFileManager.rb /Users/zhaosong/Desktop/RnInit/ios RnInit del song/songsong/song.m

$project_root = ARGV[0] #工程文件根目录在文件系统中绝对路径
$project_path = ARGV[1]+".xcodeproj" #工程文件名(无后缀)
$command = ARGV[2] #add/del
$file_path = ARGV[3] #在工程中的引入路径
$relative_path = ARGV[4] #要引入的文件或文件夹的真实路经与工程目录相对路径, 可为空或使用%s
$compile_flag = ARGV[5] #编译参数，e.g.:-fno-objc-arc , 可为空或使用%s

# 获取路径最后一个元素
def get_single_name(file_path)
	arrayf = file_path.split("/")
	result = arrayf[-1]
	puts "文件(夹)名:" + result
	return result
end

$absolute_path = File.expand_path($relative_path && $relative_path != "%s"? $relative_path : get_single_name($file_path), $project_root) ##要引入的文件或文件夹的真实路径
puts "absolute_path:"+$absolute_path

$project = Xcodeproj::Project.open($project_root+"/"+$project_path) 
$target = $project.targets.first

# 获取要引入的文件(夹)在xcode中目录路径
def get_group_from_path(file_path)
	arrayf = file_path.split("/")
	result = ""

	single_name = get_single_name(file_path)
	real_path = $absolute_path
	puts "引入文件(夹)在xcode中的目录路径:" + file_path
	puts "引入文件(夹)对应的真实路径:" + real_path
	if $command == "add" then
		if File.exist?(real_path) then
			if File.ftype(real_path) == "directory" then
				return file_path
			else
				if file_path.length > single_name.length then
					result = file_path[0, file_path.length - single_name.length]
					puts "获取到的文件的目录路径:" + result.chop
				else
					puts "要引入的文件将置于xcode工程根目录下"
					return nil
				end
			end 
		else
			abort("error:要引入的文件或文件夹并不存在")
		end 
	elsif $command == "del" then
		arrayf.each do |key|
			if key != "" && key != arrayf[-1]
				result += key + "/"
			end
		end
	end
	return result.chop==''? nil:result.chop
end

# 获取上级目录
def get_parent_folder(file_path)
	single_name = get_single_name(file_path)

	if file_path.length > single_name.length then
		result = file_path[0, file_path.length - single_name.length]
		puts file_path+"的父目录:" + result.chop
	else
		puts file_path+"没有父目录"
		return nil
	end
	return result.chop
end

# 引入单个文件 
def addBuildPhaseFile(group, file_path) 
	if file_path.end_with?(".framework", ".a", ".bundle") then
		puts "引入的是.framework/.a/.bundle"
		file_ref = $project.frameworks_group.new_file(file_path)
	else
		file_ref = group.new_reference(file_path)
	end
	if file_ref.real_path.to_s.end_with?(".h", ".m", ".mm", ".cpp") then  
		if !$compile_flag || $compile_flag == '%s' # nil
			puts "  |++#{file_ref.real_path.to_s}(source)" 
			$target.add_file_references([file_ref])
		else
			puts "  |++#{file_ref.real_path.to_s}(source)(#{$compile_flag})" 
			$target.add_file_references([file_ref], $compile_flag)
		end
	elsif file_ref.real_path.to_s.end_with?(".framework", ".a") then
		$target.frameworks_build_phases.add_file_reference(file_ref)
	elsif file_ref.real_path.to_s.end_with?(".bundle") then
		$target.resources_build_phase.add_file_reference(file_ref)
	else
		puts "  |++#{file_ref.real_path.to_s}(resource)" 
		$target.add_resources([file_ref])
	end
end

# 递归引入文件夹中的文件
def addBuildPhaseFilesRecursively(group) 
	puts "[+#{group.real_path}:#{group.hierarchy_path}"
	# Dir.entries(group.real_path).each do |sub|   
	Dir.foreach(group.real_path) do |sub|
		file_path = File.join(group.real_path, sub)
		# 除.DS_Store以外的文件
		if !File.directory?(file_path) && sub != ".DS_Store" then
			addBuildPhaseFile(group, file_path)
		# 目录情况下, 递归添加
		elsif File.directory?(file_path) && sub != '.' && sub != '..' then
			if file_path.end_with?(".framework", ".bundle", ".xcodeproj") then
				puts "引入的是.framework/.bundle/.xcodeproj，按文件处理"
				addBuildPhaseFile(group, file_path)
			else
				hierarchy_path = group.hierarchy_path[1, group.hierarchy_path.length] 
				sub_group = $project.main_group.find_subpath(hierarchy_path + '/' + sub, true)
				sub_group.set_source_tree(group.source_tree)
				sub_group.set_path(group.real_path + sub)
				addBuildPhaseFilesRecursively(sub_group)
			end
		end
	end  
end

# 删除单个文件引用 
def removeBuildPhaseFile(file_ref) 
	if file_ref.real_path.to_s.end_with?(".h", ".m", ".mm", ".cpp") then  
		puts "  |--#{file_ref.real_path.to_s}(source)" 
		$target.source_build_phase.remove_file_reference(file_ref)  
	else
		puts "  |--#{file_ref.real_path.to_s}(resource)" 
		$target.resources_build_phase.remove_file_reference(file_ref)
	end
	file_ref.remove_from_project
end

# 递归删除文件夹 
def removeBuildPhaseFilesRecursively(group)  
	puts "[-#{group.real_path.to_s}]"
	group.files.each do |file|  
		removeBuildPhaseFile(file)
    end  
      
    group.groups.each do |sub_group|  
		removeBuildPhaseFilesRecursively(sub_group)  
	end  

	group.clear
	group.remove_from_project
end

# 主流程
if $command == "add"
	group_path = get_group_from_path($file_path)

	if File.directory?($absolute_path) then
		if group_path.end_with?(".framework", ".bundle") then
			puts "引入的是.framework/.bundle，按文件处理"
			addBuildPhaseFile(nil, $absolute_path)
		elsif group_path.end_with?(".xcodeproj") then
			puts "引入的是.xcodeproj，按文件处理"
			group = $project.main_group.find_subpath(get_parent_folder(group_path), true) 
			group.set_source_tree('SOURCE_ROOT') 
			puts "在#{group.hierarchy_path}下引入文件"
			addBuildPhaseFile(group, $absolute_path)
		else
			group = $project.main_group.find_subpath(group_path,true)
			group.set_source_tree('<group>')
			group.set_path($absolute_path)
			puts "在#{group.hierarchy_path}下引入文件夹"
			addBuildPhaseFilesRecursively(group) 
		end
	else
		group = $project.main_group.find_subpath(group_path,true) 
		group.set_source_tree('SOURCE_ROOT') 
		puts "在#{group.hierarchy_path}下引入文件"
		addBuildPhaseFile(group, $absolute_path)
	end  

elsif $command == "del"
	group = $project.main_group.find_subpath($file_path,false) 

	if group.kind_of? Xcodeproj::Project::Object::PBXFileReference then
		puts "xcode中移除文件夹#{group.hierarchy_path}"
		removeBuildPhaseFile(group)
	else 
		group.set_source_tree('SOURCE_ROOT')
		puts "xcode中移除文件#{group.hierarchy_path}"
		removeBuildPhaseFilesRecursively(group) 
	end  

	# 父目录为空时移除
	parent = get_parent_folder($file_path)
	while parent 
		group = $project.main_group.find_subpath(parent,false)
		if !group then
			break
		end
		if group.empty? then 
			puts "因已空，移除group:"+group.hierarchy_path
			group.clear
			group.remove_from_project
		else
			break
		end
		parent = get_parent_folder($file_path)
	end
else
	puts "!引入使用add，移除使用del!"
end

$project.save

puts $project_path + " " + $command + " " + $file_path + " success"