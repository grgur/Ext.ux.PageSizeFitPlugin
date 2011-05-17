/*
Ext.create('Ext.PagingToolbar', {
    store: store,
    displayInfo: true,
    displayMsg: 'Displaying topics {0} - {1} of {2}',
    emptyMsg: "No topics to display",
	id: 'pt',
	plugins: [
		{
            ptype: 'pagingfit',
            testRows: 1,
            pluginId: 'pagingfit'
        }
	]
})*/


Ext.define('Ext.ux.PagingFitPlugin', {
	extend: 'Ext.AbstractPlugin',
    alias: 'plugin.pagingfit',
	
	/* config properties */
	
	forceReCheck: false,

	/* private properties*/ 
	
	grid: null,
	
	pagingTb: null,
	
	store: null,
	
	testRows: 1,
	
	singleRowHeight: 0,
	
	originalPageSize: 0,
	
	previousPageSize: 0,
	
	viewHeight: 0,
	
	constructor: function(config) {
        this.callParent(arguments);
        var testRows   			= this.testRows,
            pagingTb   			= this.getCmp(),
			store				= pagingTb.store;
			
		this.pagingTb 	= pagingTb;
		this.originalPageSize = store.pageSize;
		this.store = store;
		
		store.pageSize = this.previousPageSize = testRows;
		
		pagingTb.on('afterrender', this.initialCalculation, this);
		
		if (this.forceReCheck) store.on('load', this.forcedReCheck, this);
					
    },

	initialCalculation: function() {
		this.store.load({
			scope:this,
			callback: this.setOptimumPageSize
		});
	},
	
	forcedReCheck: function() {
		 this.setOptimumPageSize(true);
	},
	
	setOptimumPageSize: function(force) {
		var store = this.store;
		if (!this.singleRowHeight || force) this.singleRowHeight = this.calcSingleRowHeight();
		if (!this.viewHeight || force) this.viewHeight = this.calcViewHeight();
		
		var newPageSize = this.calcNumRows();
	
		if (newPageSize != this.previousPageSize) {
			console.log (newPageSize ,'!=', this.previousPageSize);
			
			store.pageSize = newPageSize;
			this.previousPageSize = newPageSize;
			store.load();
		} else console.log (newPageSize,'=', this.previousPageSize)
			
	},
	
	calcSingleRowHeight: function() {
		var grid = this.pagingTb.ownerCt,
			view = grid.getView().el,
			store = this.store,
			firstRow = view.down('table');
		
		return firstRow?firstRow.getHeight():2000;
	},
	
	calcViewHeight: function(){
		var grid = this.pagingTb.ownerCt,
			view = grid.getView().el;

		return view.getHeight();
	},
	
	calcNumRows: function() {
		return Math.floor(this.viewHeight / this.singleRowHeight);
	}
});