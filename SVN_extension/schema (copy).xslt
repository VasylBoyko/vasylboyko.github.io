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
		<th>Description</th>
		<th width = "50" style="width: 50px">Revision</th>
		<th width = "80" style="width: 50px">Date</th>
	</tr>
	<xsl:for-each select="log/logentry">
		<xsl:sort select="date"/>
		<xsl:if test="author='UKEESS\vboyko'">
			<tr title="asfasdf">
				<xsl:attribute name="title">
					<xsl:for-each select="paths/path">
						<xsl:value-of select="@action"/> - <xsl:value-of select="."/><xsl:text>
</xsl:text>
					</xsl:for-each>
				</xsl:attribute>
				<td><xsl:value-of select="msg"/></td>
				<td class="nowrap"><xsl:value-of select="substring (date,6,5)"/></td>
				<td>
					<a href="http://bank:8080/VersionControl/Changeset.aspx?artifactMoniker={@revision}&amp;webView=true"><xsl:value-of select="@revision"/></a>
				</td>
				<!--td><xsl:value-of select="author"/></td-->
			</tr>
		</xsl:if>
	</xsl:for-each>
</table>
</div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
