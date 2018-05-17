sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
],	function (Controller, MessageToast, JSONModel) {
	"use strict";
	
	var oModel;

	return Controller.extend("dirk.gears.controller.App", {
		onInit : function () {
      		// get "gears" Model which is defined in manifest and wait until the model data is loaded
			var oGearsModel = this.getOwnerComponent().getModel("gears");
			oGearsModel.attachRequestCompleted( function(evt) {
				this.onAllDataIsReady();
    		}.bind(this));

    	},
      
      // this function is called when the "gears" models has been loaded
    	onAllDataIsReady: function(){
        	//console.log("Gears Model loaded");
        	
	      	// get gearing data from URL parameters
	      	var sGears 			= jQuery.sap.getUriParameters().get("GR");
	      	var sChainrings	 	= jQuery.sap.getUriParameters().get("KB");
	      	var sCogs 			= jQuery.sap.getUriParameters().get("RZ");
	      	var sCircumference 	= jQuery.sap.getUriParameters().get("UF");
	      	var sGears2 		= jQuery.sap.getUriParameters().get("GR2");
	      	var sChainrings2 	= jQuery.sap.getUriParameters().get("KB2");
	      	var sCogs2 			= jQuery.sap.getUriParameters().get("RZ2");
	      	var sCircumference2 = jQuery.sap.getUriParameters().get("UF2");
	      	var sCadence		= jQuery.sap.getUriParameters().get("TF");
	      	var sChainAngle 	= jQuery.sap.getUriParameters().get("SL");
	      	var sUnits			= jQuery.sap.getUriParameters().get("UN");
	      	
        	// get Ratios of Hubs and tire names from Gears.jason as choosen in URL
        	var aHubData = this.getView().getModel("gears").getProperty("/HubData");
			for (var i in aHubData ){
		      	if (aHubData[i].id == sGears){
		      		var aRatios = aHubData[i].ratios;
		      		var sHubName = aHubData[i].name; 
		      	}
		      	if (aHubData[i].id == sGears2){
					var aRatios2 = aHubData[i].ratios;
		      		var sHubName2 = aHubData[i].name; 
		      	}
			}
			var aTireData = this.getView().getModel("gears").getProperty("/TireSizes");
			for ( i in aTireData ){
		      	if (aTireData[i].size.toString() == sCircumference){
		      		var sTireName = aTireData[i].inch +"/" + aTireData[i].ETRTO;
		      	}
		      	if (aTireData[i].size.toString() == sCircumference2){
					var sTireName2 = aTireData[i].inch +"/" + aTireData[i].ETRTO;
		      	}
			}
			
			
	         var oGearingData = {
	            gearData : {
	            	chainrings : (sChainrings !== null)? sChainrings.split(",").map(Number) : [22,36],
	            	cogs : (sCogs !== null)? sCogs.split(",").map(Number) : [11,12,14,16,18,21,24,28,32,36],
	            	hubId : (sGears !== null) ? sGears : "DERS",
	            	name : (sGears !== null) ? sHubName : "",
	            	minRatio : 0.0,
	            	ratios: (sGears !== null) ? aRatios : [1.0],
	            	tireName: (sTireName)? sTireName : "27,5/2215",
	            	circumference : (sCircumference !== null)? Number(sCircumference) : 2215,
	            	cadence : (sCadence !== null)? Number(sCadence) : 90
	            },
	            gearData2 : {
	            	chainrings : (sChainrings2 !== null)? sChainrings2.split(",").map(Number) : [30],
	            	cogs : (sCogs2 !== null)? sCogs2.split(",").map(Number) : [10,12,14,16,18,21,24,28,32,36,42],
	            	hubId : (sGears2 !== null) ? sGears2 : "DERS",
	            	name : (sGears2 !== null) ? sHubName2 : "",
	            	minRatio : 0.0,
	            	ratios: (sGears2 !== null) ? aRatios2 : [1.0],
	            	tireName: sTireName2,
	            	circumference : (sCircumference2 !== null)? Number(sCircumference2) : 2215,
	            	cadence : (sCadence !== null)? Number(sCadence) : 90
	            },
	            displayData :{
	            	maxChainAngle : 2.5,
	            	displayValueId : "teeth",
	            	displayValues : [
	            		{id : "teeth", name : "Teeth"},
	            		{id : "development", name : "Development"},
	            		{id : "gearInches", name : "Gear Inches"},
	            		{id : "ratio", name : "Ratio"},
	            		{id : "speed", name : "Speed"}
	            	],
	            	unitsIndex : 0,
	            	compare : (sGears2 !== null)
	            }
	         };
	         oModel = new JSONModel(oGearingData);
	         oModel.getURL = function(){
	         	var url = "http://www.ritzelrechner.de/"
	        	+ "?GR=" + oModel.oData.gearData.hubId
	        	+ "&KB=" + oModel.oData.gearData.chainrings 
	        	+ "&RZ=" + oModel.oData.gearData.cogs
	        	+ "&UF=" + oModel.oData.gearData.circumference
	        	+ "&TF=" + oModel.oData.gearData.cadence
	        	+ "&SL=" + oModel.oData.displayData.maxChainAngle;
	        	if (oModel.oData.displayData.compare){
	        		url = url 
	        		+ "&GR2=" + oModel.oData.gearData2.hubId
	        		+ "&KB2=" + oModel.oData.gearData2.chainrings 
	        		+ "&RZ2=" + oModel.oData.gearData2.cogs
	        		+ "&UF2=" + oModel.oData.gearData2.circumference;
	        	}
	        	return url;
	         };

	         this.getView().setModel(oModel);
	         
	         // set the initially selected tire size
	         //this.getView().byId("selectTires").setSelectedKey(2215);
	         //this.getView().byId("selectGears").setSelectedKey("DERS");
	         
	         // set binding context initially to first set of gears for whole page
	         this.context = oModel.createBindingContext("/gearData");
	         this.getView().byId("gearCalculatorPage").setBindingContext(this.context);
		     this.getView().byId("selectTires").setSelectedKey(oModel.oData.gearData.circumference);
	         
	         // register custom controls for automatic repainting after resizing
	         var fRepaint = function(oEvent){
				var resizeTargetCtrl = oEvent.control;
				resizeTargetCtrl.repaint();
				};
	         sap.ui.core.ResizeHandler.register( this.getView().byId("gearGraphics"), fRepaint );
			 sap.ui.core.ResizeHandler.register( this.getView().byId("gearGraphics2"), fRepaint );
	         sap.ui.core.ResizeHandler.register( this.getView().byId("chainringControls"), fRepaint );
	         sap.ui.core.ResizeHandler.register( this.getView().byId("cogControls"), fRepaint );
        
    	     this.getView().byId("showURL").setValue(oModel.getURL());

    	},
    	
		onGearSelected: function(oEvent) {
			var obj = oEvent.getParameter("selectedItem").getBindingContext("gears").getObject();
			oModel.getObject("", this.context).ratios = obj.ratios;
			oModel.getObject("", this.context).name = obj.name;
			oModel.getObject("", this.context).minRatio = obj.minRatio;
			oModel.getObject("", this.context).chainrings = [obj.defCr];
			oModel.getObject("", this.context).cogs = [obj.defCog];
	        this.getView().byId("showURL").setValue(oModel.getURL());
		},
		
		onTireSizeSelected: function(oEvent) {
			var obj = oEvent.getParameter("selectedItem").getBindingContext("gears").getObject();
			oModel.getObject("", this.context).circumference = obj.size;
			oModel.getObject("", this.context).tireName = obj.inch + "/" + obj.ETRTO + " " + obj.description;
	        this.getView().byId("showURL").setValue(oModel.getURL());
		},
		
		onChainringSetSelected: function(oEvent) {
			var obj = oEvent.getParameter("selectedItem").getBindingContext("gears").getObject();
			oModel.getObject("", this.context).chainrings = obj.set;
	        this.getView().byId("showURL").setValue(oModel.getURL());
		},
		
		onCogSetSelected: function(oEvent) {
			var obj = oEvent.getParameter("selectedItem").getBindingContext("gears").getObject();
			oModel.getObject("", this.context).cogs = obj.set;
	        this.getView().byId("showURL").setValue(oModel.getURL());
		},
		
		onCadenceSelected: function(oEvent) {
			oModel.getObject("", this.context).cadence = oEvent.getParameter("value");
	        this.getView().byId("showURL").setValue(oModel.getURL());
		},
		
		onChangeCircumference: function(oEvent) {
			var circumference = oEvent.getParameter("value");
			var cCode = circumference.charCodeAt(0);
/*			if (circumference.length === 4){
				oModel.getObject("", this.context).circumference = parseInt(circumference);
				oModel.getObject("", this.context).tireSize = circumference;
				oModel.getObject("", this.context).tireName = circumference;
	        	this.getView().byId("showURL").setValue(oModel.getURL());
			}
*/		},
		
		onMaxChainAngleSelected: function(oEvent) {
			oModel.getObject("/displayData").maxChainAngle = oEvent.getParameter("value");
	        this.getView().byId("showURL").setValue(oModel.getURL());
		},
		
		onChainringChange: function(oEvent) {
	        this.getView().byId("showURL").setValue(oModel.getURL());
		},
		
		onCogChange: function(oEvent) {
	        this.getView().byId("showURL").setValue(oModel.getURL());
		},
		
		onGraphicsSelected: function(oEvent) {
			if (oModel.oData.displayData.compare){

				// check which gearGraphics control has been clicked
				var sControlId = oEvent.getSource().getId();
				//oEvent.getSource().addStyleClass("selectedGraphics");
				if ( sControlId.search("gearGraphics2") > 0){
	        		this.context = this.getView().getModel().createBindingContext("/gearData2");
	        		this.getView().byId("gearGraphics").removeStyleClass("selectedGraphics");
	        		this.getView().byId("gearGraphics2").addStyleClass("selectedGraphics");
				}else{
	        		this.context = this.getView().getModel().createBindingContext("/gearData");
	        		this.getView().byId("gearGraphics").addStyleClass("selectedGraphics");
	        		this.getView().byId("gearGraphics2").removeStyleClass("selectedGraphics");
				}
		        this.getView().byId("gearCalculatorPage").setBindingContext(this.context);
	    	    this.getView().byId("showURL").setValue(oModel.getURL());
			}
		},
		

		// compare button is pressed.
		// Either second graphics appears gets focus and controls are set to second data set (gearData2)
		// or second graphics is switched off, first graphic gets focus and controls are set to first data set (gearData)
		onPress: function(oEvent) {
			if (oModel.oData.displayData.compare){
				oModel.oData.gearData2.hubId = oModel.oData.gearData.hubId;
				oModel.oData.gearData2.ratios = oModel.oData.gearData.ratios;
				oModel.oData.gearData2.minRatio = oModel.oData.gearData.minRatio;
				oModel.oData.gearData2.chainrings = oModel.oData.gearData.chainrings;
				oModel.oData.gearData2.cogs = oModel.oData.gearData.cogs;
				oModel.oData.gearData2.circumference = oModel.oData.gearData.circumference;
				oModel.oData.gearData2.tireName = oModel.oData.gearData.tireName;
				this.getView().byId("gearGraphics2").addStyleClass("selectedGraphics");
				this.context = this.getView().getModel().createBindingContext("/gearData2");
			}
			else {
				this.getView().byId("gearGraphics").removeStyleClass("selectedGraphics");
				this.context = this.getView().getModel().createBindingContext("/gearData");
			}
		    this.getView().byId("gearCalculatorPage").setBindingContext(this.context);
	    	this.getView().byId("showURL").setValue(oModel.getURL());
		}
		
	});
});