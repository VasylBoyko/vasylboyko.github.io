<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<html>
<head>
<style>
	body
	{
		background-color: #ffffff;
	}
	.title{
	}
	.content{
		font-family: Verdana,Arial, Helvetica, sans-serif;
		font-size: 12px;
	}
	.content th{
		background-color: #F3F1E6;
		border: 0px;
		font-weight: normal;
		padding: 4 px;
		vertical-align: top;
	}
	.content td{    
		border-bottom: 1px solid #F3F1E6;
		border-top: 0px;
		padding: 4 px;
		vertical-align: top;
		font-family: Verdana,Arial, Helvetica, sans-serif;
		font-size: 12px;

	}
	.nowrap
	{
		white-space: nowrap;
	}
</style>
</head>
<body>
<div class="content">
<table width="100%">
	<tr>
		<th width = "50" style="width: 50px">Revision</th>
		<th width = "80" style="width: 50px">Date</th>
		<th width = "80" style="width: 50px">User</th>
		<th>Description</th>
	</tr>
	<xsl:for-each select="log/logentry">
		<!--xsl:sort select="date"/-->
		<xsl:if test="author!='azaza'">
			<tr title="asfasdf">
				<td><a href="{@revision}"><xsl:value-of select="@revision"/></a></td>
				<td class="nowrap"><xsl:value-of select="substring (date,6,5)"/></td>
				<td><xsl:value-of select="author"/></td>
				<td><xsl:value-of select="msg"/></td>
			</tr>
		</xsl:if>
	</xsl:for-each>
</table>
</div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
