
// MUST CREATE 'admin' username from UI BEFORE this scripts

/********** print db connected and collections in db   *************/
//print(db);
//printjson(db.getCollectionNames());

/****** update users only admin we add the admin role *************/
db.users.update({username:"admin"},{$push:{roles:"admin"}});

/****** add 2 roles of user and admin *******/
db.roles.insert({
	roleName: "user"
});


db.roles.insert({
	roleName: "admin"
});

/******* add pages to the pages *********/
db.pages.insert({
	pageName: "Game Types",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Daily Report",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Games",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Serials",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Operations Overview",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Food Operations",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Table Details",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Suppliers",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Customers",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Barcodes",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Roles",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Users Management",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Page Management",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Categories",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Tables",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Payment Modes",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Payments",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Bill Details",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Billarchive Details",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Foods",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Food Components",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Purchase Orders",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Packages",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "System Parameters",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Stock Audits",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Food Expirys",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Search Serials",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Memberships",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Feedbacks Report",
	roles : ["admin"]
});
db.pages.insert({
	pageName: "Revenue By DOW",
	roles : ["admin"]
});

db.pages.insert({
	pageName: "Food Orders",
	roles : ["admin"]
});
db.pages.insert({
	pageName: "Units",
	roles : ["admin"]
});

/************************* Add System Parameters ***************************************************/

db.systemparameters.insert({
	systemParameterName : "Short Title",
	defaultValue : "FooBar",
	description : "Short Title of the Organisation",
	value : "Creeda BGC"
});
db.systemparameters.insert({
	systemParameterName : "Title",
	defaultValue : "FooBar",
	description : "Title of the Organisation",
	value : "Creeda Board Game Cafe"
});

db.systemparameters.insert({
	systemParameterName : "Address on Bill",
	defaultValue : "Rear End, Ground Floor, New Excelsior Cinema, Wallace St., Fort, Mumbai-01.",
	description : "This Address will get printed on the bill.",
	value : "Rear End, Ground Floor, New Excelsior Cinema, Wallace St., Fort, Mumbai-01."
});

db.systemparameters.insert({
	systemParameterName : "Grace Period",
	defaultValue : "15",
	description : "The number of minutes grace for which there are no charges generated.(Must be positive integer)",
	value : "15"
});

db.systemparameters.insert({
	systemParameterName : "Weekend Holiday Today",
	defaultValue : "N",
	description : "Determines whether system will use weekday or weekend rate in calculation of Billing (Y - Weekend Rates; else weekday rates)",
	value : "N"
});

db.systemparameters.insert({
	systemParameterName : "Service Charge",
	defaultValue : "10",
	description : "Service Charge Rate that will be used for bill calculations as percentage(%). This Service Charge is generally goes directly to the attendant and is shown seperately on the bill.",
	value : "10"
});

db.systemparameters.insert({
	systemParameterName : "Service Tax Split",
	defaultValue : "40",
	description : "Service Tax Split that will be used for bill calculations as percentage(%). This is the split of a package of service and goods on which service tax will be charged. This split is generally determined by the service tax authority to be paid on a package where explicit split of service and goods cannot be provided.",
	value : "40"
});

db.systemparameters.insert({
	systemParameterName : "Service Tax",
	defaultValue : "14",
	description : "Service Tax Rate that will be used in bill calculations as percentage(%).",
	value : "14"
});

db.systemparameters.insert({
	systemParameterName : "Vat",
	defaultValue : "12.5",
	description : "Value Added Tax (VAT) Rate that will be used in bill calculations as percentage(%).",
	value : "12.5"
});

db.systemparameters.insert({
	systemParameterName : "Partial Payment Disabled",
	defaultValue : "Y",
	description : "For disabling Partial Payments(Y - To disable Partial Payment; Else enable Partial Payment)",
	value : "Y"
});

db.systemparameters.insert({
	systemParameterName : "Tax included in price",
	defaultValue : "Y",
	description : "All taxes included in price(Y-the price is inclusive of all taxes; else taxes add to price.)",
	value : "Y"
});

db.systemparameters.insert({
	systemParameterName : "Currency Symbol",
	defaultValue : "₹",
	description : "Currency Symbol displayed before prices and revenue throughout the system",
	value : "₹"
});

db.systemparameters.insert({
	systemParameterName : "Stock Buffer",
	defaultValue : "10",
	description : "Set stock buffer during food order.(Must be positive integer)",
	value : "10"
});

db.systemparameters.insert({
	systemParameterName : "Membership Discount Weekend",
	defaultValue : "10",
	description : "Discount percentage for Membership on weekend",
	value : "10"
});

db.systemparameters.insert({
	systemParameterName : "Membership Discount Weekday",
	defaultValue : "20",
	description : "Discount percentage for Membership on weekday",
	value : "20"
});

db.systemparameters.insert({
	systemParameterName : "Membership Monthly Amount",
	defaultValue : "3000",
	description : "Membership Monthly Fees",
	value : "3000"
});

/** *******************************	GST SystemParameters ************************************** **/

db.systemparameters.insert({
	systemParameterName : "Game CGST",
	defaultValue : "14",
	description : "Game CGST Tax Rate that will be used in bill calculations as percentage(%).",
	value : "14"
});

db.systemparameters.insert({
	systemParameterName : "Game SGST",
	defaultValue : "14",
	description : "Game SGST Tax Rate that will be used in bill calculations as percentage(%).",
	value : "14"
});

db.systemparameters.insert({
	systemParameterName : "Game SAC/HSN Code",
	defaultValue : "ABC",
	description : "Game SAC/HSN Code",
	value : "ABC"
});

db.systemparameters.insert({
	systemParameterName : "Food CGST",
	defaultValue : "9",
	description : "Food CGST Tax Rate that will be used in bill calculations as percentage(%).",
	value : "9"
});

db.systemparameters.insert({
	systemParameterName : "Food SGST",
	defaultValue : "9",
	description : "Food SGST Tax Rate that will be used in bill calculations as percentage(%).",
	value : "9"
});

db.systemparameters.insert({
	systemParameterName : "Food SAC/HSN Code",
	defaultValue : "BCD",
	description : "Food SAC/HSN Code",
	value : "BCD"
});

db.systemparameters.insert({
	systemParameterName : "Package CGST",
	defaultValue : "9",
	description : "package CGST Tax Rate that will be used in bill calculations as percentage(%).",
	value : "9"
});

db.systemparameters.insert({
	systemParameterName : "Package SGST",
	defaultValue : "9",
	description : "Package SGST Tax Rate that will be used in bill calculations as percentage(%).",
	value : "9"
});

db.systemparameters.insert({
	systemParameterName : "Package SAC/HSN Code",
	defaultValue : "CDE",
	description : "Package SAC/HSN Code",
	value : "CDE"
});

db.systemparameters.insert({
	systemParameterName : "Membership CGST",
	defaultValue : "14",
	description : "Membership CGST Tax Rate that will be used in bill calculations as percentage(%).",
	value : "14"
});

db.systemparameters.insert({
	systemParameterName : "Membership SGST",
	defaultValue : "14",
	description : "Membership SGST Tax Rate that will be used in bill calculations as percentage(%).",
	value : "14"
});

db.systemparameters.insert({
	systemParameterName : "Membership SAC/HSN Code",
	defaultValue : "DEF",
	description : "Membership SAC/HSN Code",
	value : "DEF"
});

/**	************************************************************************************************************************	**/

db.incrementparameters.insert({
	name : "Payment Reference No.",
	value : "1"
});

db.incrementparameters.insert({
	name : "Bill Number",
	value : "1"
});

 db.incrementparameters.insert({
	name : "Purchase Order No.",
	value : "1"
});

db.incrementparameters.insert({
	name : "Stock Audit No.",
	value : "1"
});

db.incrementparameters.insert({
	name : "Food Expiry No.",
	value : "1"
});

/***************************************************************************************************************************/

db.paymentmodetypes.insert({
	paymentType : "Cash",
	active : true
});

/**********************************************************************************************************/

db.baseunits.insert({
	baseUnit : "unit(s)",
	description : "basic unit for packet or box (e.g. packet of chips)"
});

db.baseunits.insert({
	baseUnit : "ml",
	description : "basic unit for mili-litre (e.g. 150 mili-litres of milk in a glass)"
});

db.baseunits.insert({
	baseUnit : "grm",
	description : "basic unit for grams (e.g. 50 grams of tomato in a sandwitch)"
});

