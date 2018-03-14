# encoding: utf-8

require 'xcodeproj'
require 'find'
require 'pathname'

# 用于向xcode中引入或者移除文件。特点：主要格式的文件(夹)基本都支持；不强制实际路径与xcode中的路径相同；递归引入文件夹，并且移除时会清除内容为空的gruop；支持添加shell script到build phase，并且可以指定序号，沿用ruby的规则,e.g.:0最前面，-1最后面
# 引入文件(夹): 支持后缀为".h", ".m", ".mm", ".cpp"的源文件，支持引入资源文件，支持引入后缀为".a", ".framework", ".bundle", ".xcodeproj"的文件及文件夹。
# 移除文件(夹): 暂未发现不支持的情况
# 添加shell脚本: 脚本内容用引号包起来，$、\等字符用\转义，不同的行用+--+连接起来。默认添加到build phase最后。
# usage:
# add: ruby xcodeFileManager.rb(脚本名的相对路径) 工程xcodeproj文件所在目录相对本ruby脚本所在目录的相对路径 工程xcodeproj文件名 add 引入/移除文件(夹)在xcode中的路径 要引入的文件(夹)的真实路径与工程xcodeproj文件根目录的相对路径 引入文件的编译参数
# 4个必备+2个可选参数 后两个参数顺序固定，可酌情为空或者使用占位符%s
# del: ruby xcodeFileManager.rb(脚本名的相对路径) 工程xcodeproj文件所在目录相对本ruby脚本所在目录的相对路径 工程xcodeproj文件名 add 引入/移除文件(夹)在xcode中的路径
# 4个必备参数
# script: ruby xcodeFileManager.rb(脚本名的相对路径) 工程xcodeproj文件所在目录相对本ruby脚本所在目录的相对路径 工程xcodeproj文件名 script shell脚本名称 shell脚本内容 脚本在build phase中的位置
# 4个必备+2个可选参数

# e.g.:
# 本脚本和工程目录都不在当前目录的情况
# ruby tools/xcodeFileManager.rb ../ios $projectname add ip.txt

# 本脚本在当前目录，工程在ios文件夹中的情况
# ruby xcodeFileManager.rb ios RnInit add songOut.m
# ruby xcodeFileManager.rb ios RnInit add song
# ruby xcodeFileManager.rb ios RnInit add RnInit/song.m song/song.m
# ruby xcodeFileManager.rb ios RnInit add RnInit/song/songsong/songsong.m song/songsong/songsong.m
# ruby xcodeFileManager.rb ios RnInit add songOut.m  %s  -fno-objc-arc
# ruby xcodeFileManager.rb ios RnInit add Libraries/RCTActionSheet.xcodeproj  ../node_modules/react-native/Libraries/ActionSheetIOS/RCTActionSheet.xcodeproj

# ruby xcodeFileManager.rb ios RnInit del songOut.m
# ruby xcodeFileManager.rb ios RnInit del song
# ruby xcodeFileManager.rb ios RnInit del song/song.m
# ruby xcodeFileManager.rb ios RnInit del song/songsong
# ruby xcodeFileManager.rb ios RnInit del song/songsong/song.m

# ruby xcodeFileManager.rb ios RnInit script SetIP  "ip=\$(ifconfig | grep 'inet 10.' | head -1 | cut -d \" \" -f 2)+--+echo \$ip+--+sed -i \"\" '1 c\\'$'\\n'\$ip\$'\\n' ip.txt" -1

ruby_path = Pathname.new(__FILE__).realpath.to_s
puts "ruby_path:#{ruby_path}"

# 获取路径最后一个元素
def get_single_name(file_path)
	arrayf = file_path.split("/")
	result = arrayf[-1]
	# puts '文件(夹)名:' + result
	puts "文件(夹)名:#{result}"
	return result
end

# 获取上级目录
def get_parent_folder(file_path)
	single_name = get_single_name(file_path)
	single_name_length = single_name.length
	file_path_length = file_path.length
	if file_path_length > single_name_length
		result = file_path[0, file_path_length - single_name_length]
		puts file_path+"的父目录:" + result.chop
	else
		puts file_path+"没有父目录"
		return nil
	end
	return result.chop
end

# $project_root = ARGV[0] #工程文件根目录在文件系统中绝对路径
$project_root = File.expand_path(ARGV[0], get_parent_folder(ruby_path)) #工程文件根目录在文件系统中绝对路径
$project_path = ARGV[1]+".xcodeproj" #工程文件名(无后缀)
$command = ARGV[2] #add/del

if $command == 'script'
	$script_name = ARGV[3] #shell脚本名
	$script_content = ARGV[4] #shell脚本内容
	$build_phase_index = ARGV[5]? ARGV[5].to_i: -1 #shell脚本在build phase中的位置
else
	$file_path = ARGV[3] #在工程中的引入路径
	$relative_path = ARGV[4] #要引入的文件或文件夹的真实路经与工程目录相对路径, 可为空或使用%s
	$compile_flag = ARGV[5] #编译参数，e.g.:-fno-objc-arc , 可为空或使用%s
	$absolute_path = File.expand_path($relative_path && $relative_path != "%s"? $relative_path : get_single_name($file_path), $project_root) ##要引入的文件或文件夹的真实路径
	puts "absolute_path:"+$absolute_path
end

$project = Xcodeproj::Project.open($project_root+"/"+$project_path)
$target = $project.targets.first

# 获取要引入的文件(夹)在xcode中目录路径
# :reek:DuplicateMethodCall { allow_calls: ['result.chop'] }
def get_group_from_path(file_path)
	arrayf = file_path.split("/")
	result = ""

	single_name = get_single_name(file_path)
	real_path = $absolute_path
	puts "引入文件(夹)在xcode中的目录路径:" + file_path
	puts "引入文件(夹)对应的真实路径:" + real_path
	if $command == "add"
		if File.exist?(real_path)
			if File.ftype(real_path) == "directory"
				return file_path
			else
				file_path_length = file_path.length
				single_name_length = single_name.length
				if file_path_length > single_name_length
					result = file_path[0, file_path_length - single_name_length]
					puts "获取到的文件的目录路径:" + result.chop
				else
					puts "要引入的文件将置于xcode工程根目录下"
					return nil
				end
			end
		else
			abort("error:要引入的文件或文件夹并不存在")
		end
	elsif $command == "del"
		arrayf.each do |key|
			if key != "" && key != arrayf[-1]
				result += key + "/"
			end
		end
	end
	result = result.chop
	return result==''? nil:result
end

# 引入单个文件
def add_build_phase_file(group, file_path)
	if file_path.end_with?(".framework", ".a", ".bundle") then
		puts "引入的是.framework/.a/.bundle"
		file_ref = $project.frameworks_group.new_file(file_path)
	else
		file_ref = group.new_reference(file_path)
	end
	if file_ref.real_path.to_s.end_with?(".h", ".m", ".mm", ".cpp")
		if !$compile_flag || $compile_flag == '%s' # nil
			puts "  |++#{file_ref.real_path.to_s}(source)"
			$target.add_file_references([file_ref])
		else
			puts "  |++#{file_ref.real_path.to_s}(source)(#{$compile_flag})"
			$target.add_file_references([file_ref], $compile_flag)
		end
	elsif file_ref.real_path.to_s.end_with?(".framework", ".a")
		$target.frameworks_build_phases.add_file_reference(file_ref)
	elsif file_ref.real_path.to_s.end_with?(".bundle")
		$target.resources_build_phase.add_file_reference(file_ref)
	else
		puts "  |++#{file_ref.real_path.to_s}(resource)"
		$target.add_resources([file_ref])
	end
end

# 递归引入文件夹中的文件
def add_build_phase_files_recursively(group)
	puts "[+#{group.real_path}:#{group.hierarchy_path}"
	# Dir.entries(group.real_path).each do |sub|
	Dir.foreach(group.real_path) do |sub|
		file_path = File.join(group.real_path, sub)
		# 除.DS_Store以外的文件
		if !File.directory?(file_path) && sub != ".DS_Store"
			add_build_phase_file(group, file_path)
		# 目录情况下, 递归添加
		elsif File.directory?(file_path) && sub != '.' && sub != '..'
			if file_path.end_with?(".framework", ".bundle", ".xcodeproj")
				puts "引入的是.framework/.bundle/.xcodeproj，按文件处理"
				add_build_phase_file(group, file_path)
			else
				hierarchy_path = group.hierarchy_path[1, group.hierarchy_path.length]
				sub_group = $project.main_group.find_subpath(hierarchy_path + '/' + sub, true)
				sub_group.set_source_tree(group.source_tree)
				sub_group.set_path(group.real_path + sub)
				add_build_phase_files_recursively(sub_group)
			end
		end
	end
end

# 删除单个文件引用
def remove_build_phase_file(file_ref)
	if file_ref.real_path.to_s.end_with?(".h", ".m", ".mm", ".cpp")
		puts "  |--#{file_ref.real_path.to_s}(source)"
		$target.source_build_phase.remove_file_reference(file_ref)
	else
		puts "  |--#{file_ref.real_path.to_s}(resource)"
		$target.resources_build_phase.remove_file_reference(file_ref)
	end
	file_ref.remove_from_project
end

# 递归删除文件夹
def remove_build_phase_files_recursively(group)
	puts "[-#{group.real_path.to_s}]"
	group.files.each do |file|
		remove_build_phase_file(file)
    end

    group.groups.each do |sub_group|
		remove_build_phase_files_recursively(sub_group)
	end

	group.clear
	group.remove_from_project
end

# 主流程
if $command == "add"
	group_path = get_group_from_path($file_path)

	if File.directory?($absolute_path)
		if group_path.end_with?(".framework", ".bundle")
			puts "引入的是.framework/.bundle，按文件处理"
			add_build_phase_file(nil, $absolute_path)
		elsif group_path.end_with?(".xcodeproj")
			puts "引入的是.xcodeproj，按文件处理"
			group = $project.main_group.find_subpath(get_parent_folder(group_path), true)
			group.set_source_tree('SOURCE_ROOT')
			puts "在#{group.hierarchy_path}下引入文件"
			add_build_phase_file(group, $absolute_path)
		else
			group = $project.main_group.find_subpath(group_path,true)
			group.set_source_tree('<group>')
			group.set_path($absolute_path)
			puts "在#{group.hierarchy_path}下引入文件夹"
			add_build_phase_files_recursively(group)
		end
	else
		group = $project.main_group.find_subpath(group_path,true)
		group.set_source_tree('SOURCE_ROOT')
		puts "在#{group.hierarchy_path}下引入文件"
		add_build_phase_file(group, $absolute_path)
	end
	puts $project_path + " " + $command + " " + $file_path + " success"
elsif $command == "del"
	group = $project.main_group.find_subpath($file_path,false)

	if group.kind_of? Xcodeproj::Project::Object::PBXFileReference
		puts "xcode中移除文件夹#{group.hierarchy_path}"
		remove_build_phase_file(group)
	else
		group.set_source_tree('SOURCE_ROOT')
		puts "xcode中移除文件#{group.hierarchy_path}"
		remove_build_phase_files_recursively(group)
	end

	# 父目录为空时移除
	parent = get_parent_folder($file_path)
	while parent
		group = $project.main_group.find_subpath(parent,false)
		if !group
			break
		end
		if group.empty?
			puts "因已空，移除group:"+group.hierarchy_path
			group.clear
			group.remove_from_project
		else
			break
		end
		parent = get_parent_folder($file_path)
	end
	puts $project_path + " " + $command + " " + $file_path + " success"
elsif $command == "script"
	shell_script_phase = $target.new_shell_script_build_phase($script_name)
	array = $script_content.split('+--+')
	whole_script = nil
	array.each do |script|
	  if whole_script
		whole_script = "#{whole_script}\n#{script}"
	  else
		whole_script = script
	  end
	end
	whole_script = whole_script.chomp
	puts "要添加的shell script名:#{$script_name}"
	puts "shell script 内容:#{whole_script}"
	shell_script_phase.shell_script = whole_script
	build_phase = $target.build_phases
	new_script = build_phase.pop
	build_phase.insert($build_phase_index, new_script)
	puts $project_path + " " + $command + " " + $script_name + " success"
else
	puts "!引入使用add，移除使用del!"
end

$project.save
