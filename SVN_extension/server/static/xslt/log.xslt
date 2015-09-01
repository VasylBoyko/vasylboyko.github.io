<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<div class="content">
<table width="100%">
	<tr>
		<th width = "50" style="width: 50px">Revision</th>
		<th width = "80" style="width: 50px">Date</th>
		<th width = "110" style="width: 110px">User</th>
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
</xsl:template>
</xsl:stylesheet>
