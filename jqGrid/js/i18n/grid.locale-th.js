/**
 * jqGrid Thai Translation
 * Kittituch Manakul m.kittituch@Gmail.com
 * http://trirand.com/blog/ 
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
**/
/*global jQuery, define */
(function( factory ) {
	"use strict";
	if ( typeof define === "function" && define.amd ) {
		// AMD. Register as an anonymous module.
		define([
			"jquery",
			"../grid.base"
		], factory );
	} else {
		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

$.jgrid = $.jgrid || {};
if(!$.jgrid.hasOwnProperty("regional")) {
	$.jgrid.regional = [];
}
$.jgrid.regional["th"] = {
	defaults : {
		recordtext: "แสดง {0} - {1} จาก {2}",
		emptyrecords: "ไม่พบข้อมูล",
		loadtext: "กำลังร้องขอข้อมูล...",
		pgtext : "หน้า {0} จาก {1}",
		savetext: "Saving...",
		pgfirst : "First Page",
		pglast : "Last Page",
		pgnext : "Next Page",
		pgprev : "Previous Page",
		pgrecs : "Records per Page",
		showhide: "Toggle Expand Collapse Grid",
		// mobile
		pagerCaption : "Grid::Page Settings",
		pageText : "Page:",
		recordPage : "Records per Page",
		nomorerecs : "No more records...",
		scrollPullup: "Pull up to load more...",
		scrollPulldown : "Pull down to refresh...",
		scrollRefresh : "Release to refresh...",
		valT : "checked",
		valF : "unchecked",
		selectLine : "Select row",
		selectAllLines : "Select all rows"
	},
	search : {
		caption: "กำลังค้นหา...",
		Find: "ค้นหา",
		Reset: "คืนค่ากลับ",
		odata: [{ oper:'eq', text:"เท่ากับ"},{ oper:'ne', text:"ไม่เท่ากับ"},{ oper:'lt', text:"น้อยกว่า"},{ oper:'le', text:"ไม่มากกว่า"},{ oper:'gt', text:"มากกกว่า"},{ oper:'ge', text:"ไม่น้อยกว่า"},{ oper:'bw', text:"ขึ้นต้นด้วย"},{ oper:'bn', text:"ไม่ขึ้นต้นด้วย"},{ oper:'in', text:"มีคำใดคำหนึ่งใน"},{ oper:'ni', text:"ไม่มีคำใดคำหนึ่งใน"},{ oper:'ew', text:"ลงท้ายด้วย"},{ oper:'en', text:"ไม่ลงท้ายด้วย"},{ oper:'cn', text:"มีคำว่า"},{ oper:'nc', text:"ไม่มีคำว่า"},{ oper:'nu', text:'is null'},{ oper:'nn', text:'is not null'}, {oper:'bt', text:'between'}],
		groupOps: [	{ op: "และ", text: "ทั้งหมด" },	{ op: "หรือ",  text: "ใดๆ" }	],
		operandTitle : "Click to select search operation.",
		resetTitle : "Reset Search Value",
		addsubgrup : "Add subgroup",
		addrule : "Add rule",
		delgroup : "Delete group",
		delrule : "Delete rule",
		Close : "Close",
		Operand : "Operand : ",
		Operation : "Oper : ",
		filterFor : "filter for"
	},
	edit : {
		addCaption: "เพิ่มข้อมูล",
		editCaption: "แก้ไขข้อมูล",
		bSubmit: "บันทึก",
		bCancel: "ยกเลิก",
		bClose: "ปิด",
		saveData: "คุณต้องการบันทึการแก้ไข ใช่หรือไม่?",
		bYes : "บันทึก",
		bNo : "ละทิ้งการแก้ไข",
		bExit : "ยกเลิก",
		msg: {
			required:"ข้อมูลนี้จำเป็น",
			number:"กรุณากรอกหมายเลขให้ถูกต้อง",
			minValue:"ค่าของข้อมูลนี้ต้องไม่น้อยกว่า",
			maxValue:"ค่าของข้อมูลนี้ต้องไม่มากกว่า",
			email: "อีเมลล์นี้ไม่ถูกต้อง",
			integer: "กรุณากรอกเป็นจำนวนเต็ม",
			date: "กรุณากรอกวันที่ให้ถูกต้อง",
			url: "URL ไม่ถูกต้อง URL จำเป็นต้องขึ้นต้นด้วย 'http://' หรือ 'https://'",
			nodefined : "ไม่ได้ถูกกำหนดค่า!",
			novalue : "ต้องการการคืนค่า!",
			customarray : "ฟังก์ชันที่สร้างขึ้นต้องส่งค่ากลับเป็นแบบแอเรย์",
			customfcheck : "ระบบต้องการฟังก์ชันที่สร้างขึ้นสำหรับการตรวจสอบ!"
			
		}
	},
	view : {
		caption: "เรียกดูข้อมูล",
		bClose: "ปิด"
	},
	del : {
		caption: "ลบข้อมูล",
		msg: "คุณต้องการลบข้อมูลที่ถูกเลือก ใช่หรือไม่?",
		bSubmit: "ต้องการลบ",
		bCancel: "ยกเลิก"
	},
	nav : {
		edittext: "",
		edittitle: "แก้ไขข้อมูล",
		addtext:"",
		addtitle: "เพิ่มข้อมูล",
		deltext: "",
		deltitle: "ลบข้อมูล",
		searchtext: "",
		searchtitle: "ค้นหาข้อมูล",
		refreshtext: "",
		refreshtitle: "รีเฟรช",
		alertcap: "คำเตือน",
		alerttext: "กรุณาเลือกข้อมูล",
		viewtext: "",
		viewtitle: "ดูรายละเอียดข้อมูล",
		savetext: "",
		savetitle: "Save row",
		canceltext: "",
		canceltitle : "Cancel row editing",
		selectcaption : "Actions..."
	},
	col : {
		caption: "กรุณาเลือกคอลัมน์",
		bSubmit: "ตกลง",
		bCancel: "ยกเลิก"
	},
	errors : {
		errcap : "เกิดความผิดพลาด",
		nourl : "ไม่ได้กำหนด URL",
		norecords: "ไม่มีข้อมูลให้ดำเนินการ",
		model : "จำนวนคอลัมน์ไม่เท่ากับจำนวนคอลัมน์โมเดล!"
	},
	formatter : {
		integer : {thousandsSeparator: " ", defaultValue: '0'},
		number : {decimalSeparator:".", thousandsSeparator: " ", decimalPlaces: 2, defaultValue: '0.00'},
		currency : {decimalSeparator:".", thousandsSeparator: " ", decimalPlaces: 2, prefix: "", suffix:"", defaultValue: '0.00'},
		date : {
			dayNames:   [
				"อา", "จ", "อ", "พ", "พฤ", "ศ", "ส",
				"อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศูกร์", "เสาร์"
			],
			monthNames: [
				"ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
				"มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฏาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
			],
			AmPm : ["am","pm","AM","PM"],
			S: function (j) {return ''},
			srcformat: 'Y-m-d',
			newformat: 'd/m/Y',
			parseRe : /[#%\\\/:_;.,\t\s-]/,
			masks : {
				ISO8601Long:"Y-m-d H:i:s",
				ISO8601Short:"Y-m-d",
				ShortDate: "n/j/Y",
				LongDate: "l, F d, Y",
				FullDateTime: "l, F d, Y g:i:s A",
				MonthDay: "F d",
				ShortTime: "g:i A",
				LongTime: "g:i:s A",
				SortableDateTime: "Y-m-d\\TH:i:s",
				UniversalSortableDateTime: "Y-m-d H:i:sO",
				YearMonth: "F, Y"
			},
			reformatAfterEdit : false,
			userLocalTime : false
		},
		baseLinkUrl: '',
		showAction: '',
		target: '',
		checkbox : {disabled:true},
		idName : 'id'
	},
	colmenu : {
		sortasc : "Sort Ascending",
		sortdesc : "Sort Descending",
		columns : "Columns",
		filter : "Filter",
		grouping : "Group By",
		ungrouping : "Ungroup",
		searchTitle : "Get items with value that:",
		freeze : "Freeze",
		unfreeze : "Unfreeze",
		reorder : "Move to reorder",
		hovermenu: "Click for column quick actions"
	},
	clipboard : {
		menus : {
			copy_act : "Copy Selected to Clipboard",
			paste_act : "Paste Update from Clipboard",
			paste_act_add: "Paste Add from Clipboard",
			undo_act : "Undo",
			repeat_act_row : "Repeat row vertically",
			repeat_act_col : "Repeat column horizontally",
			cancel_act : "Cancel"
		},
		msg : {
			text_c : "Text copied to clipboard.",
			select_pos : "Please click position to paste!",
			info_cap : "Information",
			total_row : "Total rows: ",
			insert_row: "Inserted: ",
			update_row: "Updated: "
		},
		errors : {
			enb_prm : "Copy paste disabled in browser, please enable it!",
			copy_err : "Failed to copy to clipboard: ",
			read_err : "Failed to read clipboard contents: ",
			get_data_err : "Can not get data from clipboard or empty!",
			start_ind_err : "Start index of the cell is not valid!",
			local_stor_err : "Local storage not available! Can not store data for undo changes!",
			not_array_err: "Data can not be converted to array"
		}
	}
};
}));
