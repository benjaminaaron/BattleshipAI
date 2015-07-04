var GraphmlExporter = function(nodes){
	this.nodes = nodes;
	this.doExport();
};

GraphmlExporter.prototype = {

	doExport: function(){
		var content = "<graphml xmlns=\"http://graphml.graphdrawing.org/xmlns\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:y=\"http://www.yworks.com/xml/graphml\" xmlns:yed=\"http://www.yworks.com/xml/yed/3\" xsi:schemaLocation=\"http://graphml.graphdrawing.org/xmlns http://www.yworks.com/xml/schema/graphml/1.1/ygraphml.xsd\">"
        	+ "\t<key attr.name=\"description\" attr.type=\"string\" for=\"node\" id=\"d5\"/>"
        	+ "\t<key for=\"node\" id=\"d6\" yfiles.type=\"nodegraphics\"/>"
        	+ "\t<key attr.name=\"description\" attr.type=\"string\" for=\"edge\" id=\"d9\"/>"
        	+ "\t<key for=\"edge\" id=\"d10\" yfiles.type=\"edgegraphics\"/>"
        	+ "<graph>";

        var edgeCounter = 0;
        for(i in this.nodes){
          	var node = this.nodes[i];
           	content += this.getNodeCode(node.ID, node.getLabel(), '#FFCC00');
            if(node.parent != null)
                content += this.getEdgeCode(edgeCounter ++, node.parent.ID, node.ID, '');
        }

        content += "</graph>\n</graphml>";
        download('graph_' + this.nodes.length + '.graphml', content);
	},

	getNodeCode: function(ID, label, color){
		return "<node id=" + '"' + ID + '"' + ">" +
                "<data key=\"d5\"><![CDATA[Node ID: " + ID + "]]></data>" +
                "<data key=\"d6\">" +
                "<y:ShapeNode><y:Fill hasColor=\"false\" transparent=\"false\"/>" +
                "<y:BorderStyle hasColor=\"false\" type=\"line\" width=\"1.0\"/>" +
                "<y:NodeLabel fontFamily=\"Courier New\" textColor=\"#000000\">" + label + "</y:NodeLabel>" +
                "<y:Shape type=\"ellipse\"/></y:ShapeNode></data></node>";
	},

	getEdgeCode: function(ID, parentID, childID, edgelabel){
		return 	"<edge id=" + '"' + ID + '"' + " source=" + '"' + parentID + '"' + " target=" + '"' + childID + '"' + ">" +
                "<data key=\"d9\"><![CDATA[Edge ID: " + ID + "]]></data>" +
                "<data key=\"d10\"><y:BezierEdge>" +
                "<y:LineStyle color=\"#C0C0C0\" type=\"line\" width=\"1.0\"/>" +
                "<y:Arrows source=\"none\" target=\"standard\"/>" +
                "<y:EdgeLabel>" + edgelabel + "</y:EdgeLabel>" +
                "</y:BezierEdge></data></edge>";
	}
    
};
