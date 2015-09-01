<!DOCTYPE html>
<html>
<head>
	<script src="js/libs/app.js"></script>
	<link rel="stylesheet" type="text/css" href="css/common.css">
</head>
<body>
	<pre><?php
			//$cmd = 'svn status --xml';
			//$cmd = 'ipconfig /all';
			$cmd = 'svn status /home/vb/projects/samsung --xml';
			echo exec($cmd, $output);
			echo htmlspecialchars(implode("\n", $output));
			//var_dump($output);
			
		?></pre>
</body>
</html>
