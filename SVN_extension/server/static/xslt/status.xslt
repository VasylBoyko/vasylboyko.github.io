<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<table width="100%">
	<tr>
		<th width = "20" style="width: 20px; text-align:center;"></th>
		<th width = "50" style="width: 50px">status</th>
		<th width = "*">path</th>
	</tr>
	<xsl:for-each select="status/*">
		<xsl:for-each select="entry">
			<xsl:if test="wc-status/@item!='unversioned'">
				<tr data-file="{@path}">
					<td><input type="checkbox" /></td>
					<td><xsl:value-of select="wc-status/@item"/></td>
					<td>
						<xsl:value-of select="substring-after(@path,'/home/vb/projects/samsung/trunk/client/')"/>
					</td>
				</tr>
			</xsl:if>
		</xsl:for-each>
	</xsl:for-each>
</table>
</xsl:template>
</xsl:stylesheet>