<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<html>
<head>
<style>
	body, table
	{
		background-color: #ffffff;
		font-size: 12px;
		font-weight: normal;
		font-family: Verdana,Arial, Helvetica, sans-serif;
	}
	.title{
	}
	.content{
		
		font-size: 12px;
	}
	.content th{
		background-color: #F3F1E6;
		border: 0px;
		line-height: 18px;
	}
	.content td{    
		border-bottom: 1px solid #F3F1E6;
		border-top: 0px;
		line-height: 18px;
		vertical-align: top;
	}
	.nowrap	{
		white-space: nowrap;
	}
</style>
<script>
	var openInNewTab=false,
	    winparams = openInNewTab ? "" : "menubar=0,location=0,resizable=1, width=200,toolbar=0";
	function showDiff(ev){
		window.open("http://localhost:7777/diff?filename="+encodeURIComponent(ev.target.innerHTML), "Diff", winparams);
	}

	function showLogs(ev){
		window.open("http://localhost:7777/logs?filename="+encodeURIComponent(ev.target.nextElementSibling.innerHTML), "Logs", winparams);
	}
</script>
</head>
<body>
<div class="content">
<table width="100%">
	<tr>
		<th width = "20" style="width: 20px; text-align:center;"></th>
		<th width = "50" style="width: 50px">status</th>
		<th width = "*">path</th>
	</tr>
	<xsl:for-each select="status/target">
		<xsl:for-each select="entry">
			<xsl:if test="wc-status/@item!='unversioned'">
				<tr>
					<td><input type="checkbox" /></td>
					<td onclick="showLogs(event)"><xsl:value-of select="wc-status/@item"/></td>
					<td onclick="showDiff(event)"><xsl:value-of select="@path"/></td>
				</tr>
			</xsl:if>
		</xsl:for-each>
	</xsl:for-each>
</table>
<div><button>Commit</button><button>Revert</button></div>
</div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
